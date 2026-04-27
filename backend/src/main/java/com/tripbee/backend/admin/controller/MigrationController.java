package com.tripbee.backend.admin.controller;

import com.tripbee.backend.admin.service.MigrationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/system")
public class MigrationController {

    private final MigrationService migrationService;

    public MigrationController(MigrationService migrationService) {
        this.migrationService = migrationService;
    }

    // API này chỉ nên gọi MỘT LẦN duy nhất
    @PostMapping("/migrate-images-to-s3")
    public ResponseEntity<String> runMigration() {
        String result = migrationService.migrateImagesToS3();
        return ResponseEntity.ok(result);
    }
}