package com.tripbee.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AnonymousCredentialsProvider;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
public class AwsConfig {

    @Value("${AWS_ACCESS_KEY_ID:${aws.access-key:}}")
    private String accessKey;

    @Value("${AWS_SECRET_ACCESS_KEY:${aws.secret-key:}}")
    private String secretKey;

    @Value("${AWS_REGION:${aws.region:ap-southeast-1}}")
    private String region;

    @Bean
    public S3Client s3Client() {
        // Ngăn chặn crash khi Railway đang build (chưa nạp biến môi trường) hoặc khi chạy thiếu file config
        if (accessKey == null || accessKey.trim().isEmpty() || secretKey == null || secretKey.trim().isEmpty()) {
            return S3Client.builder()
                    .region(Region.of(region))
                    .credentialsProvider(AnonymousCredentialsProvider.create()) // Dùng quyền ẩn danh tạm thời để vượt qua lỗi khởi động
                    .build();
        }

        AwsBasicCredentials credentials = AwsBasicCredentials.create(accessKey, secretKey);
        return S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(credentials))
                .build();
    }
}