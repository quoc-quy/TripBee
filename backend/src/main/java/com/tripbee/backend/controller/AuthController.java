package com.tripbee.backend.controller;

import com.tripbee.backend.dto.*;
import com.tripbee.backend.model.Account; // (2) THÊM IMPORT
import com.tripbee.backend.model.enums.RoleType;
import com.tripbee.backend.service.AuthService;
import com.tripbee.backend.service.UserService;
import jakarta.servlet.http.Cookie;

import jakarta.servlet.http.HttpServletResponse;

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

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordRequest request,
            @AuthenticationPrincipal Account currentUser
    ) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            authService.changePassword(request, currentUser);
            return ResponseEntity.ok("Đổi mật khẩu thành công.");
        } catch (IllegalArgumentException e) {
            // Lỗi từ AuthService (mật khẩu cũ không chính xác)
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            // Các lỗi khác
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi server.");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<LoginResponse> logout() {
        // Trong kiến trúc JWT không trạng thái, việc logout thực tế xảy ra ở client
        // khi nó xóa token. Backend chỉ cần trả về thành công.
        // Token sẽ hết hạn theo thời gian (EXPIRATION_MS).
        return ResponseEntity.ok(new LoginResponse(true, "Logout successful"));
    }

    // backend/src/main/java/com/tripbee/backend/controller/AuthController.java

    @PostMapping("/admin/login")
    public ResponseEntity<?> adminLogin(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        LoginResponse loginResponse = authService.login(loginRequest);

        // Kiểm tra Role bằng String
        if (loginResponse.getRole() == null || !loginResponse.getRole().equals("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bạn không có quyền truy cập admin");
        }

        // Xử lý Token để bỏ chữ "Bearer " trước khi lưu vào Cookie
        String rawToken = loginResponse.getToken();
        if (rawToken != null && rawToken.startsWith("Bearer ")) {
            rawToken = rawToken.substring(7);
        }

        Cookie adminCookie = new Cookie("admin_access_token", rawToken);
        adminCookie.setHttpOnly(true);
        adminCookie.setSecure(false); // Để false khi chạy localhost
        adminCookie.setPath("/");
        adminCookie.setMaxAge(-1);

        response.addCookie(adminCookie);
        return ResponseEntity.ok(loginResponse);
    }
}