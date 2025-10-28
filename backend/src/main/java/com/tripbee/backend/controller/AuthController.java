package com.tripbee.backend.controller;

import com.tripbee.backend.dto.LoginRequest;
import com.tripbee.backend.dto.LoginResponse;
import com.tripbee.backend.dto.RegisterRequest;
import com.tripbee.backend.dto.UserProfileResponse; // (1) THÊM IMPORT
import com.tripbee.backend.model.Account; // (2) THÊM IMPORT
import com.tripbee.backend.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal; // (3) THÊM IMPORT
import org.springframework.web.bind.annotation.GetMapping; // (4) THÊM IMPORT
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.login(loginRequest);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@RequestBody RegisterRequest registerRequest) {
        LoginResponse response = authService.register(registerRequest);

        if (response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }
    }

    // (5) THÊM PHƯƠNG THỨC MỚI
    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMyProfile(
            @AuthenticationPrincipal Account currentUser
    ) {
        // @AuthenticationPrincipal sẽ tự động lấy thông tin user đã được xác thực
        // từ token (thông qua JwtAuthFilter) và tiêm vào biến currentUser.

        if (currentUser == null) {
            // Trường hợp này hiếm khi xảy ra vì SecurityConfig sẽ chặn
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Dùng DTO mới của chúng ta để tạo response
        UserProfileResponse response = new UserProfileResponse(currentUser);
        return ResponseEntity.ok(response);
    }
}