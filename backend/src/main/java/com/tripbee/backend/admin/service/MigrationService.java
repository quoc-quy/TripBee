package com.tripbee.backend.admin.service;

import com.tripbee.backend.model.Destination;
import com.tripbee.backend.model.Image;
import com.tripbee.backend.model.Tour;
import com.tripbee.backend.repository.DestinationRepository;
import com.tripbee.backend.repository.TourRepository;
import com.tripbee.backend.service.S3Service;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.util.List;

@Service
public class MigrationService {

    private final TourRepository tourRepository;
    private final DestinationRepository destinationRepository;
    private final S3Service s3Service;

    public MigrationService(TourRepository tourRepository, DestinationRepository destinationRepository, S3Service s3Service) {
        this.tourRepository = tourRepository;
        this.destinationRepository = destinationRepository;
        this.s3Service = s3Service;
    }

    /**
     * Chuyển toàn bộ ảnh từ resources/static/images lên AWS S3 và cập nhật DB.
     */
    @Transactional
    public String migrateImagesToS3() {
        int toursUpdated = 0;
        int destinationsUpdated = 0;

        try {
            // 1. Xử lý ảnh cho các Tour
            List<Tour> tours = tourRepository.findAll();
            for (Tour tour : tours) {
                String currentUrl = tour.getImageURL();
                if (currentUrl != null && currentUrl.startsWith("/images/tours/")) {
                    String newS3Url = uploadLocalFileToS3(currentUrl);
                    if (newS3Url != null) {
                        tour.setImageURL(newS3Url);
                        tourRepository.save(tour);
                        toursUpdated++;
                    }
                }
            }

            // 2. Xử lý ảnh cho các Destination
            List<Destination> destinations = destinationRepository.findAll();
            for (Destination dest : destinations) {
                List<Image> images = dest.getImages();
                if (images != null) {
                    boolean hasUpdate = false;
                    for (Image img : images) {
                        // Class Image sử dụng trường 'url'
                        String currentUrl = img.getUrl();
                        if (currentUrl != null && currentUrl.startsWith("/images/destinations/")) {
                            String newS3Url = uploadLocalFileToS3(currentUrl);
                            if (newS3Url != null) {
                                img.setUrl(newS3Url);
                                hasUpdate = true;
                            }
                        }
                    }
                    if (hasUpdate) {
                        destinationRepository.save(dest);
                        destinationsUpdated++;
                    }
                }
            }

            return String.format("Migration thành công! Đã chuyển %d tours và %d destinations lên S3.", toursUpdated, destinationsUpdated);

        } catch (Exception e) {
            e.printStackTrace();
            return "Migration thất bại do lỗi hệ thống: " + e.getMessage();
        }
    }

    /**
     * Đọc file từ thư mục static và upload lên S3.
     */
    private String uploadLocalFileToS3(String relativePath) {
        try {
            // Chuyển đường dẫn tương đối thành đường dẫn trong classpath (resources/static/...)
            String resourcePath = "static" + relativePath;
            Resource resource = new ClassPathResource(resourcePath);

            if (!resource.exists()) {
                System.out.println("Cảnh báo: Không tìm thấy file cục bộ tại " + resourcePath);
                return null;
            }

            File file = resource.getFile();
            byte[] content = Files.readAllBytes(file.toPath());
            String contentType = Files.probeContentType(file.toPath());
            if (contentType == null) contentType = "image/jpeg"; // Mặc định nếu không xác định được

            // Tạo implementation của MultipartFile mà không cần thư viện bên ngoài
            MultipartFile multipartFile = createMultipartFile(file, content, contentType);

            // Upload lên S3 thông qua service đã cấu hình
            return s3Service.uploadFile(multipartFile);

        } catch (IOException e) {
            System.err.println("Lỗi khi xử lý file " + relativePath + ": " + e.getMessage());
            return null;
        }
    }

    /**
     * Hàm helper tạo MultipartFile từ mảng byte.
     */
    private MultipartFile createMultipartFile(File file, byte[] content, String contentType) {
        return new MultipartFile() {
            @Override public String getName() { return "file"; }
            @Override public String getOriginalFilename() { return file.getName(); }
            @Override public String getContentType() { return contentType; }
            @Override public boolean isEmpty() { return content.length == 0; }
            @Override public long getSize() { return content.length; }
            @Override public byte[] getBytes() { return content; }
            @Override public InputStream getInputStream() { return new ByteArrayInputStream(content); }
            @Override public void transferTo(File dest) throws IOException { Files.copy(file.toPath(), dest.toPath()); }
        };
    }
}