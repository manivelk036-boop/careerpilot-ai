package com.careerpilot.backend.repository;

import com.careerpilot.backend.model.CareerVideo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CareerVideoRepository extends JpaRepository<CareerVideo, Long> {
    List<CareerVideo> findByLesson_IdOrderByOrderNoAsc(Long lessonId);
}
