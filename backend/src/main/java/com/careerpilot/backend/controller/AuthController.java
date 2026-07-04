package com.careerpilot.backend.controller;

import com.careerpilot.backend.model.Student;
import com.careerpilot.backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private StudentRepository studentRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (studentRepository.findByEmail(request.email).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is already registered.");
        }

        Student student = new Student();
        student.setName(request.name);
        student.setEmail(request.email);
        student.setPassword(request.password);
        student.setCollege(request.college);
        student.setDepartment(request.department);
        student.setYear(request.year);
        student.setCgpa(request.cgpa);
        student.setIsOnboarded(false);
        student.setBaselineAssessmentCompleted(false);
        student.setIsLoggedIn(true);

        Student saved = studentRepository.save(student);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<Student> optStudent = studentRepository.findByEmail(request.email);

        if (optStudent.isEmpty()) {
            // Auto-create demo/example account for quick try
            if (request.email.endsWith("demo.com") || request.email.endsWith("example.com") || request.email.equals("alex@college.edu")) {
                Student demo = new Student();
                demo.setName("Alex Johnson");
                demo.setEmail(request.email);
                demo.setPassword(request.password == null ? "password" : request.password);
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
                demo.setCommunicationScore(65);
                demo.setResumeScore(72);
                demo.setMockInterviewsDone(2);

                demo.getSkills().add("HTML");
                demo.getSkills().add("CSS");
                demo.getSkills().add("JavaScript");
                demo.getSkills().add("Java Basics");

                demo.getBadges().add("first-steps");
                demo.getBadges().add("roadmap-start");
                demo.getBadges().add("first-quiz");
                demo.getBadges().add("streak-7");

                demo.getTopicsCompleted().add("java-variables");
                demo.getTopicsCompleted().add("java-loops");
                demo.getTopicsCompleted().add("java-arrays");
                demo.getTopicsCompleted().add("java-oop-basics");

                demo.getPlacementBreakdown().put("technical", 72);
                demo.getPlacementBreakdown().put("communication", 65);
                demo.getPlacementBreakdown().put("problemSolving", 70);
                demo.getPlacementBreakdown().put("interviewReadiness", 58);
                demo.getPlacementBreakdown().put("certifications", 60);
                demo.getPlacementBreakdown().put("projects", 55);
                demo.getPlacementBreakdown().put("aptitude", 75);
                demo.getPlacementBreakdown().put("internship", 40);

                demo.getAptitudeScores().put("quant", 72);
                demo.getAptitudeScores().put("logical", 68);
                demo.getAptitudeScores().put("verbal", 75);

                demo.getStudyStreak().clear();
                for (int i = 0; i < 7; i++) {
                    demo.getStudyStreak().add(i != 2);
                }

                Student saved = studentRepository.save(demo);
                return ResponseEntity.ok(saved);
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password.");
        }

        Student student = optStudent.get();
        // Plain text password comparison for local development
        if (request.password != null && !request.password.equals(student.getPassword())) {
            // For simple demo, if password was empty or matches, let it pass
            if (student.getPassword() != null && !student.getPassword().isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password.");
            }
        }

        student.setIsLoggedIn(true);
        Student saved = studentRepository.save(student);
        return ResponseEntity.ok(saved);
    }

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
