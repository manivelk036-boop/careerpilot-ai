package com.careerpilot.backend.service;

import com.careerpilot.backend.model.StudentProgress;
import com.careerpilot.backend.repository.ProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProgressService {

    @Autowired
    private ProgressRepository progressRepository;

    public StudentProgress markVideoComplete(Long studentId, Long courseId, Long moduleId) {
        StudentProgress progress = progressRepository
                .findByStudentIdAndModuleId(studentId, moduleId)
                .orElse(new StudentProgress());

        progress.setStudentId(studentId);
        progress.setCourseId(courseId);
        progress.setModuleId(moduleId);
        progress.setVideoCompleted(true);
        if (progress.getQuizScore() == null) progress.setQuizScore(null);

        return progressRepository.save(progress);
    }

    public List<StudentProgress> getProgressForCourse(Long studentId, Long courseId) {
        return progressRepository.findByStudentIdAndCourseId(studentId, courseId);
    }

    public List<StudentProgress> getAllProgress(Long studentId) {
        return progressRepository.findByStudentId(studentId);
    }

    public Optional<StudentProgress> getModuleProgress(Long studentId, Long moduleId) {
        return progressRepository.findByStudentIdAndModuleId(studentId, moduleId);
    }
}
