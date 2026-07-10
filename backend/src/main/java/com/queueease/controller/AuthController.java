package com.queueease.controller;

import com.queueease.dto.LoginRequest;
import com.queueease.dto.LoginResponse;
import com.queueease.entity.Authority;
import com.queueease.repository.AuthorityRepository;
import com.queueease.service.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthorityRepository authorityRepository;
    private final JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        Authority authority = authorityRepository.findByName(request.getAuthorityName())
                .orElseThrow(() -> new BadCredentialsException("Invalid authority name or password."));

        if (!"admin".equals(request.getPassword())) {
            throw new BadCredentialsException("Invalid authority name or password.");
        }

        String token = jwtService.generateToken(authority.getName());

        return ResponseEntity.ok(LoginResponse.builder()
                .token(token)
                .authorityName(authority.getName())
                .tokenType("Bearer")
                .build());
    }
}
