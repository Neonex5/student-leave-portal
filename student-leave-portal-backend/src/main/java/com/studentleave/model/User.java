package com.studentleave.model;

import jakarta.persistence.*;

import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name cannot be empty")
    private String name;
    
    @NotBlank(message = "Role cannot be empty")
    private String role; // "STUDENT" or "APPROVER"

    @Column(unique = true)
    private String usn; // Student identification number (e.g., 1RI23CS088)

    public User() {}

    public User(String name, String role) {
        this.name = name;
        this.role = role;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getUsn() { return usn; }
    public void setUsn(String usn) { this.usn = usn; }
}
