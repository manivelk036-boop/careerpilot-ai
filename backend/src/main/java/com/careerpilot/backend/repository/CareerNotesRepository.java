package com.careerpilot.backend.repository;

import com.careerpilot.backend.model.CareerNotes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CareerNotesRepository extends JpaRepository<CareerNotes, Long> {
    List<CareerNotes> findByLesson_Id(Long lessonId);
}
