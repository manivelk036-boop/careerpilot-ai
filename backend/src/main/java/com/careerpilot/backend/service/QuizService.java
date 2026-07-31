package com.careerpilot.backend.service;

import com.careerpilot.backend.model.QuizQuestion;
import com.careerpilot.backend.model.StudentProgress;
import com.careerpilot.backend.repository.ModuleRepository;
import com.careerpilot.backend.repository.QuizRepository;
import com.careerpilot.backend.repository.ProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class QuizService {

    @Autowired private QuizRepository quizRepository;
    @Autowired private ProgressRepository progressRepository;
    @Autowired private ModuleRepository moduleRepository;

    public List<QuizQuestion> getQuestionsByModule(Long moduleId) {
        return quizRepository.findByModule_Id(moduleId);
    }

    /**
     * Generate dynamic quiz with N random MCQs based on filters
     */
    public List<Map<String, Object>> generateDynamicQuiz(String topic, String subtopic, String difficulty, String company, Integer count) {
        int limit = (count != null && count > 0) ? count : 10;

        List<QuizQuestion> questions;
        if (company != null && !company.trim().isEmpty() && !company.equalsIgnoreCase("all")) {
            questions = quizRepository.findByCompanyIgnoreCase(company);
        } else if (topic != null && !topic.trim().isEmpty() && !topic.equalsIgnoreCase("all")) {
            questions = quizRepository.filterQuestions(
                    topic,
                    (subtopic != null && !subtopic.equalsIgnoreCase("all")) ? subtopic : null,
                    (difficulty != null && !difficulty.equalsIgnoreCase("all")) ? difficulty : null,
                    null
            );
        } else {
            questions = quizRepository.findAll();
        }

        // Shuffle questions so no two quizzes are identical
        List<QuizQuestion> shuffled = new ArrayList<>(questions);
        Collections.shuffle(shuffled);

        if (shuffled.size() > limit) {
            shuffled = shuffled.subList(0, limit);
        }

        return shuffled.stream().map(q -> {
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
            map.put("company", q.getCompany());
            // Do NOT include correctAnswer or explanation in quiz question payload before submit
            return map;
        }).collect(Collectors.toList());
    }

    /**
     * Evaluate arbitrary submitted quiz by Question IDs
     */
    public Map<String, Object> evaluateQuiz(Long studentId, Map<Long, Integer> answers, Long moduleId, Long courseId, String topic) {
        List<QuizQuestion> targetQuestions = new ArrayList<>();

        if (moduleId != null) {
            targetQuestions = quizRepository.findByModule_Id(moduleId);
        } else if (answers != null && !answers.isEmpty()) {
            targetQuestions = quizRepository.findAllById(answers.keySet());
        }

        int correct = 0;
        List<Map<String, Object>> feedback = new ArrayList<>();
        Map<String, int[]> topicStats = new HashMap<>(); // topic -> [correct, total]

        for (QuizQuestion q : targetQuestions) {
            Integer given = answers != null ? answers.get(q.getId()) : null;
            boolean isCorrect = given != null && given.equals(q.getCorrectAnswer());
            if (isCorrect) correct++;

            String qTopic = q.getSubtopic() != null ? q.getSubtopic() : (q.getTopic() != null ? q.getTopic() : "General");
            topicStats.putIfAbsent(qTopic, new int[]{0, 0});
            topicStats.get(qTopic)[1]++;
            if (isCorrect) topicStats.get(qTopic)[0]++;

            Map<String, Object> qFeedback = new HashMap<>();
            qFeedback.put("questionId", q.getId());
            qFeedback.put("question", q.getQuestion());
            qFeedback.put("option1", q.getOption1());
            qFeedback.put("option2", q.getOption2());
            qFeedback.put("option3", q.getOption3());
            qFeedback.put("option4", q.getOption4());
            qFeedback.put("correctAnswer", q.getCorrectAnswer());
            qFeedback.put("givenAnswer", given);
            qFeedback.put("isCorrect", isCorrect);
            qFeedback.put("explanation", q.getExplanation());
            qFeedback.put("topic", q.getTopic());
            qFeedback.put("subtopic", q.getSubtopic());
            qFeedback.put("difficulty", q.getDifficulty());
            feedback.add(qFeedback);
        }

        int total = targetQuestions.size();
        int percent = total > 0 ? (correct * 100 / total) : 0;

        boolean passed = percent >= 70;
        int xpEarned = passed ? 100 : Math.max(10, (percent * 100) / 100);
        int coinsEarned = passed ? 50 : 15;

        // Save progress if module provided
        if (studentId != null && moduleId != null) {
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

        String recommendation = generateSmartRecommendation(percent, passed, topicStats, feedback);

        Map<String, Object> result = new HashMap<>();
        result.put("score", correct);
        result.put("total", total);
        result.put("percentage", percent);
        result.put("passed", passed);
        result.put("xpEarned", xpEarned);
        result.put("coinsEarned", coinsEarned);
        result.put("feedback", feedback);
        result.put("recommendation", recommendation);
        result.put("progressionUnlocked", passed);

        return result;
    }

    private String generateSmartRecommendation(int percent, boolean passed, Map<String, int[]> topicStats, List<Map<String, Object>> feedback) {
        if (passed && percent >= 90) {
            return "🏆 Exceptional performance! You scored " + percent + "%. You have mastered this concept and unlocked the next topic progression.";
        } else if (passed) {
            return "🎉 Great job! You scored " + percent + "% and passed the assessment threshold (≥70%). Next topic unlocked! Review the explanation notes to perfect your understanding.";
        } else {
            List<String> weakTopics = new ArrayList<>();
            topicStats.forEach((t, stats) -> {
                if (stats[1] > 0 && (stats[0] * 100 / stats[1]) < 70) {
                    weakTopics.add(t);
                }
            });

            String weakAreaStr = weakTopics.isEmpty() ? "key Java concepts" : String.join(", ", weakTopics);
            return "📚 You scored " + percent + "% (Threshold: 70%). Progression requires 70%+ to unlock. " +
                   "AI Recommendation: Revise " + weakAreaStr + ", read the explanations below, and retake the quiz!";
        }
    }

    public Map<String, Object> getTopicsMetadata() {
        List<String> topics = quizRepository.findDistinctTopics();
        Map<String, Object> meta = new HashMap<>();
        meta.put("topics", topics);

        Map<String, List<String>> subtopicMap = new HashMap<>();
        for (String t : topics) {
            subtopicMap.put(t, quizRepository.findDistinctSubtopicsByTopic(t));
        }
        meta.put("subtopics", subtopicMap);
        meta.put("totalQuestions", quizRepository.count());
        return meta;
    }

    public List<Map<String, Object>> getCompaniesMetadata() {
        List<String> companies = Arrays.asList("TCS", "Infosys", "Wipro", "Zoho", "Freshworks", "Amazon");
        List<Map<String, Object>> list = new ArrayList<>();

        for (String c : companies) {
            Map<String, Object> map = new HashMap<>();
            map.put("name", c);
            long count = quizRepository.findByCompanyIgnoreCase(c).size();
            map.put("questionCount", count);
            list.add(map);
        }

        return list;
    }
}
