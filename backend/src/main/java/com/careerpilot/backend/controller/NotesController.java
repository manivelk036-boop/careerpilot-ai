package com.careerpilot.backend.controller;

import com.careerpilot.backend.repository.NotesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class NotesController {

    @Autowired private NotesRepository notesRepository;

    @GetMapping("/notes/module/{moduleId}")
    public ResponseEntity<?> getNotesByModule(@PathVariable Long moduleId) {
        var notes = notesRepository.findByModule_Id(moduleId);
        List<Map<String, Object>> result = notes.stream().map(n -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", n.getId());
            map.put("title", n.getTitle());
            map.put("pdfUrl", n.getPdfUrl());
            map.put("moduleId", n.getModuleId());
            return map;
        }).toList();
        return ResponseEntity.ok(result);
    }
}
