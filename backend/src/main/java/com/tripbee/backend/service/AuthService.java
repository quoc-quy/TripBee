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
public class AuthService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

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

    public LoginResponse login(LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );
        } catch (Exception e) {
            return new LoginResponse(false, "Invalid username or password");
        }


        var account = accountRepository.findByUserName(loginRequest.getUsername())
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
                account.getUsername(),
                account.getRole().name()
        );
    }

    @Transactional
    public LoginResponse register(RegisterRequest request) {
        if (accountRepository.findByUserName(request.getUsername()).isPresent()) {
            return new LoginResponse(false, "Username already exists");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return new LoginResponse(false, "Email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        User savedUser = userRepository.save(user);

        Account account = new Account();
        account.setUserName(request.getUsername());
        account.setPassword(passwordEncoder.encode(request.getPassword()));
        account.setRole(RoleType.CUSTOMER);
        account.setLocked(false);
        account.setUser(savedUser);
        accountRepository.save(account);

        String jwtToken = jwtService.generateToken(account);
        String bearerJwtToken = "Bearer " + jwtToken;


        return new LoginResponse(
                true,
                "Registration successful",
                bearerJwtToken,
                savedUser.getUserID(),
                account.getUsername(),
                account.getRole().name()
        );
    }
}