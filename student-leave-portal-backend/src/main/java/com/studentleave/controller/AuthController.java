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
        newUser.setPassword(request.getPassword()); // Save password
        
        // If it's a student, save the USN
        if ("STUDENT".equalsIgnoreCase(request.getRole())) {
            if (request.getUsn() == null || request.getUsn().isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"message\": \"USN is required for students.\"}");
            }
            
            // Check if USN already exists
            if (userRepository.findByUsn(request.getUsn().toUpperCase()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("{\"message\": \"Already registered with this USN.\"}");
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
        
        // If not found by USN, try searching by numeric ID
        if (optionalUser.isEmpty()) {
            try {
                Long id = Long.parseLong(request.getLoginId());
                optionalUser = userRepository.findById(id);
            } catch (NumberFormatException e) {
                // Not a numeric ID
            }
        }
        
        // If still not found, try searching by Name (for Teachers who don't enter an ID)
        if (optionalUser.isEmpty()) {
            optionalUser = userRepository.findByName(request.getName());
        }
        
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            // Verify Password
            if (user.getPassword().equals(request.getPassword())) {
                return ResponseEntity.ok(user);
            }
        }

        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("{\"message\": \"Invalid ID/USN, Name, or Password.\"}");
    }
}
