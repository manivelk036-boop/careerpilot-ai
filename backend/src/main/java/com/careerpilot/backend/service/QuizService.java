package com.careerpilot.backend.service;

import com.careerpilot.backend.model.QuizQuestion;
import com.careerpilot.backend.model.StudentProgress;
import com.careerpilot.backend.repository.ModuleRepository;
import com.careerpilot.backend.repository.QuizRepository;
import com.careerpilot.backend.repository.ProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class QuizService {

    @Autowired private QuizRepository quizRepository;
    @Autowired private ProgressRepository progressRepository;
    @Autowired private ModuleRepository moduleRepository;

    public List<QuizQuestion> getQuestionsByModule(Long moduleId) {
        return quizRepository.findByModuleId(moduleId);
    }

    /**
     * answers: map of questionId -> selectedAnswer (1-4)
     * Returns: score, total, percentage, recommendation, xpEarned
     */
    public Map<String, Object> submitQuiz(Long studentId, Long moduleId, Long courseId,
                                          Map<Long, Integer> answers) {
        List<QuizQuestion> questions = quizRepository.findByModuleId(moduleId);

        int correct = 0;
        List<Map<String, Object>> feedback = new ArrayList<>();

        for (QuizQuestion q : questions) {
            Integer given = answers.get(q.getId());
            boolean isCorrect = given != null && given.equals(q.getCorrectAnswer());
            if (isCorrect) correct++;

            Map<String, Object> qFeedback = new HashMap<>();
            qFeedback.put("questionId", q.getId());
            qFeedback.put("question", q.getQuestion());
            qFeedback.put("correctAnswer", q.getCorrectAnswer());
            qFeedback.put("givenAnswer", given);
            qFeedback.put("isCorrect", isCorrect);
            qFeedback.put("explanation", q.getExplanation());
            feedback.add(qFeedback);
        }

        int total = questions.size();
        int percent = total > 0 ? (correct * 100 / total) : 0;

        // Save quiz score to progress
        if (studentId != null) {
            StudentProgress progress = progressRepository
                    .findByStudentIdAndModuleId(studentId, moduleId)
                    .orElse(new StudentProgress());
            progress.setStudentId(studentId);
            progress.setCourseId(courseId);
            progress.setModuleId(moduleId);
            progress.setQuizScore(percent);
            if (progress.getVideoCompleted() == null) progress.setVideoCompleted(false);
            progressRepository.save(progress);
        }

        // XP based on score
        int xpEarned = percent >= 80 ? 100 : percent >= 60 ? 60 : percent >= 40 ? 30 : 10;

        // AI recommendation
        String recommendation = generateRecommendation(moduleId, percent, questions, feedback);

        Map<String, Object> result = new HashMap<>();
        result.put("score", correct);
        result.put("total", total);
        result.put("percentage", percent);
        result.put("xpEarned", xpEarned);
        result.put("feedback", feedback);
        result.put("recommendation", recommendation);
        result.put("passed", percent >= 60);

        return result;
    }

    private String generateRecommendation(Long moduleId, int percent,
                                          List<QuizQuestion> questions,
                                          List<Map<String, Object>> feedback) {
        if (percent >= 90) {
            return "🏆 Excellent! You have mastered this topic. You are ready to move to the next module.";
        } else if (percent >= 70) {
            return "✅ Good work! You understand the core concepts. Review the questions you missed once more before moving on.";
        } else if (percent >= 50) {
            long wrongCount = feedback.stream().filter(f -> !(boolean) f.get("isCorrect")).count();
            return String.format("⚠️ You got %d questions wrong. Watch the video again and re-read the notes " +
                    "before retaking this quiz. Focus on the areas where you made mistakes.", wrongCount);
        } else {
            return "📚 You need more practice on this topic. Watch the full video, read all notes carefully, " +
                    "and try the quiz again. Don't rush — understanding the basics here will help you with all future modules.";
        }
    }
}
