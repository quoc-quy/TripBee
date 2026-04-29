package com.tripbee.backend.controller;

import com.tripbee.backend.dto.ChatRequest;
import com.tripbee.backend.dto.ChatResponse;
import com.tripbee.backend.service.AiChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = {"http://localhost:5173", "https://tripbeefrontend.vercel.app"}, allowedHeaders = "*", methods = {RequestMethod.POST, RequestMethod.GET})
public class AiChatController {

    @Autowired
    private AiChatService aiChatService;

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {

        // Gọi service và nhận về ChatResponse (bao gồm cả reply và danh sách tour)
        ChatResponse response = aiChatService.getChatResponse(request.getMessages());

        // Spring Boot sẽ tự động chuyển đối tượng thành chuỗi JSON
        // Dạng: { "reply": "Dưới đây là các tour...", "tours": [ {tourID: 1, ...}, {...} ] }
        return ResponseEntity.ok(response);
    }
}