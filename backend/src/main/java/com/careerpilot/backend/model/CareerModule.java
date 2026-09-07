package com.careerpilot.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "career_modules")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class CareerModule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "career_goal_id", nullable = false)
    @JsonIgnore
    private CareerGoal careerGoal;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "module_order")
    private Integer moduleOrder;

    @OneToMany(mappedBy = "module", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<CareerLesson> lessons;

    public CareerModule() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public CareerGoal getCareerGoal() { return careerGoal; }
    public void setCareerGoal(CareerGoal careerGoal) { this.careerGoal = careerGoal; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getModuleOrder() { return moduleOrder; }
    public void setModuleOrder(Integer moduleOrder) { this.moduleOrder = moduleOrder; }

    public List<CareerLesson> getLessons() { return lessons; }
    public void setLessons(List<CareerLesson> lessons) { this.lessons = lessons; }

    public Long getCareerGoalId() {
        return careerGoal != null ? careerGoal.getId() : null;
    }
}
