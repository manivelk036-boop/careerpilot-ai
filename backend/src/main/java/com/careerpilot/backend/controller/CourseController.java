package com.careerpilot.backend.controller;

import com.careerpilot.backend.model.Course;
import com.careerpilot.backend.model.CourseModule;
import com.careerpilot.backend.repository.ModuleRepository;
import com.careerpilot.backend.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class CourseController {

    @Autowired private CourseService courseService;
    @Autowired private ModuleRepository moduleRepository;

    /** GET /courses — all courses with progress % for authenticated student */
    @GetMapping("/courses")
    public ResponseEntity<?> getAllCourses(Authentication auth) {
        Long studentId = null; // Progress requires authenticated student
        List<Map<String, Object>> courses = courseService.getAllCoursesWithProgress(studentId);
        return ResponseEntity.ok(courses);
    }

    /** GET /courses/{id} — single course detail with modules */
    @GetMapping("/courses/{id}")
    public ResponseEntity<?> getCourseDetail(@PathVariable Long id) {
        return courseService.getCourseById(id)
                .map(course -> {
                    Map<String, Object> detail = new HashMap<>();
                    detail.put("id", course.getId());
                    detail.put("title", course.getTitle());
                    detail.put("description", course.getDescription());
                    detail.put("thumbnailUrl", course.getThumbnailUrl());
                    detail.put("difficulty", course.getDifficulty());
                    detail.put("category", course.getCategory());
                    detail.put("instructor", course.getInstructor());
                    detail.put("durationHours", course.getDurationHours());

                    List<CourseModule> modules =
                            moduleRepository.findByCourse_IdOrderByModuleOrderAsc(id);
                    detail.put("modules", modules.stream().map(m -> {
                        Map<String, Object> mod = new HashMap<>();
                        mod.put("id", m.getId());
                        mod.put("title", m.getTitle());
                        mod.put("description", m.getDescription());
                        mod.put("moduleOrder", m.getModuleOrder());
                        mod.put("courseId", m.getCourseId());
                        return mod;
                    }).toList());
                    detail.put("totalModules", modules.size());

                    return ResponseEntity.ok(detail);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
