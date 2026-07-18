package com.careerpilot.backend.controller;

import com.careerpilot.backend.model.CourseModule;
import com.careerpilot.backend.repository.ModuleRepository;
import com.careerpilot.backend.repository.VideoRepository;
import com.careerpilot.backend.repository.NotesRepository;
import com.careerpilot.backend.repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class ModuleController {

    @Autowired private ModuleRepository moduleRepository;
    @Autowired private VideoRepository videoRepository;
    @Autowired private NotesRepository notesRepository;
    @Autowired private QuizRepository quizRepository;

    @GetMapping("/modules/course/{courseId}")
    public ResponseEntity<?> getModulesByCourse(@PathVariable Long courseId) {
        List<CourseModule> modules = moduleRepository.findByCourse_IdOrderByModuleOrderAsc(courseId);

        List<Map<String, Object>> result = modules.stream().map(m -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", m.getId());
            map.put("title", m.getTitle());
            map.put("description", m.getDescription());
            map.put("moduleOrder", m.getModuleOrder());
            map.put("courseId", m.getCourseId());
            map.put("hasVideos", videoRepository.countByModule_Id(m.getId()) > 0);
            map.put("hasNotes", notesRepository.findByModule_Id(m.getId()).size() > 0);
            map.put("hasQuiz", quizRepository.countByModule_Id(m.getId()) > 0);
            map.put("videoCount", videoRepository.countByModule_Id(m.getId()));
            return map;
        }).toList();

        return ResponseEntity.ok(result);
    }
}

