package com.careerpilot.backend.service;

import com.careerpilot.backend.model.*;
import com.careerpilot.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CareerLmsService {

    @Autowired private CareerGoalRepository careerGoalRepository;
    @Autowired private CareerModuleRepository careerModuleRepository;
    @Autowired private CareerLessonRepository careerLessonRepository;
    @Autowired private CareerNotesRepository careerNotesRepository;
    @Autowired private CareerVideoRepository careerVideoRepository;
    @Autowired private CareerQuizRepository careerQuizRepository;

    // ── Hierarchy Verification ─────────────────────────────────

    public CareerModule verifyModuleBelongsToCareer(Long careerGoalId, Long moduleId) {
        CareerModule module = careerModuleRepository.findById(moduleId)
                .orElseThrow(() -> new NoSuchElementException("Module not found with ID: " + moduleId));
        if (!module.getCareerGoal().getId().equals(careerGoalId)) {
            throw new IllegalArgumentException("Module " + moduleId + " does not belong to Career Goal " + careerGoalId);
        }
        return module;
    }

    public CareerLesson verifyLessonBelongsToModuleAndCareer(Long careerGoalId, Long moduleId, Long lessonId) {
        verifyModuleBelongsToCareer(careerGoalId, moduleId);
        CareerLesson lesson = careerLessonRepository.findById(lessonId)
                .orElseThrow(() -> new NoSuchElementException("Lesson not found with ID: " + lessonId));
        if (!lesson.getModule().getId().equals(moduleId)) {
            throw new IllegalArgumentException("Lesson " + lessonId + " does not belong to Module " + moduleId);
        }
        return lesson;
    }

    // ── User / Read APIs ───────────────────────────────────────

    public List<CareerGoal> getAllCareerGoals() {
        return careerGoalRepository.findAll();
    }

    public List<CareerModule> getModulesForCareer(Long careerGoalId) {
        return careerModuleRepository.findByCareerGoal_IdOrderByModuleOrderAsc(careerGoalId);
    }

    public List<CareerLesson> getLessonsForModule(Long careerGoalId, Long moduleId) {
        verifyModuleBelongsToCareer(careerGoalId, moduleId);
        return careerLessonRepository.findByModule_IdOrderByLessonOrderAsc(moduleId);
    }

    public List<CareerLesson> getLessonsForModuleLegacy(Long moduleId) {
        return careerLessonRepository.findByModule_IdOrderByLessonOrderAsc(moduleId);
    }

    public List<CareerQuiz> getQuizzesForLessonLegacy(Long lessonId) {
        return careerQuizRepository.findByLesson_Id(lessonId);
    }

    public List<CareerNotes> getNotesForLesson(Long careerGoalId, Long moduleId, Long lessonId) {
        verifyLessonBelongsToModuleAndCareer(careerGoalId, moduleId, lessonId);
        return careerNotesRepository.findByLesson_Id(lessonId);
    }

    public List<CareerVideo> getVideosForLesson(Long careerGoalId, Long moduleId, Long lessonId) {
        verifyLessonBelongsToModuleAndCareer(careerGoalId, moduleId, lessonId);
        return careerVideoRepository.findByLesson_IdOrderByOrderNoAsc(lessonId);
    }

    public List<CareerQuiz> getQuizzesForLesson(Long careerGoalId, Long moduleId, Long lessonId) {
        verifyLessonBelongsToModuleAndCareer(careerGoalId, moduleId, lessonId);
        return careerQuizRepository.findByLesson_Id(lessonId);
    }

    // ── Admin CRUD APIs ────────────────────────────────────────

    public CareerModule createModule(Long careerGoalId, String name, String description, Integer moduleOrder) {
        CareerGoal goal = careerGoalRepository.findById(careerGoalId)
                .orElseThrow(() -> new NoSuchElementException("Career Goal not found: " + careerGoalId));
        CareerModule m = new CareerModule();
        m.setCareerGoal(goal);
        m.setName(name);
        m.setDescription(description);
        m.setModuleOrder(moduleOrder != null ? moduleOrder : 1);
        return careerModuleRepository.save(m);
    }

    public CareerModule updateModule(Long careerGoalId, Long moduleId, String name, String description, Integer moduleOrder) {
        CareerModule m = verifyModuleBelongsToCareer(careerGoalId, moduleId);
        if (name != null) m.setName(name);
        if (description != null) m.setDescription(description);
        if (moduleOrder != null) m.setModuleOrder(moduleOrder);
        return careerModuleRepository.save(m);
    }

    public void deleteModule(Long careerGoalId, Long moduleId) {
        verifyModuleBelongsToCareer(careerGoalId, moduleId);
        careerModuleRepository.deleteById(moduleId);
    }

    public CareerLesson createLesson(Long careerGoalId, Long moduleId, String name, String description, Integer lessonOrder) {
        CareerModule module = verifyModuleBelongsToCareer(careerGoalId, moduleId);
        CareerLesson l = new CareerLesson();
        l.setModule(module);
        l.setName(name);
        l.setDescription(description);
        l.setLessonOrder(lessonOrder != null ? lessonOrder : 1);
        return careerLessonRepository.save(l);
    }

    public CareerLesson updateLesson(Long careerGoalId, Long moduleId, Long lessonId, String name, String description, Integer lessonOrder) {
        CareerLesson l = verifyLessonBelongsToModuleAndCareer(careerGoalId, moduleId, lessonId);
        if (name != null) l.setName(name);
        if (description != null) l.setDescription(description);
        if (lessonOrder != null) l.setLessonOrder(lessonOrder);
        return careerLessonRepository.save(l);
    }

    public void deleteLesson(Long careerGoalId, Long moduleId, Long lessonId) {
        verifyLessonBelongsToModuleAndCareer(careerGoalId, moduleId, lessonId);
        careerLessonRepository.deleteById(lessonId);
    }

    public CareerNotes createNotes(Long careerGoalId, Long moduleId, Long lessonId, String title, String content) {
        CareerLesson lesson = verifyLessonBelongsToModuleAndCareer(careerGoalId, moduleId, lessonId);
        CareerNotes note = new CareerNotes(lesson, title, content);
        return careerNotesRepository.save(note);
    }

    public CareerNotes updateNotes(Long careerGoalId, Long moduleId, Long lessonId, Long noteId, String title, String content) {
        verifyLessonBelongsToModuleAndCareer(careerGoalId, moduleId, lessonId);
        CareerNotes note = careerNotesRepository.findById(noteId)
                .orElseThrow(() -> new NoSuchElementException("Note not found: " + noteId));
        if (!note.getLesson().getId().equals(lessonId)) {
            throw new IllegalArgumentException("Note does not belong to lesson " + lessonId);
        }
        if (title != null) note.setTitle(title);
        if (content != null) note.setContent(content);
        return careerNotesRepository.save(note);
    }

    public void deleteNotes(Long careerGoalId, Long moduleId, Long lessonId, Long noteId) {
        verifyLessonBelongsToModuleAndCareer(careerGoalId, moduleId, lessonId);
        CareerNotes note = careerNotesRepository.findById(noteId)
                .orElseThrow(() -> new NoSuchElementException("Note not found: " + noteId));
        if (!note.getLesson().getId().equals(lessonId)) {
            throw new IllegalArgumentException("Note does not belong to lesson " + lessonId);
        }
        careerNotesRepository.deleteById(noteId);
    }

    public CareerVideo createVideo(Long careerGoalId, Long moduleId, Long lessonId, String title, String youtubeUrl, Integer durationMinutes, Integer orderNo) {
        CareerLesson lesson = verifyLessonBelongsToModuleAndCareer(careerGoalId, moduleId, lessonId);
        validateYouTubeUrl(youtubeUrl);
        CareerVideo video = new CareerVideo(lesson, title, youtubeUrl, durationMinutes, orderNo);
        return careerVideoRepository.save(video);
    }

    public CareerVideo updateVideo(Long careerGoalId, Long moduleId, Long lessonId, Long videoId, String title, String youtubeUrl, Integer durationMinutes, Integer orderNo) {
        verifyLessonBelongsToModuleAndCareer(careerGoalId, moduleId, lessonId);
        CareerVideo video = careerVideoRepository.findById(videoId)
                .orElseThrow(() -> new NoSuchElementException("Video not found: " + videoId));
        if (!video.getLesson().getId().equals(lessonId)) {
            throw new IllegalArgumentException("Video does not belong to lesson " + lessonId);
        }
        if (title != null) video.setTitle(title);
        if (youtubeUrl != null) {
            validateYouTubeUrl(youtubeUrl);
            video.setYoutubeUrl(youtubeUrl);
        }
        if (durationMinutes != null) video.setDurationMinutes(durationMinutes);
        if (orderNo != null) video.setOrderNo(orderNo);
        return careerVideoRepository.save(video);
    }

    public void deleteVideo(Long careerGoalId, Long moduleId, Long lessonId, Long videoId) {
        verifyLessonBelongsToModuleAndCareer(careerGoalId, moduleId, lessonId);
        CareerVideo video = careerVideoRepository.findById(videoId)
                .orElseThrow(() -> new NoSuchElementException("Video not found: " + videoId));
        if (!video.getLesson().getId().equals(lessonId)) {
            throw new IllegalArgumentException("Video does not belong to lesson " + lessonId);
        }
        careerVideoRepository.deleteById(videoId);
    }

    public CareerQuiz createQuiz(Long careerGoalId, Long moduleId, Long lessonId, String question, String optionA, String optionB, String optionC, String optionD, String correctAnswer, String explanation) {
        CareerLesson lesson = verifyLessonBelongsToModuleAndCareer(careerGoalId, moduleId, lessonId);
        CareerQuiz quiz = new CareerQuiz();
        quiz.setLesson(lesson);
        quiz.setQuestion(question);
        quiz.setOptionA(optionA);
        quiz.setOptionB(optionB);
        quiz.setOptionC(optionC);
        quiz.setOptionD(optionD);
        quiz.setCorrectAnswer(correctAnswer);
        quiz.setExplanation(explanation);
        return careerQuizRepository.save(quiz);
    }

    public CareerQuiz updateQuiz(Long careerGoalId, Long moduleId, Long lessonId, Long quizId, String question, String optionA, String optionB, String optionC, String optionD, String correctAnswer, String explanation) {
        verifyLessonBelongsToModuleAndCareer(careerGoalId, moduleId, lessonId);
        CareerQuiz quiz = careerQuizRepository.findById(quizId)
                .orElseThrow(() -> new NoSuchElementException("Quiz not found: " + quizId));
        if (!quiz.getLesson().getId().equals(lessonId)) {
            throw new IllegalArgumentException("Quiz does not belong to lesson " + lessonId);
        }
        if (question != null) quiz.setQuestion(question);
        if (optionA != null) quiz.setOptionA(optionA);
        if (optionB != null) quiz.setOptionB(optionB);
        if (optionC != null) quiz.setOptionC(optionC);
        if (optionD != null) quiz.setOptionD(optionD);
        if (correctAnswer != null) quiz.setCorrectAnswer(correctAnswer);
        if (explanation != null) quiz.setExplanation(explanation);
        return careerQuizRepository.save(quiz);
    }

    public void deleteQuiz(Long careerGoalId, Long moduleId, Long lessonId, Long quizId) {
        verifyLessonBelongsToModuleAndCareer(careerGoalId, moduleId, lessonId);
        CareerQuiz quiz = careerQuizRepository.findById(quizId)
                .orElseThrow(() -> new NoSuchElementException("Quiz not found: " + quizId));
        if (!quiz.getLesson().getId().equals(lessonId)) {
            throw new IllegalArgumentException("Quiz does not belong to lesson " + lessonId);
        }
        careerQuizRepository.deleteById(quizId);
    }

    private void validateYouTubeUrl(String url) {
        if (url == null || (!url.contains("youtube.com") && !url.contains("youtu.be"))) {
            throw new IllegalArgumentException("Invalid YouTube URL: Must be a valid youtube.com or youtu.be link.");
        }
    }
}
