package com.studentleave.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AuthDto {
    
    public static class RegisterRequest {
        @NotBlank(message = "Name is required")
        private String name;
        
        @NotBlank(message = "Role is required (STUDENT or APPROVER)")
        private String role;

        private String usn; // Optional for teachers, required for students

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public String getUsn() { return usn; }
        public void setUsn(String usn) { this.usn = usn; }
    }

    public static class LoginRequest {
        @NotBlank(message = "Login ID or USN is required")
        private String loginId;
        
        @NotBlank(message = "Name is required")
        private String name;

        public String getLoginId() { return loginId; }
        public void setLoginId(String loginId) { this.loginId = loginId; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }
}
