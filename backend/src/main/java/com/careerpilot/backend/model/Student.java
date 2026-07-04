package com.careerpilot.backend.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    private String college;
    private String department;
    @Column(name = "academic_year")
    private Integer year;
    private Double cgpa;
    private String careerGoal;

    private Integer xp = 0;
    private Integer coins = 0;
    private Integer streak = 0;
    private String lastLoginDate;
    private Integer placementScore = 0;
    private Integer communicationScore = 0;
    private Integer resumeScore = 0;
    private Integer mockInterviewsDone = 0;
    private Boolean isLoggedIn = false;
    private Boolean isOnboarded = false;
    private Boolean baselineAssessmentCompleted = false;

    @Convert(converter = StudentConverters.StringListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<String> skills = new ArrayList<>();

    @Convert(converter = StudentConverters.ListMapConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<Map<String, Object>> projects = new ArrayList<>();

    @Convert(converter = StudentConverters.ListMapConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<Map<String, Object>> certifications = new ArrayList<>();

    @Convert(converter = StudentConverters.ListMapConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<Map<String, Object>> internships = new ArrayList<>();

    @Convert(converter = StudentConverters.StringListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<String> badges = new ArrayList<>();

    @Convert(converter = StudentConverters.StringListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<String> topicsCompleted = new ArrayList<>();

    @Convert(converter = StudentConverters.MapStringIntegerConverter.class)
    @Column(columnDefinition = "TEXT")
    private Map<String, Integer> quizScores = new HashMap<>();

    @Convert(converter = StudentConverters.MapStringIntegerConverter.class)
    @Column(columnDefinition = "TEXT")
    private Map<String, Integer> placementBreakdown = new HashMap<>();

    @Convert(converter = StudentConverters.MapStringIntegerConverter.class)
    @Column(columnDefinition = "TEXT")
    private Map<String, Integer> aptitudeScores = new HashMap<>();

    @Convert(converter = StudentConverters.StringListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<String> resumeKeywords = new ArrayList<>();

    @Convert(converter = StudentConverters.MapStringObjectConverter.class)
    @Column(columnDefinition = "TEXT")
    private Map<String, Object> roadmapProgress = new HashMap<>();

    @Convert(converter = StudentConverters.BooleanListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<Boolean> studyStreak = new ArrayList<>();

    // Default Constructor
    public Student() {
        // Initialize empty defaults
        this.placementBreakdown.put("technical", 0);
        this.placementBreakdown.put("communication", 0);
        this.placementBreakdown.put("problemSolving", 0);
        this.placementBreakdown.put("interviewReadiness", 0);
        this.placementBreakdown.put("certifications", 0);
        this.placementBreakdown.put("projects", 0);
        this.placementBreakdown.put("aptitude", 0);
        this.placementBreakdown.put("internship", 0);

        this.aptitudeScores.put("quant", 0);
        this.aptitudeScores.put("logical", 0);
        this.aptitudeScores.put("verbal", 0);

        for (int i = 0; i < 7; i++) {
            this.studyStreak.add(false);
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public Double getCgpa() { return cgpa; }
    public void setCgpa(Double cgpa) { this.cgpa = cgpa; }

    public String getCareerGoal() { return careerGoal; }
    public void setCareerGoal(String careerGoal) { this.careerGoal = careerGoal; }

    public Integer getXp() { return xp; }
    public void setXp(Integer xp) { this.xp = xp; }

    public Integer getCoins() { return coins; }
    public void setCoins(Integer coins) { this.coins = coins; }

    public Integer getStreak() { return streak; }
    public void setStreak(Integer streak) { this.streak = streak; }

    public String getLastLoginDate() { return lastLoginDate; }
    public void setLastLoginDate(String lastLoginDate) { this.lastLoginDate = lastLoginDate; }

    public Integer getPlacementScore() { return placementScore; }
    public void setPlacementScore(Integer placementScore) { this.placementScore = placementScore; }

    public Integer getCommunicationScore() { return communicationScore; }
    public void setCommunicationScore(Integer communicationScore) { this.communicationScore = communicationScore; }

    public Integer getResumeScore() { return resumeScore; }
    public void setResumeScore(Integer resumeScore) { this.resumeScore = resumeScore; }

    public Integer getMockInterviewsDone() { return mockInterviewsDone; }
    public void setMockInterviewsDone(Integer mockInterviewsDone) { this.mockInterviewsDone = mockInterviewsDone; }

    public Boolean getIsLoggedIn() { return isLoggedIn; }
    public void setIsLoggedIn(Boolean isLoggedIn) { this.isLoggedIn = isLoggedIn; }

    public Boolean getIsOnboarded() { return isOnboarded; }
    public void setIsOnboarded(Boolean isOnboarded) { this.isOnboarded = isOnboarded; }

    public Boolean getBaselineAssessmentCompleted() { return baselineAssessmentCompleted; }
    public void setBaselineAssessmentCompleted(Boolean baselineAssessmentCompleted) { this.baselineAssessmentCompleted = baselineAssessmentCompleted; }

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }

    public List<Map<String, Object>> getProjects() { return projects; }
    public void setProjects(List<Map<String, Object>> projects) { this.projects = projects; }

    public List<Map<String, Object>> getCertifications() { return certifications; }
    public void setCertifications(List<Map<String, Object>> certifications) { this.certifications = certifications; }

    public List<Map<String, Object>> getInternships() { return internships; }
    public void setInternships(List<Map<String, Object>> internships) { this.internships = internships; }

    public List<String> getBadges() { return badges; }
    public void setBadges(List<String> badges) { this.badges = badges; }

    public List<String> getTopicsCompleted() { return topicsCompleted; }
    public void setTopicsCompleted(List<String> topicsCompleted) { this.topicsCompleted = topicsCompleted; }

    public Map<String, Integer> getQuizScores() { return quizScores; }
    public void setQuizScores(Map<String, Integer> quizScores) { this.quizScores = quizScores; }

    public Map<String, Integer> getPlacementBreakdown() { return placementBreakdown; }
    public void setPlacementBreakdown(Map<String, Integer> placementBreakdown) { this.placementBreakdown = placementBreakdown; }

    public Map<String, Integer> getAptitudeScores() { return aptitudeScores; }
    public void setAptitudeScores(Map<String, Integer> aptitudeScores) { this.aptitudeScores = aptitudeScores; }

    public List<String> getResumeKeywords() { return resumeKeywords; }
    public void setResumeKeywords(List<String> resumeKeywords) { this.resumeKeywords = resumeKeywords; }

    public Map<String, Object> getRoadmapProgress() { return roadmapProgress; }
    public void setRoadmapProgress(Map<String, Object> roadmapProgress) { this.roadmapProgress = roadmapProgress; }

    public List<Boolean> getStudyStreak() { return studyStreak; }
    public void setStudyStreak(List<Boolean> studyStreak) { this.studyStreak = studyStreak; }
}
