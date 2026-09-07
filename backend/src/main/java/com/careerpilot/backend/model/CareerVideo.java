package com.careerpilot.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "career_videos")
public class CareerVideo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    @JsonIgnore
    private CareerLesson lesson;

    @Column(nullable = false)
    private String title;

    @Column(name = "youtube_url", nullable = false, length = 500)
    private String youtubeUrl;

    private Integer durationMinutes = 0;

    @Column(name = "order_no", nullable = false)
    private Integer orderNo = 1;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public CareerVideo() {}

    public CareerVideo(CareerLesson lesson, String title, String youtubeUrl, Integer durationMinutes, Integer orderNo) {
        this.lesson = lesson;
        this.title = title;
        this.youtubeUrl = youtubeUrl;
        this.durationMinutes = durationMinutes != null ? durationMinutes : 0;
        this.orderNo = orderNo != null ? orderNo : 1;
    }

    // ── Getters & Setters ──────────────────────────────
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public CareerLesson getLesson() { return lesson; }
    public void setLesson(CareerLesson lesson) { this.lesson = lesson; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getYoutubeUrl() { return youtubeUrl; }
    public void setYoutubeUrl(String youtubeUrl) { this.youtubeUrl = youtubeUrl; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public Integer getOrderNo() { return orderNo; }
    public void setOrderNo(Integer orderNo) { this.orderNo = orderNo; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public Long getLessonId() {
        return lesson != null ? lesson.getId() : null;
    }
}
