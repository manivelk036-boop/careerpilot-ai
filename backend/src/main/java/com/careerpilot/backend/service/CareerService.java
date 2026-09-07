package com.careerpilot.backend.service;

import com.careerpilot.backend.model.*;
import com.careerpilot.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CareerService {

    @Autowired private CareerGoalRepository careerGoalRepository;
    @Autowired private CareerModuleRepository careerModuleRepository;
    @Autowired private CareerLessonRepository careerLessonRepository;
    @Autowired private CareerQuizRepository careerQuizRepository;

    public List<CareerGoal> getAllCareerGoals() {
        return careerGoalRepository.findAll();
    }

    public List<CareerModule> getModulesByGoalId(Long careerGoalId) {
        return careerModuleRepository.findByCareerGoal_IdOrderByModuleOrderAsc(careerGoalId);
    }

    public List<CareerLesson> getLessonsByModuleId(Long moduleId) {
        return careerLessonRepository.findByModule_IdOrderByLessonOrderAsc(moduleId);
    }

    public List<CareerQuiz> getQuizzesByLessonId(Long lessonId) {
        return careerQuizRepository.findByLesson_Id(lessonId);
    }
}
