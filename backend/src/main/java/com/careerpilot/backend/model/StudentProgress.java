package com.careerpilot.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_progress",
       uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "module_id"}))
public class StudentProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "course_id", nullable = false)
    private Long courseId;

    @Column(name = "module_id", nullable = false)
    private Long moduleId;

    @Column(nullable = false)
    private Boolean videoCompleted = false;

    private Integer quizScore;     // null = not attempted, 0-100 = score

    private LocalDateTime completedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        if (videoCompleted != null && videoCompleted) {
            completedAt = LocalDateTime.now();
        }
    }

    // ── Getters & Setters ──────────────────────────────
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public Long getModuleId() { return moduleId; }
    public void setModuleId(Long moduleId) { this.moduleId = moduleId; }

    public Boolean getVideoCompleted() { return videoCompleted; }
    public void setVideoCompleted(Boolean videoCompleted) { this.videoCompleted = videoCompleted; }

    public Integer getQuizScore() { return quizScore; }
    public void setQuizScore(Integer quizScore) { this.quizScore = quizScore; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
