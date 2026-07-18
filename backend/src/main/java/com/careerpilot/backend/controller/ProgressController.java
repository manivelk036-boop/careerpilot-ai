package com.careerpilot.backend.controller;

import com.careerpilot.backend.service.ProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/progress")
@CrossOrigin
public class ProgressController {

    @Autowired private ProgressService progressService;

    /** POST /progress — mark a module video as completed */
    @PostMapping
    public ResponseEntity<?> markProgress(@RequestBody Map<String, Object> body) {
        Long studentId = Long.valueOf(body.get("studentId").toString());
        Long courseId  = Long.valueOf(body.get("courseId").toString());
        Long moduleId  = Long.valueOf(body.get("moduleId").toString());

        var progress = progressService.markVideoComplete(studentId, courseId, moduleId);
        return ResponseEntity.ok(progress);
    }

    /** GET /progress/{studentId}/course/{courseId} */
    @GetMapping("/{studentId}/course/{courseId}")
    public ResponseEntity<?> getCourseProgress(@PathVariable Long studentId,
                                               @PathVariable Long courseId) {
        return ResponseEntity.ok(progressService.getProgressForCourse(studentId, courseId));
    }
}
