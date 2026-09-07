package com.careerpilot.backend.repository;

import com.careerpilot.backend.model.CareerQuiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CareerQuizRepository extends JpaRepository<CareerQuiz, Long> {
    List<CareerQuiz> findByLesson_Id(Long lessonId);
}
