package com.careerpilot.backend.repository;

import com.careerpilot.backend.model.QuizQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizRepository extends JpaRepository<QuizQuestion, Long> {
    List<QuizQuestion> findByModule_Id(Long moduleId);
    long countByModule_Id(Long moduleId);
}
