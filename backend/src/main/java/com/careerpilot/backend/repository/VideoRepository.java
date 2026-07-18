package com.careerpilot.backend.repository;

import com.careerpilot.backend.model.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VideoRepository extends JpaRepository<Video, Long> {
    List<Video> findByModuleIdOrderByOrderNoAsc(Long moduleId);
    long countByModuleId(Long moduleId);
}
