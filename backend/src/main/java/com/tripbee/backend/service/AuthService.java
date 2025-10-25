package com.tripbee.backend.service;

import com.tripbee.backend.dto.LoginRequest;
import com.tripbee.backend.dto.LoginResponse;
import com.tripbee.backend.model.Account;
import com.tripbee.backend.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private AccountRepository accountRepository;

    public LoginResponse login(LoginRequest loginRequest) {
        // Dòng này sẽ hết lỗi vì LoginRequest đã có getUsername()
        Optional<Account> accountOptional = accountRepository.findByUserName(loginRequest.getUsername());

        // 2. Nếu không tìm thấy username
        if (accountOptional.isEmpty()) {
            // SỬA DÒNG NÀY:
            // TỪ: return LoginResponse.builder()...
            // THÀNH:
            return new LoginResponse(false, "Invalid username or password");
        }

        Account account = accountOptional.get();

        // 3. So sánh mật khẩu (Các hàm getPassword() sẽ hết lỗi)
        if (account.getPassword().equals(loginRequest.getPassword())) {

            // 4. Đăng nhập thành công
            // SỬA CÁC DÒNG NÀY:
            // TỪ: return LoginResponse.builder()...
            // THÀNH:
            return new LoginResponse(
                    true,
                    "Login successful",
                    account.getUserID(),
                    account.getUserName(),
                    account.getRole()
            );
        } else {
            // 5. Sai mật khẩu
            // SỬA DÒNG NÀY:
            // TỪ: return LoginResponse.builder()...
            // THÀNH:
            return new LoginResponse(false, "Invalid username or password");
        }
    }
}