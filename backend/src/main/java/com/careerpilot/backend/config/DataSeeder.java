package com.careerpilot.backend.config;

import com.careerpilot.backend.model.*;
import com.careerpilot.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired private CourseRepository courseRepository;
    @Autowired private ModuleRepository moduleRepository;
    @Autowired private VideoRepository videoRepository;
    @Autowired private NotesRepository notesRepository;
    @Autowired private QuizRepository quizRepository;

    @Override
    public void run(String... args) throws Exception {
        seedCourseStructure();
        seedMasterQuestionBank();
    }

    private void seedCourseStructure() {
        if (courseRepository.count() > 0) return;

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

        Video v1 = new Video();
        v1.setModule(m1);
        v1.setTitle("Java JDK Installation & Hello World");
        v1.setYoutubeUrl("https://www.youtube.com/watch?v=eIrMbAQSU34");
        v1.setDurationMinutes(15);
        v1.setOrderNo(1);
        videoRepository.save(v1);

        Notes n1 = new Notes();
        n1.setModule(m1);
        n1.setTitle("Module 1 Installation Guide");
        n1.setPdfUrl("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf");
        notesRepository.save(n1);

        // 3. Module 2: Variables & Data Types
        CourseModule m2 = new CourseModule();
        m2.setCourse(javaCourse);
        m2.setTitle("Variables & Data Types");
        m2.setDescription("Learn about primitive types, variable declarations, memory scopes, and type casting.");
        m2.setModuleOrder(2);
        m2 = moduleRepository.save(m2);

        Video v2 = new Video();
        v2.setModule(m2);
        v2.setTitle("Understanding Java Variables & Stack Memory");
        v2.setYoutubeUrl("https://www.youtube.com/watch?v=lhELGQipjNo");
        v2.setDurationMinutes(22);
        v2.setOrderNo(1);
        videoRepository.save(v2);

        Notes n2 = new Notes();
        n2.setModule(m2);
        n2.setTitle("Module 2 Variables Cheat Sheet");
        n2.setPdfUrl("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf");
        notesRepository.save(n2);
    }

    private void seedMasterQuestionBank() {
        // --- Core Java ---
        addQ("What is the size of `int` primitive type in Java?", "16 bit", "32 bit", "64 bit", "Depends on OS", 2, "In Java, primitives have fixed sizes regardless of platform. `int` is strictly 32-bit.", "Core Java", "Data Types", "Easy", "TCS", "java,primitives,datatype");
        addQ("What is the default value of a boolean array element upon initialization?", "true", "false", "null", "0", 2, "Elements of boolean arrays default to `false` in Java.", "Core Java", "Arrays", "Easy", "Wipro", "java,arrays,defaults");
        addQ("Which keyword is used to stop variable modification?", "static", "final", "abstract", "volatile", 2, "Applying `final` to a variable makes it immutable after initialization.", "Core Java", "Variables", "Easy", "Infosys", "java,final,variables");
        addQ("Which package is imported implicitly into every Java program?", "java.util", "java.io", "java.lang", "java.net", 3, "`java.lang` is auto-imported by the compiler.", "Core Java", "Java Basics", "Easy", "TCS", "java,packages,basics");
        addQ("What is the output of `System.out.println(10 + 20 + \"Java\");`?", "Java1020", "30Java", "1020Java", "Error", 2, "Evaluates left to right: `10 + 20` gives 30, then string concatenation produces `30Java`.", "Core Java", "Operators", "Easy", "Zoho", "java,operators,concatenation");
        addQ("What is the output of `System.out.println(\"Java\" + 10 + 20);`?", "Java1020", "Java30", "30Java", "Error", 1, "Evaluates left to right: String + 10 becomes 'Java10', then + 20 becomes 'Java1020'.", "Core Java", "Operators", "Easy", "Zoho", "java,operators,concatenation");
        addQ("Which operator is used for bitwise XOR in Java?", "&", "|", "^", "~", 3, "The `^` symbol represents bitwise XOR.", "Core Java", "Operators", "Easy", "Freshworks", "java,operators,bitwise");
        addQ("Which statement about `String` is TRUE?", "String is mutable", "String is immutable", "String extends StringBuilder", "String is primitive", 2, "String objects cannot be changed once created.", "Core Java", "Strings", "Easy", "TCS", "java,strings,immutability");
        addQ("Where are String literals stored in memory?", "Native Stack", "String Constant Pool", "Metaspace", "Register", 2, "String literals reside in the String Constant Pool in Heap.", "Core Java", "Strings", "Medium", "Amazon", "java,memory,strings");
        addQ("What does `s1.equals(s2)` compare when applied to String objects?", "Memory addresses", "Character content", "Hashcode values", "String length", 2, "`String.equals()` is overridden to perform sequence content comparison.", "Core Java", "Strings", "Easy", "Infosys", "java,strings,equals");
        addQ("Which of the following is valid declaration of a float variable?", "float f = 3.14;", "float f = (float) 3.14d;", "float f = 3.14f;", "Both B and C", 4, "Floating point literals default to double, requiring 'f' suffix or explicit cast.", "Core Java", "Data Types", "Medium", "Wipro", "java,datatypes,float");
        addQ("Which keyword prevents class inheritance?", "static", "final", "private", "sealed", 2, "Declaring a class `final` prevents any other class from extending it.", "Core Java", "Java Basics", "Easy", "TCS", "java,inheritance,final");
        addQ("What is the result of `10 % 3` in Java?", "3", "1", "0", "3.33", 2, "The modulus operator returns the division remainder.", "Core Java", "Operators", "Easy", "Zoho", "java,operators,modulus");
        addQ("Which method converts String to uppercase in-place?", "s.toUpperCase()", "s.toUpper()", "None, String is immutable", "s.makeUpper()", 3, "`toUpperCase()` returns a new String object rather than mutating in-place.", "Core Java", "Strings", "Medium", "Amazon", "java,strings,methods");
        addQ("What is the initial default capacity of a `StringBuilder`?", "10", "16", "32", "0", 2, "Standard StringBuilder constructor initializes with a buffer of 16 characters.", "Core Java", "Strings", "Medium", "Freshworks", "java,stringbuilder,capacity");

        // --- OOP ---
        addQ("Which OOP concept involves hiding implementation details and showing only functionality?", "Polymorphism", "Inheritance", "Abstraction", "Encapsulation", 3, "Abstraction isolates interface design from underlying realization.", "OOP", "Abstraction", "Easy", "TCS", "oop,abstraction");
        addQ("Binding data members and methods together inside a single unit is called:", "Abstraction", "Encapsulation", "Inheritance", "Polymorphism", 2, "Encapsulation bundles data with operations and hides inner fields.", "OOP", "Encapsulation", "Easy", "Infosys", "oop,encapsulation");
        addQ("Method Overloading is an example of:", "Compile-time Polymorphism", "Runtime Polymorphism", "Dynamic Binding", "Multiple Inheritance", 1, "Overloading is resolved during compilation based on signature match.", "OOP", "Polymorphism", "Easy", "Wipro", "oop,overloading,polymorphism");
        addQ("Method Overriding is an example of:", "Static Binding", "Runtime Polymorphism", "Abstraction", "Compile-time Polymorphism", 2, "Overriding is resolved at runtime using the actual object instance.", "OOP", "Polymorphism", "Easy", "Zoho", "oop,overriding,polymorphism");
        addQ("Which keyword is used by a child class to access parent constructor?", "this", "super", "parent", "base", 2, "`super()` invokes parent constructor.", "OOP", "Inheritance", "Easy", "TCS", "oop,super,constructor");
        addQ("Can an abstract class have constructors in Java?", "No", "Yes", "Only private constructors", "Only static constructors", 2, "Abstract classes have constructors called when subclasses are initialized.", "OOP", "Abstraction", "Medium", "Amazon", "oop,abstract,constructor");
        addQ("Can an interface have concrete methods in Java 8+?", "No", "Yes, via default and static methods", "Only private methods", "Only protected methods", 2, "Java 8 enabled `default` and `static` concrete body definitions in interfaces.", "OOP", "Interfaces", "Medium", "Zoho", "oop,interfaces,java8");
        addQ("Multiple inheritance using classes in Java is:", "Fully Supported", "Not Supported", "Supported via abstract class", "Supported via dynamic proxy", 2, "Java avoids dynamic diamond collisions by disabling multiple class inheritance.", "OOP", "Inheritance", "Easy", "Freshworks", "oop,inheritance,multiple");
        addQ("Which access modifier gives the widest visibility?", "protected", "public", "default", "private", 2, "`public` members are accessible everywhere.", "OOP", "Encapsulation", "Easy", "TCS", "oop,accessmodifiers");
        addQ("Which access modifier restricts visibility to the defining class only?", "protected", "default", "private", "package-private", 3, "`private` keeps access bounded to the defining class body.", "OOP", "Encapsulation", "Easy", "Infosys", "oop,accessmodifiers,private");
        addQ("What happens if a class implements two interfaces with identical default methods?", "First interface method executes", "Compiler error unless overridden", "Runtime Exception", "Second interface method executes", 2, "The compiler demands explicit override resolution to avoid ambiguity.", "OOP", "Interfaces", "Hard", "Amazon", "oop,interfaces,diamond");
        addQ("A class that cannot be instantiated is called:", "Final class", "Abstract class", "Static class", "Immutable class", 2, "Abstract classes cannot be directly created using `new`.", "OOP", "Abstraction", "Easy", "Wipro", "oop,abstract");
        addQ("Which marker interface indicates object cloneability?", "Serializable", "Cloneable", "Remote", "RandomAccess", 2, "`Cloneable` grants permissions to `Object.clone()`.", "OOP", "Interfaces", "Medium", "Zoho", "oop,cloneable,marker");
        addQ("What type of relationship does inheritance represent?", "HAS-A", "IS-A", "USES-A", "BELONGS-TO", 2, "Inheritance models an IS-A relationship.", "OOP", "Inheritance", "Easy", "TCS", "oop,isa,relationship");
        addQ("Composition models which relationship type?", "IS-A", "HAS-A", "IMPLEMENTS-A", "EXTENDS-A", 2, "Composition models ownership (HAS-A).", "OOP", "Inheritance", "Easy", "Freshworks", "oop,hasa,composition");

        // --- Exceptions ---
        addQ("Which class is the superclass of all Exception and Error classes in Java?", "Exception", "Throwable", "RuntimeException", "Object", 2, "`Throwable` is the root of the Java error architecture.", "Exceptions", "Exception Hierarchy", "Easy", "TCS", "java,exceptions,throwable");
        addQ("Which of the following is an UNCHECKED exception?", "IOException", "SQLException", "NullPointerException", "ClassNotFoundException", 3, "`NullPointerException` inherits from `RuntimeException` (Unchecked).", "Exceptions", "Unchecked Exceptions", "Medium", "Infosys", "java,exceptions,unchecked");
        addQ("Which block is ALWAYS executed regardless of exception occurrence?", "try", "catch", "finally", "throw", 3, "`finally` blocks execute almost unconditionally.", "Exceptions", "Try-Catch-Finally", "Easy", "Wipro", "java,exceptions,finally");
        addQ("Which keyword is used to manually throw an exception?", "throws", "throw", "catching", "try", 2, "`throw` explicitly raises an exception object.", "Exceptions", "Custom Exceptions", "Easy", "TCS", "java,exceptions,throw");
        addQ("Which keyword is used in method signature to declare exceptions?", "throw", "throws", "Throwable", "try", 2, "`throws` lists checked exceptions in the signature.", "Exceptions", "Custom Exceptions", "Easy", "Zoho", "java,exceptions,throws");
        addQ("AutoCloseable resources in Try-With-Resources are closed in which order?", "Forward declaration order", "Reverse declaration order", "Random order", "Parallel order", 2, "Resources close in reverse relative to their declaration sequence.", "Exceptions", "Try-Catch-Finally", "Hard", "Amazon", "java,exceptions,trywithresources");
        addQ("What exception occurs when dividing an integer by zero?", "ArithmeticException", "NumberFormatException", "IllegalArgumentException", "NullPointerException", 1, "Integer division by zero throws `ArithmeticException`.", "Exceptions", "Unchecked Exceptions", "Easy", "Freshworks", "java,exceptions,arithmetic");
        addQ("Which exception occurs when parsing invalid numeric String via `Integer.parseInt()`?", "ClassCastException", "NumberFormatException", "IllegalStateException", "IndexOutOfBoundsException", 2, "Malformed numeric string conversions trigger `NumberFormatException`.", "Exceptions", "Unchecked Exceptions", "Easy", "TCS", "java,exceptions,numberformat");
        addQ("Can a `try` block exist without a `catch` block?", "No", "Yes, if finally or try-with-resources is present", "Yes, always", "Only in static methods", 2, "A try block can be paired solely with `finally` or resources.", "Exceptions", "Try-Catch-Finally", "Medium", "Zoho", "java,exceptions,tryfinally");
        addQ("Is `OutOfMemoryError` checked or unchecked?", "Checked", "Unchecked (Error)", "Compile time error", "Warning", 2, "Errors extend `Throwable` and are unchecked.", "Exceptions", "Exception Hierarchy", "Medium", "Amazon", "java,exceptions,oom");

        // --- Collections ---
        addQ("Which interface does NOT extend `Collection` interface?", "List", "Set", "Map", "Queue", 3, "`Map` represents key-value mappings and sits on its own hierarchy branch.", "Collections", "Collection Hierarchy", "Easy", "TCS", "collections,map");
        addQ("Which Collection implementation guarantees element insertion order?", "HashSet", "LinkedHashSet", "TreeSet", "PriorityQueue", 2, "`LinkedHashSet` maintains a doubly-linked list across entries for insertion order.", "Collections", "Set", "Medium", "Infosys", "collections,linkedhashset");
        addQ("Which Set implementation maintains natural sorted order?", "HashSet", "LinkedHashSet", "TreeSet", "ArraySet", 3, "`TreeSet` uses a NavigableMap structure for sorted order.", "Collections", "Set", "Medium", "Wipro", "collections,treeset");
        addQ("What is the default load factor of a HashMap?", "0.5", "0.75", "1.0", "0.85", 2, "0.75 balances time and memory trade-offs in HashMaps.", "Collections", "Map", "Medium", "Amazon", "collections,hashmap,loadfactor");
        addQ("How does HashMap handle bucket collisions in Java 8+?", "Linked List / Red-Black Tree", "Double Hashing", "Linear Probing", "Re-hashing Array", 1, "Chaining begins with linked nodes and converts to Red-Black Trees if threshold exceeds 8.", "Collections", "Map", "Hard", "Amazon", "collections,hashmap,java8");
        addQ("Is `Vector` synchronized in Java?", "No", "Yes", "Only in multithread mode", "Deprecated", 2, "Legacy class `Vector` synchronizes individual operations.", "Collections", "List", "Easy", "TCS", "collections,vector");
        addQ("Which collection allows `null` keys in Java?", "Hashtable", "ConcurrentHashMap", "HashMap", "TreeMap", 3, "`HashMap` permits one `null` key.", "Collections", "Map", "Medium", "Zoho", "collections,hashmap,null");
        addQ("Which map implementation forbids BOTH `null` keys and `null` values?", "HashMap", "ConcurrentHashMap", "LinkedHashMap", "IdentityHashMap", 2, "Thread-safe collections like `ConcurrentHashMap` disallow nulls to prevent ambiguous states.", "Collections", "Map", "Hard", "Amazon", "collections,concurrenthashmap,null");
        addQ("Which method returns an unmodifiable view of a list?", "Collections.freeze()", "Collections.unmodifiableList()", "List.makeReadOnly()", "Collections.immutable()", 2, "`Collections.unmodifiableList()` wraps a list into a read-only decorator.", "Collections", "List", "Medium", "Freshworks", "collections,unmodifiable");
        addQ("What is time complexity of random read access `get(i)` in `ArrayList`?", "O(n)", "O(1)", "O(log n)", "O(n log n)", 2, "`ArrayList` uses arrays underneath, providing O(1) random index access.", "Collections", "List", "Easy", "TCS", "collections,arraylist,complexity");
        addQ("What is time complexity of search by value in unsorted `ArrayList`?", "O(1)", "O(n)", "O(log n)", "O(n^2)", 2, "Scanning through array sequentially takes linear time O(n).", "Collections", "List", "Easy", "Infosys", "collections,arraylist,search");
        addQ("Which interface should a class implement to define its NATURAL order?", "Comparator", "Comparable", "Serializable", "Iterable", 2, "Implementing `Comparable` defines natural sorting order via `compareTo()`.", "Collections", "Sorting", "Medium", "Wipro", "collections,comparable");
        addQ("Which interface allows defining custom sorting orders without modifying object class?", "Comparable", "Comparator", "Orderable", "Sortable", 2, "`Comparator` provides external sorting logic via `compare()`.", "Collections", "Sorting", "Medium", "Zoho", "collections,comparator");
        addQ("What is compile-time replacement of Generic types with actual bounds called?", "Type Invariance", "Type Erasure", "Type Casting", "Type Promotion", 2, "Java compiler enforces type check safety and erases generic parameters at byte compile time.", "Collections", "Generics", "Hard", "Amazon", "collections,generics,erasure");
        addQ("In Generics, `<? extends Number>` permits which types?", "Number and its superclasses", "Number and its subclasses", "Only Object class", "Any class", 2, "Upper-bounded wildcard restricts types to subclasses of Number.", "Collections", "Generics", "Medium", "Freshworks", "collections,generics,wildcard");
        addQ("In Generics, `<? super Integer>` permits which types?", "Integer and its subclasses", "Integer and its superclasses", "Double and Float", "Only Object", 2, "Lower-bounded wildcard accepts Integer and ancestor classes up to Object.", "Collections", "Generics", "Hard", "Amazon", "collections,generics,wildcard");
        addQ("Which queue implementation supports FIFO order backed by array?", "PriorityQueue", "ArrayDeque", "LinkedList", "Stack", 2, "`ArrayDeque` provides efficient resizable array-based double-ended queue operations.", "Collections", "Queue", "Medium", "TCS", "collections,arraydeque");
        addQ("PriorityQueue orders its elements according to:", "Insertion order", "Natural order or specified Comparator", "Random order", "LIFO order", 2, "PriorityQueue uses min-heap implementation based on element order.", "Collections", "Queue", "Medium", "Infosys", "collections,priorityqueue");
        addQ("Iterator method to safely remove current element during iteration is:", "list.remove()", "iterator.remove()", "Collections.delete()", "System.remove()", 2, "Invoking `iterator.remove()` avoids `ConcurrentModificationException`.", "Collections", "Collection Hierarchy", "Medium", "Wipro", "collections,iterator,remove");
        addQ("Which collection is designed for fast LIFO stack operations without legacy lock overhead?", "Stack", "ArrayDeque", "Vector", "LinkedList", 2, "`ArrayDeque` is recommended over legacy synchronized `Stack`.", "Collections", "Queue", "Medium", "Zoho", "collections,stack,arraydeque");

        // --- Concurrency ---
        addQ("Which method starts thread execution asynchronously?", "run()", "start()", "execute()", "init()", 2, "`start()` requests CPU thread allocation and invokes `run()` on a new execution stack.", "Concurrency", "Threads", "Easy", "TCS", "concurrency,thread,start");
        addQ("Which interface should be implemented to return a value from thread execution?", "Runnable", "Callable", "Thread", "Process", 2, "`Callable` method `call()` returns a result and can throw checked exceptions.", "Concurrency", "Threads", "Medium", "Infosys", "concurrency,callable");
        addQ("Which state does thread enter after calling `Thread.sleep()`?", "RUNNABLE", "TIMED_WAITING", "TERMINATED", "BLOCKED", 2, "Sleeping threads sit in `TIMED_WAITING` state.", "Concurrency", "Threads", "Medium", "Wipro", "concurrency,thread,states");
        addQ("What does `synchronized` keyword guarantee?", "Speed optimization", "Mutual Exclusion and Visibility", "Automatic Memory Cleanup", "Deadlock prevention", 2, "Synchronized blocks grant single-thread entry lock and memory synchronization.", "Concurrency", "Synchronized & Volatile", "Medium", "Amazon", "concurrency,synchronized");
        addQ("What does `volatile` keyword ensure?", "Atomicity", "Visibility across threads", "Immutable locking", "Garbage collection exemption", 2, "`volatile` forces thread variable writes directly to shared main memory.", "Concurrency", "Synchronized & Volatile", "Hard", "Amazon", "concurrency,volatile");
        addQ("Is `count++` atomic on volatile integer `volatile int count;`?", "Yes", "No", "Only on 64-bit JVMs", "Only in static contexts", 2, "`count++` consists of read-modify-write composite actions, making it non-atomic.", "Concurrency", "Atomic Operations", "Hard", "Zoho", "concurrency,atomic,volatile");
        addQ("Which atomic class provides thread-safe integer operations without explicit locking?", "VolatileInteger", "AtomicInteger", "SynchronizedInteger", "ThreadInteger", 2, "`AtomicInteger` uses CPU hardware CAS (Compare-And-Swap) instructions.", "Concurrency", "Atomic Operations", "Medium", "Freshworks", "concurrency,atomicinteger");
        addQ("What situation occurs when two threads wait indefinitely for locks held by each other?", "Race Condition", "Deadlock", "Starvation", "Livelock", 2, "Circular wait dependency causes deadlock.", "Concurrency", "Threads", "Easy", "TCS", "concurrency,deadlock");
        addQ("Which thread pool executor handles scheduled dynamic periodic tasks?", "FixedThreadPool", "ScheduledThreadPoolExecutor", "CachedThreadPool", "SingleThreadExecutor", 2, "Handles delayed or repetitive fixed-rate tasks.", "Concurrency", "Thread Pools", "Hard", "Amazon", "concurrency,threadpool,scheduled");
        addQ("What does `thread.join()` method do?", "Merges two threads into one", "Pauses calling thread until target thread completes", "Terminates target thread", "Interrupts target thread", 2, "`join()` forces parent thread to block until child thread finishes.", "Concurrency", "Threads", "Medium", "Wipro", "concurrency,thread,join");
        addQ("Thread local variables are isolated per:", "JVM process", "Thread instance", "Object instance", "ClassLoader", 2, "`ThreadLocal` holds independent attribute copies per active thread.", "Concurrency", "Threads", "Hard", "Amazon", "concurrency,threadlocal");
        addQ("Which concurrent collection uses fine-grained segment lock stripping in Java 7 and CAS tree buckets in Java 8+?", "Hashtable", "ConcurrentHashMap", "SynchronizedMap", "CopyOnWriteArrayMap", 2, "Optimizes lock contention through bucket level synchronization.", "Concurrency", "Synchronized & Volatile", "Hard", "Zoho", "concurrency,concurrenthashmap");
        addQ("Which interface provides lock operations with explicit tryLock timeout capabilities?", "Lock", "Monitor", "Semaphore", "Mutex", 1, "`java.util.concurrent.locks.Lock` allows flexible lock acquisitions.", "Concurrency", "Locks & Semaphores", "Hard", "Amazon", "concurrency,lock");
        addQ("Semaphore controls thread access using:", "Reentrant locks", "Permits count", "Thread IDs", "Priority queues", 2, "`Semaphore` manages a fixed set of execution permits.", "Concurrency", "Locks & Semaphores", "Medium", "Freshworks", "concurrency,semaphore");
        addQ("CountDownLatch vs CyclicBarrier difference:", "CountDownLatch cannot be reset; CyclicBarrier can be reused", "CyclicBarrier cannot be reset", "They are identical", "CountDownLatch is deprecated", 1, "CyclicBarrier resets after threads trip barrier.", "Concurrency", "Locks & Semaphores", "Hard", "Amazon", "concurrency,countdownlatch,cyclicbarrier");

        // --- JVM ---
        addQ("Which JVM region holds non-static class metadata in Java 8+?", "PermGen", "Metaspace", "Native Stack", "Heap", 2, "Java 8 replaced PermGen with native-memory Metaspace.", "JVM", "Metaspace", "Medium", "TCS", "jvm,metaspace");
        addQ("Where are object instances allocated in Java?", "Java Thread Stack", "Heap Memory", "Metaspace", "Program Counter", 2, "Objects reside in JVM Heap.", "JVM", "Heap", "Easy", "Infosys", "jvm,heap,objects");
        addQ("Where are local primitive variables stored inside a method?", "Heap Memory", "Thread Call Stack Frame", "Metaspace", "Shared Pool", 2, "Method local primitives reside within the current thread stack frame.", "JVM", "Heap", "Medium", "Wipro", "jvm,stack,primitives");
        addQ("What compiler converts Java bytecode into native machine code at runtime?", "javac", "JIT (Just-In-Time) Compiler", "AOT Compiler", "JVM Linker", 2, "JIT compiles hotspots into native instructions during execution.", "JVM", "Metaspace", "Easy", "Zoho", "jvm,jit");
        addQ("Eden, Survivor 0, and Survivor 1 belong to which heap generation?", "Old Generation", "Young Generation", "Metaspace", "Code Cache", 2, "Young generation comprises Eden and pair of Survivor spaces.", "JVM", "Garbage Collection", "Medium", "Amazon", "jvm,gc,younggeneration");
        addQ("Garbage collection in Old Generation heap is referred to as:", "Minor GC", "Major / Full GC", "Young GC", "Micro GC", 2, "Tenured space sweeps constitute Major/Full GC.", "JVM", "Garbage Collection", "Medium", "Amazon", "jvm,gc,major");
        addQ("Garbage Collector introduced as default in Java 9 is:", "Parallel GC", "G1 GC", "ZGC", "Serial GC", 2, "G1GC became default GC starting JDK 9.", "JVM", "Garbage Collection", "Medium", "TCS", "jvm,g1gc");
        addQ("Which JVM option sets initial heap size?", "-Xmx", "-Xms", "-XX:MetaspaceSize", "-Xss", 2, "`Xms` sets starting heap allocation size.", "JVM", "JVM Options", "Easy", "Freshworks", "jvm,options,xms");
        addQ("Which JVM option sets maximum heap size limit?", "-Xms", "-Xmx", "-Xss", "-XX:MaxMetaspaceSize", 2, "`Xmx` configures maximum heap allocation ceiling.", "JVM", "JVM Options", "Easy", "Infosys", "jvm,options,xmx");
        addQ("Which command line tool takes heap memory dump of running Java process?", "jps", "jmap", "jstack", "javap", 2, "`jmap` generates memory stats and heap dump files.", "JVM", "JVM Options", "Hard", "Amazon", "jvm,tools,jmap");

        // --- Modern Java ---
        addQ("Functional Interface contains how many abstract methods?", "Zero", "Exactly One", "Two", "Unlimited", 2, "Functional interfaces have single abstract method target.", "Modern Java", "Functional Interfaces", "Easy", "TCS", "java8,functionalinterface");
        addQ("Which annotation marks functional interfaces?", "@Functional", "@FunctionalInterface", "@Lambda", "@Interface", 2, "Signals compiler to enforce single abstract method constraint.", "Modern Java", "Functional Interfaces", "Easy", "Wipro", "java8,annotation");
        addQ("Stream terminal operation example:", "filter()", "map()", "collect()", "sorted()", 3, "`collect()` triggers stream processing and consumes results.", "Modern Java", "Streams", "Medium", "Infosys", "java8,streams,terminal");
        addQ("Optional class is mainly designed to prevent:", "ClassCastException", "NullPointerException", "OutOfMemoryError", "StackOverflowError", 2, "Encapsulate nullability explicitly.", "Modern Java", "Optional", "Easy", "Zoho", "java8,optional,npe");
        addQ("Immutable data carrier classes introduced in Java 14/16 are called:", "Sealed Classes", "Records", "Enums", "DTOs", 2, "Records auto-generate constructors, getters, equals, hashCode, and toString.", "Modern Java", "Records", "Medium", "Freshworks", "java14,records");
        addQ("Classes restricting which subclasses can extend them are:", "Final Classes", "Sealed Classes", "Abstract Classes", "Private Classes", 2, "Sealed classes explicitly permit specific child subclasses.", "Modern Java", "Sealed Classes", "Medium", "Amazon", "java17,sealedclasses");
        addQ("Lightweight threads introduced in Java 21 under Project Loom:", "Kernel Threads", "Virtual Threads", "Reactive Threads", "Fiber Threads", 2, "Virtual threads provide high throughput lightweight concurrency.", "Modern Java", "Virtual Threads", "Hard", "Amazon", "java21,virtualthreads,loom");
        addQ("Method reference operator syntax:", "->", "::", ".", "=>", 2, "Double colon `::` designates method references.", "Modern Java", "Functional Interfaces", "Easy", "TCS", "java8,methodreference");
        addQ("Stream method to transform each element into another object:", "filter()", "map()", "reduce()", "peek()", 2, "`map()` transforms stream elements using function mapping.", "Modern Java", "Streams", "Easy", "Infosys", "java8,streams,map");
        addQ("Which Stream method flattens nested streams `Stream<Stream<T>>` into single `Stream<T>`?", "map()", "flatMap()", "concat()", "collect()", 2, "`flatMap()` flattens multi-dimensional stream structures.", "Modern Java", "Streams", "Medium", "Zoho", "java8,streams,flatmap");

        // --- Spring & Spring Boot ---
        addQ("Default Spring bean scope is:", "Prototype", "Singleton", "Request", "Session", 2, "Spring IoC instantiates single bean instance per container context.", "Spring Boot", "Spring Core", "Easy", "TCS", "spring,beanscope,singleton");
        addQ("Annotation marking Spring REST controller class:", "@Controller", "@RestController", "@Service", "@Component", 2, "`@RestController` combines `@Controller` and `@ResponseBody`.", "Spring Boot", "REST API", "Easy", "Infosys", "spring,restcontroller");
        addQ("Annotation enabling automatic dependency injection in Spring:", "@Inject", "@Autowired", "@Bean", "Both A and B", 4, "Both `@Autowired` and JSR-330 `@Inject` handle dynamic spring wiring.", "Spring Boot", "Dependency Injection", "Medium", "Wipro", "spring,autowired,inject");
        addQ("Pattern providing single global instance point of access:", "Factory", "Singleton", "Builder", "Prototype", 2, "Singleton pattern guarantees single instance existence.", "Spring Boot", "Spring Core", "Easy", "Zoho", "patterns,singleton");
        addQ("Pattern constructing complex objects step by step using fluent interface:", "Factory", "Builder", "Adapter", "Decorator", 2, "Builder pattern decouples step by step object creation.", "Spring Boot", "Spring Core", "Medium", "Freshworks", "patterns,builder");

        // --- Cloned Repo Questions: SOLID & System Architecture ---
        addQ("According to Liskov Substitution Principle (LSP) in SOLID design, what should be possible in code?", "A class should have only one reason to change", "Software entities should be open for extension but closed for modification", "Subclasses should be substitutable for their base classes without altering correct behavior", "High-level modules should not depend on low-level modules", 3, "LSP states that subtypes must be substitutable for their base types without affecting program correctness.", "OOP", "Abstraction", "Medium", "Zoho", "solid,lsp,oop");
        addQ("According to the CAP Theorem, which three guarantees cannot be simultaneously satisfied by a distributed system?", "Consistency, Availability, Performance", "Consistency, Availability, Partition Tolerance", "Concurrency, Availability, Portability", "Cacheability, Availability, Process Isolation", 2, "The CAP Theorem states a distributed database can only satisfy two out of Consistency, Availability, and Partition Tolerance simultaneously.", "Spring Boot", "REST API", "Medium", "Amazon", "cap,distributed");
        addQ("In concurrent programming, what is a wait-free algorithm?", "An algorithm where all threads pause until one completes its operation", "An algorithm where every thread makes progress and completes in a bounded number of steps", "An algorithm that uses standard mutex locks to prevent resource conflicts", "An algorithm where a thread completes only if all other threads are inactive", 2, "Wait-freedom is the strongest non-blocking progress guarantee, ensuring every thread completes in a bounded number of steps.", "Concurrency", "Threads", "Hard", "Amazon", "concurrency,waitfree");
        addQ("In non-blocking algorithms, how does lock-freedom compare to obstruction-freedom?", "Lock-freedom guarantees global progress, whereas obstruction-freedom only guarantees progress if a single thread runs in isolation", "Obstruction-freedom requires locks, while lock-freedom does not", "Lock-freedom only guarantees progress if all other threads are suspended", "Both guarantee that every individual thread completes its operation in a bounded number of steps", 1, "Lock-freedom guarantees that at least one thread makes progress, while obstruction-freedom only guarantees progress if a thread runs without contention.", "Concurrency", "Threads", "Hard", "Amazon", "concurrency,lockfree");
        addQ("What is the primary purpose of Raft and Paxos protocols in distributed systems?", "To optimize SQL query performance via distributed indexing", "To achieve consensus on a single data value or state machine transitions among unreliable nodes", "To implement client-side load balancing", "To encrypt network traffic between services", 2, "Raft and Paxos are consensus algorithms used to agree on state transitions across distributed, replication nodes.", "Spring Boot", "REST API", "Hard", "Amazon", "distributed,consensus,raft,paxos");
        addQ("Which of the following is the most robust mechanism to prevent Cross-Site Request Forgery (CSRF) attacks?", "Using HTTPS encryption for all connections", "Validating requests using cryptographically secure unique anti-CSRF tokens", "Storing user sessions exclusively in localStorage", "Implementing complex password policies", 2, "Anti-CSRF tokens mapped to user sessions verify that requests originate from authorized user actions.", "Spring Boot", "REST API", "Medium", "Infosys", "security,csrf");
        addQ("In database caching, how does a write-behind (write-back) strategy differ from a write-through strategy?", "Write-behind writes to the database immediately and synchronously", "Write-behind writes to the cache first and asynchronously updates the database later", "Write-through completely avoids updating the database", "Write-behind writes directly to database, bypassing cache", 2, "Write-behind buffers updates in cache and syncs to DB asynchronously, improving performance at the cost of durability risk on crash.", "Spring Boot", "REST API", "Medium", "TCS", "cache,performance");
        addQ("Under the Java Memory Model, which of the following is TRUE regarding the 'happens-before' relationship?", "A write to a volatile variable happens-before every subsequent read of that same variable", "It is used to calculate the physical latency between CPU instructions", "A call to Thread.start() happens-before any actions in the started thread execute", "Both A and C are true", 4, "Under JMM, writes to volatile happen-before subsequent reads, and Thread.start() happens-before any action in the started thread.", "Concurrency", "Synchronized & Volatile", "Hard", "Amazon", "java,concurrency,happensbefore");
        addQ("How does JSON with Padding (JSONP) bypass the Same-Origin Policy compared to modern Cross-Origin Resource Sharing (CORS)?", "JSONP sends custom HTTP headers to declare permissions", "JSONP exploits the <script> tag loading capability which is exempt from same-origin restriction", "JSONP establishes a direct WebSocket tunnel", "JSONP uses encrypted cookies", 2, "JSONP bypasses Same-Origin Policy by dynamically injecting <script> tags, which can load scripts from any domain.", "Spring Boot", "REST API", "Medium", "Freshworks", "web,cors,jsonp");
        addQ("In SQL databases, which anomaly is prevented by the Repeatable Read isolation level that is present in Read Committed?", "Dirty Read", "Non-Repeatable Read (Fuzzy Read)", "Phantom Read", "Lost Update", 2, "Repeatable Read prevents non-repeatable reads by keeping shared locks on read rows until transaction completion.", "Spring Boot", "REST API", "Hard", "Zoho", "sql,transactions,isolation");
        addQ("Why does the thread contention problem occur in Java application development?", "When there are too few threads to process the queued tasks", "When multiple threads attempt to acquire the same synchronized monitor lock or access resource concurrently", "When virtual memory swap space is completely exhausted", "When the JVM heap size is too large", 2, "Contention is performance degradation that occurs when multiple threads wait to acquire the same lock or access shared resources.", "Concurrency", "Threads", "Medium", "TCS", "concurrency,contention");
        addQ("What is the key characteristic of a Canary Release deployment strategy?", "Routing all production traffic immediately to a completely identical standby environment", "Gradually rolling out changes to a small subset of users before deploying to the entire infrastructure", "Deploying to production only during off-peak hours", "Rebuilding the entire operating system stack with containerization", 2, "Canary releases slowly roll out features to a small portion of users to detect production issues early.", "Spring Boot", "REST API", "Medium", "Wipro", "devops,canary");
        addQ("In Java generics, what does the PECS (Producer Extends, Consumer Super) rule guide?", "Use ? super T if you need to read elements from a collection", "Use ? extends T when you only read from a collection; use ? super T when you only write to a collection", "Use ? extends T when you write elements into a collection", "Generics invariance rules during runtime serialization", 2, "PECS stands for Producer Extends, Consumer Super. Use extends to read, super to write/consume.", "Collections", "Generics", "Hard", "Wipro", "java,generics,pecs");
        addQ("According to Herlihy's Consensus Hierarchy, what is the consensus number of a standard atomic Compare-and-Swap (CAS) register?", "1", "2", "4", "Infinity (\u221E)", 4, "CAS registers have an infinite consensus number, meaning they can solve consensus for any number of asynchronous processes.", "Concurrency", "Atomic Operations", "Hard", "Amazon", "concurrency,cas,consensus");
        addQ("What security vulnerability is mainly mitigated by implementing a Content Security Policy (CSP) header in a web application?", "SQL Injection", "Cross-Site Scripting (XSS) and data injection attacks", "Distributed Denial of Service (DDoS)", "Brute Force attacks", 2, "CSP restricts where scripts and assets can be loaded from, greatly reducing the risk of malicious script execution (XSS).", "Spring Boot", "REST API", "Medium", "Freshworks", "security,csp,xss");
    }

    private void addQ(String question, String o1, String o2, String o3, String o4,
                      int correct, String explanation, String topic, String subtopic,
                      String difficulty, String company, String tags) {
        if (!quizRepository.existsByQuestion(question)) {
            QuizQuestion q = new QuizQuestion();
            q.setQuestion(question);
            q.setOption1(o1);
            q.setOption2(o2);
            q.setOption3(o3);
            q.setOption4(o4);
            q.setCorrectAnswer(correct);
            q.setExplanation(explanation);
            q.setTopic(topic);
            q.setSubtopic(subtopic);
            q.setDifficulty(difficulty);
            q.setCompany(company);
            q.setTags(tags);
            quizRepository.save(q);
        }
    }
}
