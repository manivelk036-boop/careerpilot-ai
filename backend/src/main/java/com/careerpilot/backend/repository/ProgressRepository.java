package com.careerpilot.backend.repository;

import com.careerpilot.backend.model.StudentProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProgressRepository extends JpaRepository<StudentProgress, Long> {
    Optional<StudentProgress> findByStudentIdAndModuleId(Long studentId, Long moduleId);
    List<StudentProgress> findByStudentIdAndCourseId(Long studentId, Long courseId);
    List<StudentProgress> findByStudentId(Long studentId);
    long countByStudentIdAndCourseIdAndVideoCompletedTrue(Long studentId, Long courseId);
}
