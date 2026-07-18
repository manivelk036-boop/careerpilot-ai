package com.careerpilot.backend.controller;

import com.careerpilot.backend.model.*;
import com.careerpilot.backend.repository.*;
import com.careerpilot.backend.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@CrossOrigin
public class AdminController {

    @Autowired private CourseService courseService;
    @Autowired private CourseRepository courseRepository;
    @Autowired private ModuleRepository moduleRepository;
    @Autowired private VideoRepository videoRepository;
    @Autowired private NotesRepository notesRepository;
    @Autowired private QuizRepository quizRepository;

    // ── COURSE CRUD ──────────────────────────────────────────

    @PostMapping("/course")
    public ResponseEntity<?> createCourse(@RequestBody Course course) {
        return ResponseEntity.ok(courseRepository.save(course));
    }

    @PutMapping("/course/{id}")
    public ResponseEntity<?> updateCourse(@PathVariable Long id, @RequestBody Course updated) {
        return courseRepository.findById(id).map(c -> {
            c.setTitle(updated.getTitle());
            c.setDescription(updated.getDescription());
            c.setThumbnailUrl(updated.getThumbnailUrl());
            c.setDifficulty(updated.getDifficulty());
            c.setCategory(updated.getCategory());
            c.setInstructor(updated.getInstructor());
            c.setDurationHours(updated.getDurationHours());
            return ResponseEntity.ok(courseRepository.save(c));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/course/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        courseRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Course deleted"));
    }

    @GetMapping("/courses")
    public ResponseEntity<?> listCourses() {
        return ResponseEntity.ok(courseRepository.findAll());
    }

    // ── MODULE CRUD ──────────────────────────────────────────

    @PostMapping("/module")
    public ResponseEntity<?> createModule(@RequestBody Map<String, Object> body) {
        Long courseId = Long.valueOf(body.get("courseId").toString());
        return courseRepository.findById(courseId).map(course -> {
            CourseModule m = new CourseModule();
            m.setCourse(course);
            m.setTitle(body.get("title").toString());
            m.setDescription(body.containsKey("description") ? body.get("description").toString() : "");
            m.setModuleOrder(body.containsKey("moduleOrder") ?
                    Integer.parseInt(body.get("moduleOrder").toString()) : 1);
            return ResponseEntity.ok(moduleRepository.save(m));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/module/{id}")
    public ResponseEntity<?> updateModule(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return moduleRepository.findById(id).map(m -> {
            if (body.containsKey("title")) m.setTitle(body.get("title").toString());
            if (body.containsKey("description")) m.setDescription(body.get("description").toString());
            if (body.containsKey("moduleOrder"))
                m.setModuleOrder(Integer.parseInt(body.get("moduleOrder").toString()));
            return ResponseEntity.ok(moduleRepository.save(m));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/module/{id}")
    public ResponseEntity<?> deleteModule(@PathVariable Long id) {
        moduleRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Module deleted"));
    }

    // ── VIDEO CRUD ───────────────────────────────────────────

    @PostMapping("/video")
    public ResponseEntity<?> createVideo(@RequestBody Map<String, Object> body) {
        Long moduleId = Long.valueOf(body.get("moduleId").toString());
        return moduleRepository.findById(moduleId).map(module -> {
            Video v = new Video();
            v.setModule(module);
            v.setTitle(body.get("title").toString());
            v.setYoutubeUrl(body.get("youtubeUrl").toString());
            v.setDurationMinutes(body.containsKey("durationMinutes") ?
                    Integer.parseInt(body.get("durationMinutes").toString()) : 0);
            v.setOrderNo(body.containsKey("orderNo") ?
                    Integer.parseInt(body.get("orderNo").toString()) : 1);
            return ResponseEntity.ok(videoRepository.save(v));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/video/{id}")
    public ResponseEntity<?> updateVideo(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return videoRepository.findById(id).map(v -> {
            if (body.containsKey("title")) v.setTitle(body.get("title").toString());
            if (body.containsKey("youtubeUrl")) v.setYoutubeUrl(body.get("youtubeUrl").toString());
            if (body.containsKey("durationMinutes"))
                v.setDurationMinutes(Integer.parseInt(body.get("durationMinutes").toString()));
            if (body.containsKey("orderNo"))
                v.setOrderNo(Integer.parseInt(body.get("orderNo").toString()));
            return ResponseEntity.ok(videoRepository.save(v));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/video/{id}")
    public ResponseEntity<?> deleteVideo(@PathVariable Long id) {
        videoRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Video deleted"));
    }

    // ── NOTES CRUD ───────────────────────────────────────────

    @PostMapping("/note")
    public ResponseEntity<?> createNote(@RequestBody Map<String, Object> body) {
        Long moduleId = Long.valueOf(body.get("moduleId").toString());
        return moduleRepository.findById(moduleId).map(module -> {
            Notes n = new Notes();
            n.setModule(module);
            n.setTitle(body.get("title").toString());
            n.setPdfUrl(body.get("pdfUrl").toString());
            return ResponseEntity.ok(notesRepository.save(n));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/note/{id}")
    public ResponseEntity<?> deleteNote(@PathVariable Long id) {
        notesRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Note deleted"));
    }

    // ── QUIZ CRUD ────────────────────────────────────────────

    @PostMapping("/quiz")
    public ResponseEntity<?> createQuizQuestion(@RequestBody Map<String, Object> body) {
        Long moduleId = Long.valueOf(body.get("moduleId").toString());
        return moduleRepository.findById(moduleId).map(module -> {
            QuizQuestion q = new QuizQuestion();
            q.setModule(module);
            q.setQuestion(body.get("question").toString());
            q.setOption1(body.get("option1").toString());
            q.setOption2(body.get("option2").toString());
            q.setOption3(body.get("option3").toString());
            q.setOption4(body.get("option4").toString());
            q.setCorrectAnswer(Integer.parseInt(body.get("correctAnswer").toString()));
            if (body.containsKey("explanation")) q.setExplanation(body.get("explanation").toString());
            return ResponseEntity.ok(quizRepository.save(q));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/quiz/{id}")
    public ResponseEntity<?> deleteQuizQuestion(@PathVariable Long id) {
        quizRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Quiz question deleted"));
    }

    @GetMapping("/modules/{courseId}")
    public ResponseEntity<?> getModulesForCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(moduleRepository.findByCourseIdOrderByModuleOrderAsc(courseId));
    }

    @GetMapping("/videos/{moduleId}")
    public ResponseEntity<?> getVideosForModule(@PathVariable Long moduleId) {
        return ResponseEntity.ok(videoRepository.findByModuleIdOrderByOrderNoAsc(moduleId));
    }

    @GetMapping("/notes/{moduleId}")
    public ResponseEntity<?> getNotesForModule(@PathVariable Long moduleId) {
        return ResponseEntity.ok(notesRepository.findByModuleId(moduleId));
    }

    @GetMapping("/quiz/{moduleId}")
    public ResponseEntity<?> getQuizForModule(@PathVariable Long moduleId) {
        return ResponseEntity.ok(quizRepository.findByModuleId(moduleId));
    }
}
