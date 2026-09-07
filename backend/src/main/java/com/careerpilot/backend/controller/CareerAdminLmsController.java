package com.careerpilot.backend.controller;

import com.careerpilot.backend.model.*;
import com.careerpilot.backend.service.CareerLmsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/lms")
@CrossOrigin
public class CareerAdminLmsController {

    @Autowired private CareerLmsService careerLmsService;

    // ── Module CRUD ──────────────────────────────────────────

    @PostMapping("/career-goals/{goalId}/modules")
    public ResponseEntity<?> createModule(@PathVariable Long goalId, @RequestBody Map<String, Object> body) {
        String name = body.get("name").toString();
        String description = body.containsKey("description") ? body.get("description").toString() : "";
        Integer moduleOrder = body.containsKey("moduleOrder") ? Integer.parseInt(body.get("moduleOrder").toString()) : 1;
        CareerModule created = careerLmsService.createModule(goalId, name, description, moduleOrder);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/career-goals/{goalId}/modules/{moduleId}")
    public ResponseEntity<?> updateModule(@PathVariable Long goalId, @PathVariable Long moduleId, @RequestBody Map<String, Object> body) {
        String name = body.containsKey("name") ? body.get("name").toString() : null;
        String description = body.containsKey("description") ? body.get("description").toString() : null;
        Integer moduleOrder = body.containsKey("moduleOrder") ? Integer.parseInt(body.get("moduleOrder").toString()) : null;
        CareerModule updated = careerLmsService.updateModule(goalId, moduleId, name, description, moduleOrder);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/career-goals/{goalId}/modules/{moduleId}")
    public ResponseEntity<?> deleteModule(@PathVariable Long goalId, @PathVariable Long moduleId) {
        careerLmsService.deleteModule(goalId, moduleId);
        return ResponseEntity.ok(Map.of("message", "Module deleted successfully."));
    }

    // ── Lesson CRUD ──────────────────────────────────────────

    @PostMapping("/career-goals/{goalId}/modules/{moduleId}/lessons")
    public ResponseEntity<?> createLesson(@PathVariable Long goalId, @PathVariable Long moduleId, @RequestBody Map<String, Object> body) {
        String name = body.get("name").toString();
        String description = body.containsKey("description") ? body.get("description").toString() : "";
        Integer lessonOrder = body.containsKey("lessonOrder") ? Integer.parseInt(body.get("lessonOrder").toString()) : 1;
        CareerLesson created = careerLmsService.createLesson(goalId, moduleId, name, description, lessonOrder);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/career-goals/{goalId}/modules/{moduleId}/lessons/{lessonId}")
    public ResponseEntity<?> updateLesson(@PathVariable Long goalId, @PathVariable Long moduleId, @PathVariable Long lessonId, @RequestBody Map<String, Object> body) {
        String name = body.containsKey("name") ? body.get("name").toString() : null;
        String description = body.containsKey("description") ? body.get("description").toString() : null;
        Integer lessonOrder = body.containsKey("lessonOrder") ? Integer.parseInt(body.get("lessonOrder").toString()) : null;
        CareerLesson updated = careerLmsService.updateLesson(goalId, moduleId, lessonId, name, description, lessonOrder);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/career-goals/{goalId}/modules/{moduleId}/lessons/{lessonId}")
    public ResponseEntity<?> deleteLesson(@PathVariable Long goalId, @PathVariable Long moduleId, @PathVariable Long lessonId) {
        careerLmsService.deleteLesson(goalId, moduleId, lessonId);
        return ResponseEntity.ok(Map.of("message", "Lesson deleted successfully."));
    }

    // ── Notes CRUD ───────────────────────────────────────────

    @PostMapping("/career-goals/{goalId}/modules/{moduleId}/lessons/{lessonId}/notes")
    public ResponseEntity<?> createNotes(@PathVariable Long goalId, @PathVariable Long moduleId, @PathVariable Long lessonId, @RequestBody Map<String, Object> body) {
        String title = body.get("title").toString();
        String content = body.get("content").toString();
        CareerNotes created = careerLmsService.createNotes(goalId, moduleId, lessonId, title, content);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/career-goals/{goalId}/modules/{moduleId}/lessons/{lessonId}/notes/{noteId}")
    public ResponseEntity<?> updateNotes(@PathVariable Long goalId, @PathVariable Long moduleId, @PathVariable Long lessonId, @PathVariable Long noteId, @RequestBody Map<String, Object> body) {
        String title = body.containsKey("title") ? body.get("title").toString() : null;
        String content = body.containsKey("content") ? body.get("content").toString() : null;
        CareerNotes updated = careerLmsService.updateNotes(goalId, moduleId, lessonId, noteId, title, content);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/career-goals/{goalId}/modules/{moduleId}/lessons/{lessonId}/notes/{noteId}")
    public ResponseEntity<?> deleteNotes(@PathVariable Long goalId, @PathVariable Long moduleId, @PathVariable Long lessonId, @PathVariable Long noteId) {
        careerLmsService.deleteNotes(goalId, moduleId, lessonId, noteId);
        return ResponseEntity.ok(Map.of("message", "Note deleted successfully."));
    }

    // ── Video CRUD ───────────────────────────────────────────

    @PostMapping("/career-goals/{goalId}/modules/{moduleId}/lessons/{lessonId}/videos")
    public ResponseEntity<?> createVideo(@PathVariable Long goalId, @PathVariable Long moduleId, @PathVariable Long lessonId, @RequestBody Map<String, Object> body) {
        String title = body.get("title").toString();
        String youtubeUrl = body.get("youtubeUrl").toString();
        Integer durationMinutes = body.containsKey("durationMinutes") ? Integer.parseInt(body.get("durationMinutes").toString()) : 0;
        Integer orderNo = body.containsKey("orderNo") ? Integer.parseInt(body.get("orderNo").toString()) : 1;
        CareerVideo created = careerLmsService.createVideo(goalId, moduleId, lessonId, title, youtubeUrl, durationMinutes, orderNo);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/career-goals/{goalId}/modules/{moduleId}/lessons/{lessonId}/videos/{videoId}")
    public ResponseEntity<?> updateVideo(@PathVariable Long goalId, @PathVariable Long moduleId, @PathVariable Long lessonId, @PathVariable Long videoId, @RequestBody Map<String, Object> body) {
        String title = body.containsKey("title") ? body.get("title").toString() : null;
        String youtubeUrl = body.containsKey("youtubeUrl") ? body.get("youtubeUrl").toString() : null;
        Integer durationMinutes = body.containsKey("durationMinutes") ? Integer.parseInt(body.get("durationMinutes").toString()) : null;
        Integer orderNo = body.containsKey("orderNo") ? Integer.parseInt(body.get("orderNo").toString()) : null;
        CareerVideo updated = careerLmsService.updateVideo(goalId, moduleId, lessonId, videoId, title, youtubeUrl, durationMinutes, orderNo);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/career-goals/{goalId}/modules/{moduleId}/lessons/{lessonId}/videos/{videoId}")
    public ResponseEntity<?> deleteVideo(@PathVariable Long goalId, @PathVariable Long moduleId, @PathVariable Long lessonId, @PathVariable Long videoId) {
        careerLmsService.deleteVideo(goalId, moduleId, lessonId, videoId);
        return ResponseEntity.ok(Map.of("message", "Video deleted successfully."));
    }

    // ── Quiz CRUD ────────────────────────────────────────────

    @PostMapping("/career-goals/{goalId}/modules/{moduleId}/lessons/{lessonId}/quizzes")
    public ResponseEntity<?> createQuiz(@PathVariable Long goalId, @PathVariable Long moduleId, @PathVariable Long lessonId, @RequestBody Map<String, Object> body) {
        String question = body.get("question").toString();
        String optionA = body.get("optionA").toString();
        String optionB = body.get("optionB").toString();
        String optionC = body.get("optionC").toString();
        String optionD = body.get("optionD").toString();
        String correctAnswer = body.get("correctAnswer").toString();
        String explanation = body.containsKey("explanation") ? body.get("explanation").toString() : "";
        CareerQuiz created = careerLmsService.createQuiz(goalId, moduleId, lessonId, question, optionA, optionB, optionC, optionD, correctAnswer, explanation);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/career-goals/{goalId}/modules/{moduleId}/lessons/{lessonId}/quizzes/{quizId}")
    public ResponseEntity<?> updateQuiz(@PathVariable Long goalId, @PathVariable Long moduleId, @PathVariable Long lessonId, @PathVariable Long quizId, @RequestBody Map<String, Object> body) {
        String question = body.containsKey("question") ? body.get("question").toString() : null;
        String optionA = body.containsKey("optionA") ? body.get("optionA").toString() : null;
        String optionB = body.containsKey("optionB") ? body.get("optionB").toString() : null;
        String optionC = body.containsKey("optionC") ? body.get("optionC").toString() : null;
        String optionD = body.containsKey("optionD") ? body.get("optionD").toString() : null;
        String correctAnswer = body.containsKey("correctAnswer") ? body.get("correctAnswer").toString() : null;
        String explanation = body.containsKey("explanation") ? body.get("explanation").toString() : null;
        CareerQuiz updated = careerLmsService.updateQuiz(goalId, moduleId, lessonId, quizId, question, optionA, optionB, optionC, optionD, correctAnswer, explanation);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/career-goals/{goalId}/modules/{moduleId}/lessons/{lessonId}/quizzes/{quizId}")
    public ResponseEntity<?> deleteQuiz(@PathVariable Long goalId, @PathVariable Long moduleId, @PathVariable Long lessonId, @PathVariable Long quizId) {
        careerLmsService.deleteQuiz(goalId, moduleId, lessonId, quizId);
        return ResponseEntity.ok(Map.of("message", "Quiz question deleted successfully."));
    }
}
