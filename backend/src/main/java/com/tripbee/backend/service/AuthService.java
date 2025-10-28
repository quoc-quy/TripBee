package com.tripbee.backend.service;

import com.tripbee.backend.dto.LoginRequest;
import com.tripbee.backend.dto.LoginResponse;
import com.tripbee.backend.dto.RegisterRequest;
import com.tripbee.backend.model.Account;
import com.tripbee.backend.model.User;
import com.tripbee.backend.model.enums.RoleType;
import com.tripbee.backend.repository.AccountRepository;
import com.tripbee.backend.repository.UserRepository;
// import lombok.RequiredArgsConstructor; // <-- XÓA DÒNG NÀY
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
// @RequiredArgsConstructor // <-- XÓA DÒNG NÀY
public class AuthService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    // (1) THÊM CONSTRUCTOR THỦ CÔNG VỚI TẤT CẢ 5 BIẾN
    public AuthService(AccountRepository accountRepository,
                       UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }


    // Cập nhật hàm login để trả về Token
    public LoginResponse login(LoginRequest loginRequest) {
        // 1. Xác thực người dùng (username, password)
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );
        } catch (Exception e) {
            // (2) Sử dụng constructor (boolean success, String message)
            return new LoginResponse(false, "Invalid username or password");
        }


        // 2. Nếu xác thực thành công, tải thông tin Account
        var account = accountRepository.findByUserName(loginRequest.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // 3. Kiểm tra tài khoản bị khóa
        if (account.isLocked()) {
            // (3) Sử dụng constructor (boolean success, String message)
            return new LoginResponse(false, "Account is locked");
        }

        // 4. Tạo JWT token
        String jwtToken = jwtService.generateToken(account);

        // 5. Trả về response (sử dụng constructor đầy đủ)
        return new LoginResponse(
                true,
                "Login successful",
                jwtToken,
                account.getUser().getUserID(),
                account.getUsername(),
                account.getRole().name()
        );
    }

    // Thêm hàm register
    @Transactional
    public LoginResponse register(RegisterRequest request) {
        // 1. Kiểm tra username hoặc email đã tồn tại chưa
        // (4) Dùng các getter thủ công chúng ta đã thêm vào RegisterRequest
        if (accountRepository.findByUserName(request.getUsername()).isPresent()) {
            return new LoginResponse(false, "Username already exists");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return new LoginResponse(false, "Email already exists");
        }

        // 2. Tạo User mới
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        User savedUser = userRepository.save(user);

        // 3. Tạo Account mới
        Account account = new Account();
        account.setUserName(request.getUsername());
        account.setPassword(passwordEncoder.encode(request.getPassword()));
        account.setRole(RoleType.CUSTOMER);
        account.setLocked(false);
        account.setUser(savedUser);
        accountRepository.save(account);

        // 4. Tạo token cho người dùng mới
        String jwtToken = jwtService.generateToken(account);

        // 5. Trả về response (sử dụng constructor đầy đủ)
        return new LoginResponse(
                true,
                "Registration successful",
                jwtToken,
                savedUser.getUserID(),
                account.getUsername(),
                account.getRole().name()
        );
    }
}