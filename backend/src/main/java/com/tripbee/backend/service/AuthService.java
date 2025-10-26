package com.tripbee.backend.service;

import com.tripbee.backend.dto.LoginRequest;
import com.tripbee.backend.dto.LoginResponse;
import com.tripbee.backend.model.Account;
import com.tripbee.backend.repository.AccountRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder; // THÊM DÒNG NÀY
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private AccountRepository accountRepository;

    // THÊM TRÌNH MÃ HÓA
    @Autowired
    private PasswordEncoder passwordEncoder;

    public LoginResponse login(LoginRequest loginRequest) {
        // 1. Tìm tài khoản bằng username
        Optional<Account> accountOptional = accountRepository.findByUserName(loginRequest.getUsername());
        if (accountOptional.isEmpty()) {
            System.out.println("No account found for username: " + loginRequest.getUsername());
            return new LoginResponse(false, "Invalid username or password");
        }
        Account account = accountOptional.get();
        System.out.println("Found account: " + account.getUserName());
        System.out.println("Is locked: " + account.isLocked());
        System.out.println("Password match: " + passwordEncoder.matches(loginRequest.getPassword(), account.getPassword()));
        // 3. KIỂM TRA TÀI KHOẢN BỊ KHÓA
        // Dữ liệu SQL của bạn có tài khoản 'lecuong' bị khóa
        if (account.isLocked()) {
            return new LoginResponse(false, "Account is locked");
        }

        // 4. SO SÁNH MẬT KHẨU ĐÃ MÃ HÓA
        // SỬA DÒNG NÀY:
        // TỪ: if (account.getPassword().equals(loginRequest.getPassword())) {
        // THÀNH:
        if (passwordEncoder.matches(loginRequest.getPassword(), account.getPassword())) {

            // 5. Đăng nhập thành công
            // SỬA CÁC DÒNG NÀY:
            // TỪ: account.getUserID() và account.getRole()
            // THÀNH:
            return new LoginResponse(
                    true,
                    "Login successful",
                    account.getUser().getUserID(),    // Lấy ID từ User liên kết
                    account.getUserName(),
                    account.getRole().name()          // Chuyển Enum RoleType thành String
            );
        } else {
            // 6. Sai mật khẩu
            return new LoginResponse(false, "Invalid username or password");
        }
    }

//    @PostConstruct
//    public void generateTestHash() {
//        String plainPassword = "password123";
//        String encodedHash = passwordEncoder.encode(plainPassword);
//        System.out.println("Generated BCrypt hash for '" + plainPassword + "': " + encodedHash);
//    }
}