package com.careerpilot.backend.repository;

import com.careerpilot.backend.model.CareerGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CareerGoalRepository extends JpaRepository<CareerGoal, Long> {
}
