package com.tripbee.backend.service;

import com.tripbee.backend.dto.ChangePasswordRequest;
import com.tripbee.backend.dto.LoginRequest;
import com.tripbee.backend.dto.LoginResponse;
import com.tripbee.backend.dto.RegisterRequest;
import com.tripbee.backend.model.Account;
import com.tripbee.backend.model.User;
import com.tripbee.backend.model.enums.RoleType;
import com.tripbee.backend.repository.AccountRepository;
import com.tripbee.backend.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public AuthService(AccountRepository accountRepository,
                       UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager, EmailService emailService) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
    }

    public LoginResponse login(LoginRequest loginRequest) {
        try {
            // 1. Xác thực bằng Email và Password
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );
        } catch (Exception e) {
            return new LoginResponse(false, "Invalid email or password");
        }

        // 2. Tìm kiếm Account bằng Email (đã được dùng làm Username)
        var account = accountRepository.findByUserName(loginRequest.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (account.isLocked()) {
            return new LoginResponse(false, "Account is locked");
        }

        String jwtToken = jwtService.generateToken(account);
        String bearerJwtToken = "Bearer " + jwtToken;

        return new LoginResponse(
                true,
                "Login successful",
                bearerJwtToken,
                account.getUser().getUserID(),
                account.getUser().getEmail(),
                account.getRole().name()
        );
    }

    @Transactional
    public LoginResponse register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return new LoginResponse(false, "Email has already been registered");
        }

        User user = new User();
        String userNameToSet = (request.getName() != null && !request.getName().trim().isEmpty())
                ? request.getName()
                : "NewUser";
        user.setName(userNameToSet);
        user.setEmail(request.getEmail());
//        user.setPhoneNumber(request.getPhoneNumber());
        User savedUser = userRepository.save(user);

        Account account = new Account();
        account.setUserName(request.getEmail());
        account.setPassword(passwordEncoder.encode(request.getPassword()));
        account.setRole(RoleType.CUSTOMER);
        account.setLocked(false);
        account.setUser(savedUser);
        accountRepository.save(account);

        emailService.sendRegistrationSuccessEmail(savedUser.getEmail(), savedUser.getName());

        String jwtToken = jwtService.generateToken(account);
        String bearerJwtToken = "Bearer " + jwtToken;

        return new LoginResponse(
                true,
                "Registration successful",
                bearerJwtToken,
                savedUser.getUserID(),
                account.getUserName(),
                account.getRole().name()
        );
    }

    @Transactional
    public void changePassword(ChangePasswordRequest request, Account currentUser) {
        String currentHashedPassword = currentUser.getPassword();

        if (!passwordEncoder.matches(request.getOldPassword(), currentHashedPassword)) {
            throw new IllegalArgumentException("Mật khẩu cũ không chính xác.");
        }

        String newHashedPassword = passwordEncoder.encode(request.getNewPassword());

        currentUser.setPassword(newHashedPassword);
        accountRepository.save(currentUser);
    }
}