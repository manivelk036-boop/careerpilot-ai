package com.careerpilot.backend.controller;

import com.careerpilot.backend.repository.VideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class VideoController {

    @Autowired private VideoRepository videoRepository;

    @GetMapping("/videos/module/{moduleId}")
    public ResponseEntity<?> getVideosByModule(@PathVariable Long moduleId) {
        var videos = videoRepository.findByModuleIdOrderByOrderNoAsc(moduleId);
        List<Map<String, Object>> result = videos.stream().map(v -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", v.getId());
            map.put("title", v.getTitle());
            map.put("youtubeUrl", v.getYoutubeUrl());
            map.put("durationMinutes", v.getDurationMinutes());
            map.put("orderNo", v.getOrderNo());
            map.put("moduleId", v.getModuleId());
            return map;
        }).toList();
        return ResponseEntity.ok(result);
    }
}
