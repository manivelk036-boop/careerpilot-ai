package com.careerpilot.backend.repository;

import com.careerpilot.backend.model.CareerModule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CareerModuleRepository extends JpaRepository<CareerModule, Long> {
    List<CareerModule> findByCareerGoal_IdOrderByModuleOrderAsc(Long careerGoalId);
}
