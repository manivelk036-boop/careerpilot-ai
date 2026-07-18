package com.careerpilot.backend.config;

import com.careerpilot.backend.model.*;
import com.careerpilot.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired private CourseRepository courseRepository;
    @Autowired private ModuleRepository moduleRepository;
    @Autowired private VideoRepository videoRepository;
    @Autowired private NotesRepository notesRepository;
    @Autowired private QuizRepository quizRepository;

    @Override
    public void run(String... args) throws Exception {
        // Seed only if no courses exist
        if (courseRepository.count() == 0) {
            seedJavaCourse();
        }
    }

    private void seedJavaCourse() {
        // 1. Create Course
        Course javaCourse = new Course();
        javaCourse.setTitle("Java Programming Masterclass");
        javaCourse.setDescription("Learn Java from scratch: OOP concepts, collections framework, exception handling, and enterprise development standards.");
        javaCourse.setCategory("Programming");
        javaCourse.setDifficulty("Beginner");
        javaCourse.setInstructor("Dr. Angela Yu");
        javaCourse.setDurationHours(28);
        javaCourse.setThumbnailUrl("https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop");
        javaCourse = courseRepository.save(javaCourse);

        // 2. Module 1: Introduction
        CourseModule m1 = new CourseModule();
        m1.setCourse(javaCourse);
        m1.setTitle("Introduction to Java & Setup");
        m1.setDescription("Setup JDK, understand JVM architectures, write and run your first Hello World program.");
        m1.setModuleOrder(1);
        m1 = moduleRepository.save(m1);

        // Video for M1
        Video v1 = new Video();
        v1.setModule(m1);
        v1.setTitle("Java JDK Installation & Hello World");
        v1.setYoutubeUrl("https://www.youtube.com/watch?v=eIrMbAQSU34");
        v1.setDurationMinutes(15);
        v1.setOrderNo(1);
        videoRepository.save(v1);

        // Notes for M1
        Notes n1 = new Notes();
        n1.setModule(m1);
        n1.setTitle("Module 1 Installation Guide");
        n1.setPdfUrl("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf");
        notesRepository.save(n1);

        // Quiz for M1
        QuizQuestion q1_1 = new QuizQuestion();
        q1_1.setModule(m1);
        q1_1.setQuestion("Which component is responsible for running Java bytecode?");
        q1_1.setOption1("JDK (Java Development Kit)");
        q1_1.setOption2("JVM (Java Virtual Machine)");
        q1_1.setOption3("JRE (Java Runtime Environment)");
        q1_1.setOption4("Javac (Java Compiler)");
        q1_1.setCorrectAnswer(2);
        q1_1.setExplanation("The JVM (Java Virtual Machine) executes compiled bytecode.");
        quizRepository.save(q1_1);

        QuizQuestion q1_2 = new QuizQuestion();
        q1_2.setModule(m1);
        q1_2.setQuestion("What is the extension of a compiled Java class file?");
        q1_2.setOption1(".java");
        q1_2.setOption2(".txt");
        q1_2.setOption3(".class");
        q1_2.setOption4(".exe");
        q1_2.setCorrectAnswer(3);
        q1_2.setExplanation("Java source files are compiled into .class files containing bytecode.");
        quizRepository.save(q1_2);


        // 3. Module 2: Variables & Data Types
        CourseModule m2 = new CourseModule();
        m2.setCourse(javaCourse);
        m2.setTitle("Variables & Data Types");
        m2.setDescription("Learn about primitive types, variable declarations, memory scopes, and type casting.");
        m2.setModuleOrder(2);
        m2 = moduleRepository.save(m2);

        // Video for M2
        Video v2 = new Video();
        v2.setModule(m2);
        v2.setTitle("Understanding Java Variables & Stack Memory");
        v2.setYoutubeUrl("https://www.youtube.com/watch?v=lhELGQipjNo");
        v2.setDurationMinutes(22);
        v2.setOrderNo(1);
        videoRepository.save(v2);

        // Notes for M2
        Notes n2 = new Notes();
        n2.setModule(m2);
        n2.setTitle("Module 2 Variables Cheat Sheet");
        n2.setPdfUrl("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf");
        notesRepository.save(n2);

        // Quiz for M2
        QuizQuestion q2_1 = new QuizQuestion();
        q2_1.setModule(m2);
        q2_1.setQuestion("Which data type is used to store floating-point numbers by default in Java?");
        q2_1.setOption1("float");
        q2_1.setOption2("double");
        q2_1.setOption3("int");
        q2_1.setOption4("long");
        q2_1.setCorrectAnswer(2);
        q2_1.setExplanation("In Java, decimal numbers are treated as double precision floating-point by default.");
        quizRepository.save(q2_1);
    }
}
