package com.tripbee.backend.service;

import com.tripbee.backend.dto.ChatMessage;
import com.tripbee.backend.dto.ChatResponse;
import com.tripbee.backend.model.Tour;
import com.tripbee.backend.repository.TourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiChatService {

    @Value("${ai.api.key}")
    private String apiKey;

    @Value("${ai.model}")
    private String aiModel;

    private final String apiUrl = "https://openrouter.ai/api/v1/chat/completions";
    private final RestTemplate restTemplate;

    public AiChatService() {
        // Tránh lỗi timeout ở Frontend bằng cách nới lỏng thời gian chờ
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5000);
        factory.setReadTimeout(25000);
        this.restTemplate = new RestTemplate(factory);
    }

    @Autowired
    private TourRepository tourRepository;

    public ChatResponse getChatResponse(List<ChatMessage> messages) {
        String userQuestion = messages.get(messages.size() - 1).getContent().toLowerCase();

        // 1. Nhận diện địa điểm để tìm tour chính xác
        String[] locations = {"đà lạt", "nha trang", "đà nẵng", "phú quốc", "sapa", "hạ long", "hà nội", "hội an", "huế", "vũng tàu", "ninh bình", "mai châu", "mộc châu", "cần thơ"};
        String keyword = "";
        for (String loc : locations) {
            if (userQuestion.contains(loc)) { keyword = loc; break; }
        }

        // 2. Lấy tour từ DB
        List<Tour> tours = new ArrayList<>();
        if (!keyword.isEmpty()) {
            tours = tourRepository.findByTitleContainingIgnoreCase(keyword);
        }
        // Nếu không có tour nào khớp, lấy 4 tour gợi ý bất kỳ để test giao diện
        if (tours.isEmpty()) {
            tours = tourRepository.findAll();
            if (tours.size() > 4) tours = tours.subList(0, 4);
        }

        // 3. Rút trích dữ liệu an toàn (Chống sập JSON)
        List<Map<String, Object>> safeTours = new ArrayList<>();
        for (Tour t : tours) {
            Map<String, Object> map = new HashMap<>();

            // SỬA Ở ĐÂY: Dùng đúng tên hàm getter trong class Tour.java của bạn
            map.put("tourID", t.getTourID());
            map.put("title", t.getTitle());
            map.put("imageURL", t.getImageURL());
            map.put("finalPrice", t.getPriceAdult());

            safeTours.add(map);
        }

        // 4. Lệnh tối thượng cho AI
        String systemInstruction = "Bạn là TripBee, trợ lý ảo du lịch. "
                + "Hệ thống đã hiển thị các thẻ tour tương ứng bằng giao diện trực quan ở phía dưới. "
                + "TUYỆT ĐỐI KHÔNG liệt kê chi tiết tên, giá, hay lịch trình tour ra văn bản. "
                + "Chỉ được nói một câu giới thiệu ngắn gọn, ví dụ: 'Dưới đây là các tour phù hợp nhất mình tìm được cho bạn nhé:', sau đó dừng lại.";

        String aiReply = "Xin lỗi, hiện tại mình không thể trả lời.";

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            List<Map<String, String>> finalMessages = new ArrayList<>();
            Map<String, String> sysMsg = new HashMap<>();
            sysMsg.put("role", "system");
            sysMsg.put("content", systemInstruction);
            finalMessages.add(sysMsg);

            for (ChatMessage msg : messages) {
                Map<String, String> m = new HashMap<>();
                m.put("role", msg.getRole());
                m.put("content", msg.getContent());
                finalMessages.add(m);
            }

            Map<String, Object> body = new HashMap<>();
            body.put("model", aiModel);
            body.put("messages", finalMessages);
            body.put("temperature", 0.5);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, entity, Map.class);

            if (response.getBody() != null && response.getBody().containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> msg = (Map<String, Object>) choices.get(0).get("message");
                    aiReply = (String) msg.get("content");
                }
            }
        } catch (Exception e) {
            System.err.println("Lỗi AI: " + e.getMessage());
            aiReply = "Hệ thống đang bận xíu, bạn chờ lát nhé!";
        }

        return new ChatResponse(aiReply, safeTours);
    }
}