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
@CrossOrigin
public class QuizController {

    @Autowired private QuizRepository quizRepository;
    @Autowired private QuizService quizService;

    @GetMapping("/quiz/module/{moduleId}")
    public ResponseEntity<?> getQuizByModule(@PathVariable Long moduleId) {
        var questions = quizRepository.findByModuleId(moduleId);
        // Don't expose correctAnswer to frontend during quiz
        List<Map<String, Object>> result = questions.stream().map(q -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", q.getId());
            map.put("question", q.getQuestion());
            map.put("option1", q.getOption1());
            map.put("option2", q.getOption2());
            map.put("option3", q.getOption3());
            map.put("option4", q.getOption4());
            map.put("moduleId", q.getModuleId());
            // correctAnswer is NOT sent here — only sent after submission
            return map;
        }).toList();
        return ResponseEntity.ok(result);
    }

    @PostMapping("/quiz/submit")
    public ResponseEntity<?> submitQuiz(@RequestBody Map<String, Object> body,
                                        Authentication auth) {
        Long moduleId = Long.valueOf(body.get("moduleId").toString());
        Long courseId = Long.valueOf(body.get("courseId").toString());

        // answers: {"questionId": selectedOption (1-4)}
        @SuppressWarnings("unchecked")
        Map<String, Integer> rawAnswers = (Map<String, Integer>) body.get("answers");
        Map<Long, Integer> answers = new HashMap<>();
        if (rawAnswers != null) {
            rawAnswers.forEach((k, v) -> answers.put(Long.valueOf(k), v));
        }

        // studentId from JWT (null if not authenticated — allow guest quiz)
        Long studentId = null;
        if (auth != null) {
            // auth.getName() = email; we'd need to resolve to student ID
            // For now pass null — quiz still graded, just not saved
        }

        Map<String, Object> result = quizService.submitQuiz(studentId, moduleId, courseId, answers);
        return ResponseEntity.ok(result);
    }
}
