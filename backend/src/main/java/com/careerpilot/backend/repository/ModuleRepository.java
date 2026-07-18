package com.careerpilot.backend.repository;

import com.careerpilot.backend.model.CourseModule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModuleRepository extends JpaRepository<CourseModule, Long> {
    List<CourseModule> findByCourse_IdOrderByModuleOrderAsc(Long courseId);
    long countByCourse_Id(Long courseId);
}
