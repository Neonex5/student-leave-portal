package com.studentleave.controller;

import com.studentleave.dto.AuthDto;
import com.studentleave.model.User;
import com.studentleave.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody AuthDto.RegisterRequest request) {
        User newUser = new User();
        newUser.setName(request.getName());
        newUser.setRole(request.getRole().toUpperCase());
        
        // If it's a student, save the USN
        if ("STUDENT".equalsIgnoreCase(request.getRole())) {
            if (request.getUsn() == null || request.getUsn().isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"message\": \"USN is required for students.\"}");
            }
            newUser.setUsn(request.getUsn().toUpperCase());
        }
        
        User savedUser = userRepository.save(newUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthDto.LoginRequest request) {
        Optional<User> optionalUser;
        
        // Try searching by USN first
        optionalUser = userRepository.findByUsn(request.getLoginId().toUpperCase());
        
        // If not found by USN, try searching by numeric ID (for teachers)
        if (optionalUser.isEmpty()) {
            try {
                Long id = Long.parseLong(request.getLoginId());
                optionalUser = userRepository.findById(id);
            } catch (NumberFormatException e) {
                // Not a numeric ID, and USN failed, so user not found
            }
        }
        
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.getName().equalsIgnoreCase(request.getName())) {
                return ResponseEntity.ok(user);
            }
        }
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("{\"message\": \"Invalid Login ID/USN or Name.\"}");
    }
}
