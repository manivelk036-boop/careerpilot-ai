package com.careerpilot.backend.controller;

import com.careerpilot.backend.model.*;
import com.careerpilot.backend.service.CareerLmsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class CareerController {

    @Autowired
    private CareerLmsService careerLmsService;

    // ── Career Goals ──────────────────────────────────────────
    @GetMapping("/career-goals")
    public ResponseEntity<List<CareerGoal>> getAllCareerGoals() {
        return ResponseEntity.ok(careerLmsService.getAllCareerGoals());
    }

    // ── Modules for Career ─────────────────────────────────────
    @GetMapping("/career-goals/{goalId}/modules")
    public ResponseEntity<List<CareerModule>> getModulesByGoal(@PathVariable Long goalId) {
        return ResponseEntity.ok(careerLmsService.getModulesForCareer(goalId));
    }

    // ── Lessons for Module with Strict Career Hierarchy ────────
    @GetMapping("/career-goals/{goalId}/modules/{moduleId}/lessons")
    public ResponseEntity<List<CareerLesson>> getLessonsForModule(
            @PathVariable Long goalId,
            @PathVariable Long moduleId) {
        return ResponseEntity.ok(careerLmsService.getLessonsForModule(goalId, moduleId));
    }

    // Legacy shortcut (if accessed directly by module ID)
    @GetMapping("/modules/{id}/lessons")
    public ResponseEntity<List<CareerLesson>> getLessonsByModuleLegacy(@PathVariable Long id) {
        return ResponseEntity.ok(careerLmsService.getLessonsForModuleLegacy(id));
    }

    // ── Lesson Notes with Strict Career Hierarchy ──────────────
    @GetMapping("/career-goals/{goalId}/modules/{moduleId}/lessons/{lessonId}/notes")
    public ResponseEntity<List<CareerNotes>> getNotesForLesson(
            @PathVariable Long goalId,
            @PathVariable Long moduleId,
            @PathVariable Long lessonId) {
        return ResponseEntity.ok(careerLmsService.getNotesForLesson(goalId, moduleId, lessonId));
    }

    // ── Lesson Videos with Strict Career Hierarchy ─────────────
    @GetMapping("/career-goals/{goalId}/modules/{moduleId}/lessons/{lessonId}/videos")
    public ResponseEntity<List<CareerVideo>> getVideosForLesson(
            @PathVariable Long goalId,
            @PathVariable Long moduleId,
            @PathVariable Long lessonId) {
        return ResponseEntity.ok(careerLmsService.getVideosForLesson(goalId, moduleId, lessonId));
    }

    // ── Lesson Quizzes with Strict Career Hierarchy ────────────
    @GetMapping("/career-goals/{goalId}/modules/{moduleId}/lessons/{lessonId}/quizzes")
    public ResponseEntity<List<CareerQuiz>> getQuizzesForLesson(
            @PathVariable Long goalId,
            @PathVariable Long moduleId,
            @PathVariable Long lessonId) {
        return ResponseEntity.ok(careerLmsService.getQuizzesForLesson(goalId, moduleId, lessonId));
    }

    // Legacy shortcut (if accessed directly by lesson ID)
    @GetMapping("/lessons/{id}/quizzes")
    public ResponseEntity<List<CareerQuiz>> getQuizzesByLessonLegacy(@PathVariable Long id) {
        return ResponseEntity.ok(careerLmsService.getQuizzesForLessonLegacy(id));
    }
}
