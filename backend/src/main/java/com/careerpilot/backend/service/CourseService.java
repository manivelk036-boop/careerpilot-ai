package com.careerpilot.backend.service;

import com.careerpilot.backend.model.Course;
import com.careerpilot.backend.model.CourseModule;
import com.careerpilot.backend.repository.CourseRepository;
import com.careerpilot.backend.repository.ModuleRepository;
import com.careerpilot.backend.repository.VideoRepository;
import com.careerpilot.backend.repository.ProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CourseService {

    @Autowired private CourseRepository courseRepository;
    @Autowired private ModuleRepository moduleRepository;
    @Autowired private VideoRepository videoRepository;
    @Autowired private ProgressRepository progressRepository;

    public List<Map<String, Object>> getAllCoursesWithProgress(Long studentId) {
        List<Course> courses = courseRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Course course : courses) {
            Map<String, Object> courseMap = new HashMap<>();
            courseMap.put("id", course.getId());
            courseMap.put("title", course.getTitle());
            courseMap.put("description", course.getDescription());
            courseMap.put("thumbnailUrl", course.getThumbnailUrl());
            courseMap.put("difficulty", course.getDifficulty());
            courseMap.put("category", course.getCategory());
            courseMap.put("instructor", course.getInstructor());
            courseMap.put("durationHours", course.getDurationHours());

            long totalModules = moduleRepository.countByCourse_Id(course.getId());
            courseMap.put("totalModules", totalModules);

            // Count total videos across all modules
            List<CourseModule> modules = moduleRepository.findByCourse_IdOrderByModuleOrderAsc(course.getId());
            long totalVideos = modules.stream()
                    .mapToLong(m -> videoRepository.countByModule_Id(m.getId()))
                    .sum();
            courseMap.put("totalVideos", totalVideos);

            // Progress %
            int progressPercent = 0;
            if (studentId != null && totalModules > 0) {
                long completedModules = progressRepository
                        .countByStudentIdAndCourseIdAndVideoCompletedTrue(studentId, course.getId());
                progressPercent = (int) (completedModules * 100 / totalModules);
            }
            courseMap.put("progressPercent", progressPercent);

            result.add(courseMap);
        }
        return result;
    }

    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }

    public Course saveCourse(Course course) {
        return courseRepository.save(course);
    }

    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }
}
