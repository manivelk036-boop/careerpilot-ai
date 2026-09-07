package com.careerpilot.backend.repository;

import com.careerpilot.backend.model.CareerLesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CareerLessonRepository extends JpaRepository<CareerLesson, Long> {
    List<CareerLesson> findByModule_IdOrderByLessonOrderAsc(Long moduleId);
}
