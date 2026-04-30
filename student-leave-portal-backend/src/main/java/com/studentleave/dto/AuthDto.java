package com.studentleave.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AuthDto {
    
    public static class RegisterRequest {
        @NotBlank(message = "Name is required")
        private String name;
        
        @NotBlank(message = "Role is required (STUDENT or APPROVER)")
        private String role;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }

    public static class LoginRequest {
        @NotNull(message = "ID is required")
        private Long id;
        
        @NotBlank(message = "Name is required")
        private String name;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }
}
