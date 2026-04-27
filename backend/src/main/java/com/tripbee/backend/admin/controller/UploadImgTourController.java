package com.tripbee.backend.admin.controller;

import com.tripbee.backend.service.S3Service;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/admin/uploads") 
public class UploadImgTourController {

    private final S3Service s3Service;

    public UploadImgTourController(S3Service s3Service) {
        this.s3Service = s3Service;
    }

    @PostMapping("/tour-image") 
    public ResponseEntity<?> uploadTourImage(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File ảnh không được để trống!");
            }

            // Gọi service để upload lên AWS S3 và nhận URL trả về
            String imageUrl = s3Service.uploadFile(file);

            // Trả về Object JSON { "url": "https://..." }
            return ResponseEntity.ok(new UploadResponse(imageUrl));

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi I/O khi xử lý ảnh tour đẩy lên S3: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Đã xảy ra lỗi hệ thống trong quá trình upload ảnh tour!");
        }
    }

    // DTO để parse ra JSON { "url": "..." }
    public record UploadResponse(String url) {}
}
