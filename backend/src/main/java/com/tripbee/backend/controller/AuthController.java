package com.tripbee.backend.controller;

import com.tripbee.backend.dto.LoginRequest;
import com.tripbee.backend.dto.LoginResponse;
import com.tripbee.backend.dto.RegisterRequest;
import com.tripbee.backend.service.AuthService;
// import lombok.RequiredArgsConstructor; // <-- XÓA DÒNG NÀY
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
// @RequiredArgsConstructor // <-- XÓA DÒNG NÀY
public class AuthController {

    private final AuthService authService;

    // (1) THÊM CONSTRUCTOR NÀY VÀO
    // Spring sẽ tự động "tiêm" bean AuthService vào đây
    public AuthController(AuthService authService) {
        this.authService = authService;
    }


    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.login(loginRequest);

        // (2) Chúng ta đã thêm isSuccess() vào LoginResponse ở bước trước
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@RequestBody RegisterRequest registerRequest) {
        LoginResponse response = authService.register(registerRequest);

        // (3) Tương tự, dùng isSuccess()
        if (response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            // 409 Conflict (Username/Email đã tồn tại)
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }
    }
}