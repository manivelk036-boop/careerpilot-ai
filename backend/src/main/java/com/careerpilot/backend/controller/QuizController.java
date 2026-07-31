package com.careerpilot.backend.controller;

import com.careerpilot.backend.repository.QuizRepository;
import com.careerpilot.backend.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class QuizController {

    @Autowired private QuizRepository quizRepository;
    @Autowired private QuizService quizService;

    /** GET /api/quiz/module/{moduleId} — Legacy module-based quiz */
    @GetMapping("/quiz/module/{moduleId}")
    public ResponseEntity<?> getQuizByModule(@PathVariable Long moduleId) {
        var questions = quizRepository.findByModule_Id(moduleId);
        List<Map<String, Object>> result = questions.stream().map(q -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", q.getId());
            map.put("question", q.getQuestion());
            map.put("option1", q.getOption1());
            map.put("option2", q.getOption2());
            map.put("option3", q.getOption3());
            map.put("option4", q.getOption4());
            map.put("topic", q.getTopic());
            map.put("subtopic", q.getSubtopic());
            map.put("difficulty", q.getDifficulty());
            map.put("moduleId", q.getModuleId());
            return map;
        }).toList();
        return ResponseEntity.ok(result);
    }

    /** GET /api/quiz/generate?topic=...&subtopic=...&difficulty=...&company=...&count=10 */
    @GetMapping("/quiz/generate")
    public ResponseEntity<?> generateQuiz(
            @RequestParam(required = false) String topic,
            @RequestParam(required = false) String subtopic,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String company,
            @RequestParam(defaultValue = "10") Integer count) {
        List<Map<String, Object>> quiz = quizService.generateDynamicQuiz(topic, subtopic, difficulty, company, count);
        return ResponseEntity.ok(quiz);
    }

    /** GET /api/quiz/company/{companyName}?count=15 */
    @GetMapping("/quiz/company/{companyName}")
    public ResponseEntity<?> getCompanyMockTest(
            @PathVariable String companyName,
            @RequestParam(defaultValue = "15") Integer count) {
        List<Map<String, Object>> quiz = quizService.generateDynamicQuiz(null, null, null, companyName, count);
        return ResponseEntity.ok(quiz);
    }

    /** GET /api/quiz/topics — List unique topics and subtopics */
    @GetMapping("/quiz/topics")
    public ResponseEntity<?> getTopics() {
        return ResponseEntity.ok(quizService.getTopicsMetadata());
    }

    /** GET /api/quiz/companies — List available company tags & question counts */
    @GetMapping("/quiz/companies")
    public ResponseEntity<?> getCompanies() {
        return ResponseEntity.ok(quizService.getCompaniesMetadata());
    }

    /** POST /api/quiz/submit — Evaluate module or dynamic quiz submission */
    @PostMapping("/quiz/submit")
    public ResponseEntity<?> submitQuiz(@RequestBody Map<String, Object> body,
                                         Authentication auth) {
        Long moduleId = body.get("moduleId") != null ? Long.valueOf(body.get("moduleId").toString()) : null;
        Long courseId = body.get("courseId") != null ? Long.valueOf(body.get("courseId").toString()) : null;
        String topic = body.get("topic") != null ? body.get("topic").toString() : null;

        // answers: {"questionId": selectedOption (1-4)}
        @SuppressWarnings("unchecked")
        Map<String, Object> rawAnswers = (Map<String, Object>) body.get("answers");
        Map<Long, Integer> answers = new HashMap<>();
        if (rawAnswers != null) {
            rawAnswers.forEach((k, v) -> {
                if (v != null) {
                    answers.put(Long.valueOf(k), Integer.valueOf(v.toString()));
                }
            });
        }

        Long studentId = null;

        Map<String, Object> result = quizService.evaluateQuiz(studentId, answers, moduleId, courseId, topic);
        return ResponseEntity.ok(result);
    }
}
