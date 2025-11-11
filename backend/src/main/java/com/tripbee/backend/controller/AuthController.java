package com.tripbee.backend.controller;

import com.tripbee.backend.dto.*;
import com.tripbee.backend.model.Account; // (2) THÊM IMPORT
import com.tripbee.backend.service.AuthService;
import com.tripbee.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal; // (3) THÊM IMPORT
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
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

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMyProfile(
            @AuthenticationPrincipal Account currentUser
    ) {


        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Dùng DTO mới của chúng ta để tạo response
        UserProfileResponse response = new UserProfileResponse(currentUser);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileResponse> updateMyProfile(
            @RequestBody UserUpdateRequest request,
            @AuthenticationPrincipal Account currentUser
    ) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserProfileResponse updatedProfile = userService.updateUserProfile(request, currentUser);
        return ResponseEntity.ok(updatedProfile);
    }

    @PostMapping("/logout")
    public ResponseEntity<LoginResponse> logout() {
        // Trong kiến trúc JWT không trạng thái, việc logout thực tế xảy ra ở client
        // khi nó xóa token. Backend chỉ cần trả về thành công.
        // Token sẽ hết hạn theo thời gian (EXPIRATION_MS).
        return ResponseEntity.ok(new LoginResponse(true, "Logout successful"));
    }
}