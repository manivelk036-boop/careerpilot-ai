package com.careerpilot.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "career_lessons")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class CareerLesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "module_id", nullable = false)
    @JsonIgnore
    private CareerModule module;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "lesson_order")
    private Integer lessonOrder;

    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<CareerQuiz> quizzes;

    public CareerLesson() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public CareerModule getModule() { return module; }
    public void setModule(CareerModule module) { this.module = module; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getLessonOrder() { return lessonOrder; }
    public void setLessonOrder(Integer lessonOrder) { this.lessonOrder = lessonOrder; }

    public List<CareerQuiz> getQuizzes() { return quizzes; }
    public void setQuizzes(List<CareerQuiz> quizzes) { this.quizzes = quizzes; }

    public Long getModuleId() {
        return module != null ? module.getId() : null;
    }
}
