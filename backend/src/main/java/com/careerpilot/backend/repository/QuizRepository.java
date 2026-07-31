package com.careerpilot.backend.repository;

import com.careerpilot.backend.model.QuizQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizRepository extends JpaRepository<QuizQuestion, Long> {
    List<QuizQuestion> findByModule_Id(Long moduleId);
    long countByModule_Id(Long moduleId);

    boolean existsByQuestion(String question);
    Optional<QuizQuestion> findByQuestion(String question);

    List<QuizQuestion> findByTopicIgnoreCase(String topic);
    List<QuizQuestion> findByCompanyIgnoreCase(String company);

    @Query("SELECT q FROM QuizQuestion q WHERE " +
           "(:topic IS NULL OR LOWER(q.topic) = LOWER(:topic)) AND " +
           "(:subtopic IS NULL OR LOWER(q.subtopic) = LOWER(:subtopic)) AND " +
           "(:difficulty IS NULL OR LOWER(q.difficulty) = LOWER(:difficulty)) AND " +
           "(:company IS NULL OR LOWER(q.company) = LOWER(:company))")
    List<QuizQuestion> filterQuestions(
            @Param("topic") String topic,
            @Param("subtopic") String subtopic,
            @Param("difficulty") String difficulty,
            @Param("company") String company
    );

    @Query("SELECT DISTINCT q.topic FROM QuizQuestion q WHERE q.topic IS NOT NULL")
    List<String> findDistinctTopics();

    @Query("SELECT DISTINCT q.subtopic FROM QuizQuestion q WHERE q.subtopic IS NOT NULL AND (:topic IS NULL OR LOWER(q.topic) = LOWER(:topic))")
    List<String> findDistinctSubtopicsByTopic(@Param("topic") String topic);

    @Query("SELECT DISTINCT q.company FROM QuizQuestion q WHERE q.company IS NOT NULL AND q.company != 'General'")
    List<String> findDistinctCompanies();
}
