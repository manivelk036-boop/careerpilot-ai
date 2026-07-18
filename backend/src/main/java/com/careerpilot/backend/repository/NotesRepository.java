package com.careerpilot.backend.repository;

import com.careerpilot.backend.model.Notes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotesRepository extends JpaRepository<Notes, Long> {
    List<Notes> findByModuleId(Long moduleId);
}
