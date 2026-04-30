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
        // Simple registration: just create a new User. 
        // In a real app we'd check for duplicates or use passwords.
        User newUser = new User();
        newUser.setName(request.getName());
        newUser.setRole(request.getRole().toUpperCase());
        
        User savedUser = userRepository.save(newUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthDto.LoginRequest request) {
        Optional<User> optionalUser = userRepository.findById(request.getId());
        
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            // Verify that the ID matches the Name exactly (case insensitive for UX)
            if (user.getName().equalsIgnoreCase(request.getName())) {
                return ResponseEntity.ok(user);
            }
        }
        
        // If not found or name doesn't match
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("{\"message\": \"Invalid ID or Name. Please check your credentials.\"}");
    }
}
