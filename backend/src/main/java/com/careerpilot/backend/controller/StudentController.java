package com.careerpilot.backend.controller;

import com.careerpilot.backend.model.Student;
import com.careerpilot.backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @GetMapping("/{email}")
    public ResponseEntity<?> getStudent(@PathVariable String email) {
        Optional<Student> student = studentRepository.findByEmail(email);
        if (student.isPresent()) {
            return ResponseEntity.ok(student.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found.");
    }

    @PutMapping("/{email}/sync")
    public ResponseEntity<?> syncStudent(@PathVariable String email, @RequestBody Student updatedState) {
        Optional<Student> optStudent = studentRepository.findByEmail(email);
        if (optStudent.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found.");
        }

        Student student = optStudent.get();
        // Update all syncable state properties
        student.setName(updatedState.getName());
        student.setCollege(updatedState.getCollege());
        student.setDepartment(updatedState.getDepartment());
        student.setYear(updatedState.getYear());
        student.setCgpa(updatedState.getCgpa());
        student.setCareerGoal(updatedState.getCareerGoal());
        
        student.setXp(updatedState.getXp());
        student.setCoins(updatedState.getCoins());
        student.setStreak(updatedState.getStreak());
        student.setLastLoginDate(updatedState.getLastLoginDate());
        student.setPlacementScore(updatedState.getPlacementScore());
        student.setCommunicationScore(updatedState.getCommunicationScore());
        student.setResumeScore(updatedState.getResumeScore());
        student.setMockInterviewsDone(updatedState.getMockInterviewsDone());
        student.setIsOnboarded(updatedState.getIsOnboarded());
        student.setBaselineAssessmentCompleted(updatedState.getBaselineAssessmentCompleted());

        student.setSkills(updatedState.getSkills());
        student.setProjects(updatedState.getProjects());
        student.setCertifications(updatedState.getCertifications());
        student.setInternships(updatedState.getInternships());
        student.setBadges(updatedState.getBadges());
        student.setTopicsCompleted(updatedState.getTopicsCompleted());
        student.setQuizScores(updatedState.getQuizScores());
        student.setPlacementBreakdown(updatedState.getPlacementBreakdown());
        student.setAptitudeScores(updatedState.getAptitudeScores());
        student.setResumeKeywords(updatedState.getResumeKeywords());
        student.setRoadmapProgress(updatedState.getRoadmapProgress());
        student.setStudyStreak(updatedState.getStudyStreak());

        Student saved = studentRepository.save(student);
        return ResponseEntity.ok(saved);
    }
}
