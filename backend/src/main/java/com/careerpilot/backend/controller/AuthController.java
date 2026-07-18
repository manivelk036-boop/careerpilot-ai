package com.careerpilot.backend.controller;

import com.careerpilot.backend.model.Student;
import com.careerpilot.backend.repository.StudentRepository;
import com.careerpilot.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private StudentRepository studentRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (studentRepository.findByEmail(request.email).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Email is already registered."));
        }

        Student student = new Student();
        student.setName(request.name);
        student.setEmail(request.email);
        // Hash password with BCrypt
        student.setPassword(passwordEncoder.encode(request.password));
        student.setCollege(request.college);
        student.setDepartment(request.department);
        student.setYear(request.year);
        student.setCgpa(request.cgpa);
        student.setIsOnboarded(false);
        student.setBaselineAssessmentCompleted(false);
        student.setIsLoggedIn(true);

        Student saved = studentRepository.save(student);
        String token = jwtUtil.generateToken(saved.getEmail());

        return ResponseEntity.ok(buildAuthResponse(token, saved));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<Student> optStudent = studentRepository.findByEmail(request.email);

        // Demo account auto-creation (only for specific known demo emails)
        if (optStudent.isEmpty() && isDemoEmail(request.email)) {
            Student demo = createDemoStudent(request.email, request.password);
            Student saved = studentRepository.save(demo);
            String token = jwtUtil.generateToken(saved.getEmail());
            return ResponseEntity.ok(buildAuthResponse(token, saved));
        }

        if (optStudent.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid email or password."));
        }

        Student student = optStudent.get();

        // Verify BCrypt password
        boolean passwordMatches = false;
        if (student.getPassword() != null) {
            if (student.getPassword().startsWith("$2a$") || student.getPassword().startsWith("$2b$")) {
                // BCrypt hashed
                passwordMatches = passwordEncoder.matches(request.password, student.getPassword());
            } else {
                // Plain text (legacy — upgrade it)
                passwordMatches = request.password != null && request.password.equals(student.getPassword());
                if (passwordMatches) {
                    // Upgrade to BCrypt
                    student.setPassword(passwordEncoder.encode(request.password));
                    studentRepository.save(student);
                }
            }
        }

        if (!passwordMatches) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid email or password."));
        }

        student.setIsLoggedIn(true);
        Student saved = studentRepository.save(student);
        String token = jwtUtil.generateToken(saved.getEmail());

        return ResponseEntity.ok(buildAuthResponse(token, saved));
    }

    private boolean isDemoEmail(String email) {
        return email != null && (
            email.endsWith("@demo.com") ||
            email.endsWith("@example.com") ||
            email.equals("alex@college.edu")
        );
    }

    private Map<String, Object> buildAuthResponse(String token, Student student) {
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("student", student);
        return response;
    }

    private Student createDemoStudent(String email, String password) {
        Student demo = new Student();
        demo.setName("Alex Johnson");
        demo.setEmail(email);
        demo.setPassword(passwordEncoder.encode(password != null ? password : "password"));
        demo.setCollege("Anna University");
        demo.setDepartment("Computer Science");
        demo.setYear(3);
        demo.setCgpa(8.2);
        demo.setIsOnboarded(true);
        demo.setBaselineAssessmentCompleted(true);
        demo.setIsLoggedIn(true);
        demo.setXp(12400);
        demo.setCoins(850);
        demo.setStreak(12);
        demo.setPlacementScore(68);
        demo.getSkills().add("HTML");
        demo.getSkills().add("CSS");
        demo.getSkills().add("JavaScript");
        demo.getSkills().add("Java");
        demo.getBadges().add("first-steps");
        demo.getBadges().add("first-quiz");
        demo.getTopicsCompleted().add("java-variables");
        demo.getTopicsCompleted().add("java-loops");
        demo.getPlacementBreakdown().put("technical", 72);
        demo.getPlacementBreakdown().put("communication", 65);
        demo.getPlacementBreakdown().put("aptitude", 75);
        return demo;
    }

    // ── Request DTOs ─────────────────────────────────────────

    public static class RegisterRequest {
        public String name;
        public String email;
        public String password;
        public String college;
        public String department;
        public Integer year;
        public Double cgpa;
    }

    public static class LoginRequest {
        public String email;
        public String password;
    }
}
