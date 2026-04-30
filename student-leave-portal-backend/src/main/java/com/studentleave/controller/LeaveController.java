package com.studentleave.controller;

import com.studentleave.model.LeaveRequest;
import com.studentleave.model.User;
import com.studentleave.repository.LeaveRequestRepository;
import com.studentleave.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/leaves")
@CrossOrigin(origins = "*") // Allows React frontend to connect
public class LeaveController {

    @Autowired
    private LeaveRequestRepository leaveRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<LeaveRequest> createLeave(@Valid @RequestBody LeaveRequest request) {
        if (request.getStudent() == null || request.getStudent().getId() == null) {
            return ResponseEntity.badRequest().build();
        }
        Optional<User> student = userRepository.findById(request.getStudent().getId());
        if (student.isPresent()) {
            request.setStudent(student.get());
            request.setStatus("PENDING");
            LeaveRequest saved = leaveRepository.save(request);
            return ResponseEntity.ok(saved);
        }
        return ResponseEntity.badRequest().build();
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<LeaveRequest>> getLeavesByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(leaveRepository.findByStudentId(studentId));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<LeaveRequest>> getPendingLeaves() {
        return ResponseEntity.ok(leaveRepository.findByStatus("PENDING"));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<LeaveRequest> updateLeaveStatus(@PathVariable Long id, @RequestBody LeaveRequest statusUpdate) {
        Optional<LeaveRequest> optionalLeave = leaveRepository.findById(id);
        if (optionalLeave.isPresent()) {
            LeaveRequest leave = optionalLeave.get();
            leave.setStatus(statusUpdate.getStatus());
            return ResponseEntity.ok(leaveRepository.save(leave));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }
}
