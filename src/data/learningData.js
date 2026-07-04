export const learningDataByGoal = {
  'java-developer': [
    {
      id: 'java-variables',
      title: 'Variables & Data Types',
      module: 'Java Fundamentals',
      difficulty: 'Beginner',
      duration: '2 hours',
      xp: 100,
      notes: [
        'Java is statically typed - every variable must be declared with a type',
        'Primitive types: int, double, boolean, char, byte, short, long, float',
        'Reference types: String, Arrays, Objects',
        'Example:\nint x = 10; // integer\ndouble pi = 3.14; // decimal\nboolean flag = true; // boolean\nString name = "Java"; // text'
      ],
      videos: [
        { title: 'Java Variables - Complete Guide', channel: 'Telusko', duration: '25 mins', url: '#' },
        { title: 'Data Types Explained', channel: 'CodeWithHarry', duration: '18 mins', url: '#' },
      ],
      questions: ['What is the default value of an int variable in Java?', 'Difference between int and Integer in Java?', 'What is type casting?'],
      assignments: ['Write a program to swap two numbers without temp variable', 'Calculate area of circle using double type'],
    },
    {
      id: 'java-loops',
      title: 'Control Flow & Loops',
      module: 'Java Fundamentals',
      difficulty: 'Beginner',
      duration: '2 hours',
      xp: 100,
      notes: [
        'Java has: if-else, switch, for, while, do-while, for-each',
        'Break exits the loop; continue skips to next iteration',
        'Nested loops for matrix traversal'
      ],
      videos: [
        { title: 'Loops in Java', channel: 'Apna College', duration: '22 mins', url: '#' },
      ],
      questions: ['When to use while vs do-while?', 'What is an infinite loop?'],
      assignments: ['Print patterns using nested loops', 'FizzBuzz problem'],
    },
    {
      id: 'java-arrays',
      title: 'Arrays & Strings',
      module: 'Java Fundamentals',
      difficulty: 'Beginner',
      duration: '3 hours',
      xp: 120,
      notes: [
        'Arrays store multiple values of same type in contiguous memory',
        'int[] arr = new int[5]; // 1D array',
        'int[][] matrix = new int[3][3]; // 2D array',
        'Arrays are zero-indexed in Java'
      ],
      videos: [
        { title: 'Arrays in Java - Complete Tutorial', channel: 'CodeWithHarry', duration: '30 mins', url: '#' },
      ],
      questions: ['What is an ArrayIndexOutOfBoundsException?', 'How to find the largest element in an array?', 'Difference between Array and ArrayList?'],
      assignments: ['Sort an array without using sort()', 'Find duplicate elements in an array'],
    },
    {
      id: 'java-oop-basics',
      title: 'OOP Concepts',
      module: 'OOP',
      difficulty: 'Intermediate',
      duration: '4 hours',
      xp: 150,
      notes: [
        'OOP has 4 pillars: Encapsulation, Inheritance, Polymorphism, Abstraction',
        'A class is a blueprint; an object is an instance of a class',
        'Encapsulation: Bundling data and methods, hiding implementation details'
      ],
      videos: [
        { title: 'OOP in Java - Full Course', channel: 'Apna College', duration: '45 mins', url: '#' },
        { title: 'Inheritance & Polymorphism', channel: 'Telusko', duration: '35 mins', url: '#' },
      ],
      questions: ['What is the difference between abstract class and interface?', 'Explain method overloading vs overriding', 'What is the use of super keyword?'],
      assignments: ['Create a Bank Account system using encapsulation', 'Implement animal hierarchy using inheritance'],
    }
  ],
  'python-developer': [
    {
      id: 'python-variables',
      title: 'Python Variables & Lists',
      module: 'Python Fundamentals',
      difficulty: 'Beginner',
      duration: '2 hours',
      xp: 100,
      notes: [
        'Python is dynamically typed - no need to declare variable type explicitly.',
        'Core types: int, float, str, bool, list, tuple, dict, set.',
        'Lists are mutable ordered sequences.',
        'Example:\nx = 10\npi = 3.14\nname = "Python"\nskills = ["Python", "Django"]'
      ],
      videos: [
        { title: 'Python Variables & Types', channel: 'Corey Schafer', duration: '20 mins', url: '#' },
      ],
      questions: ['What is the difference between list and tuple in Python?', 'How do you add elements to a list?'],
      assignments: ['Create a list of numbers and compute their average.', 'Swap two values in Python without using a third variable.'],
    },
    {
      id: 'python-loops',
      title: 'Control Flow & Comprehensions',
      module: 'Python Fundamentals',
      difficulty: 'Beginner',
      duration: '2 hours',
      xp: 100,
      notes: [
        'Python uses indentation to define code blocks.',
        'Supports if, elif, else, while, and for loops.',
        'List comprehensions offer a concise way to create lists.',
        'Example:\nsquares = [x**2 for x in range(10)]'
      ],
      videos: [
        { title: 'Python Loops & Indentation', channel: 'Programming with Mosh', duration: '15 mins', url: '#' },
      ],
      questions: ['What does list comprehension do?', 'How does break and continue work in Python?'],
      assignments: ['Write a list comprehension to filter odd numbers from a list.', 'Print numbers from 1 to 100 but replace multiples of 3 with Fizz.'],
    },
    {
      id: 'python-oop',
      title: 'Python Object-Oriented Programming',
      module: 'OOP',
      difficulty: 'Intermediate',
      duration: '4 hours',
      xp: 150,
      notes: [
        'Classes are defined using the class keyword.',
        'The constructor method is named __init__.',
        'The "self" parameter refers to the current instance of the class.'
      ],
      videos: [
        { title: 'Python OOP Tutorial', channel: 'Corey Schafer', duration: '40 mins', url: '#' },
      ],
      questions: ['What is __init__ in Python classes?', 'How does multiple inheritance work in Python?'],
      assignments: ['Create a Employee class with salary calculation.', 'Design a BankAccount class with deposit and withdraw methods.'],
    }
  ],
  'uiux-designer': [
    {
      id: 'uiux-intro',
      title: 'Introduction to Design Thinking',
      module: 'Design Fundamentals',
      difficulty: 'Beginner',
      duration: '2 hours',
      xp: 100,
      notes: [
        'Design thinking has 5 phases: Empathize, Define, Ideate, Prototype, Test.',
        'Focuses heavily on user-centered requirements.',
        'Visual hierarchy determines which elements the eye focuses on first.'
      ],
      videos: [
        { title: 'What is UX Design?', channel: 'CareerFoundry', duration: '15 mins', url: '#' },
      ],
      questions: ['What is the difference between UI and UX?', 'List the 5 phases of design thinking.'],
      assignments: ['Conduct user research for a food delivery app.', 'Draw a user journey map for booking a flight.'],
    },
    {
      id: 'uiux-typography',
      title: 'Typography & Color Theory',
      module: 'Design Fundamentals',
      difficulty: 'Beginner',
      duration: '3 hours',
      xp: 120,
      notes: [
        'Use colors dynamically using the 60-30-10 rule.',
        'Typography choices: Serif for traditional, Sans-serif for modern UI.',
        'High contrast guarantees accessibility (WCAG standards).'
      ],
      videos: [
        { title: 'Typography and Color Theory Tutorial', channel: 'Figma', duration: '22 mins', url: '#' },
      ],
      questions: ['What is the 60-30-10 color rule?', 'Why is color contrast important for accessibility?'],
      assignments: ['Create a harmonious color palette for an investment website.', 'Choose matching headings and body fonts for a news portal.'],
    },
    {
      id: 'uiux-figma',
      title: 'Figma & Auto Layout',
      module: 'Design Tools',
      difficulty: 'Intermediate',
      duration: '4 hours',
      xp: 150,
      notes: [
        'Auto Layout makes layers responsive dynamically.',
        'Components are reusable visual objects.',
        'Figma interactive components allow hover and active states animation.'
      ],
      videos: [
        { title: 'Figma Auto Layout Masterclass', channel: 'Flux Academy', duration: '30 mins', url: '#' },
      ],
      questions: ['How does Auto Layout speed up design processes?', 'What is an instance of a component?'],
      assignments: ['Design a responsive nav bar using Figma Auto Layout.', 'Build an interactive button component with hover and click animations.'],
    }
  ],
  'default': [
    {
      id: 'web-basics',
      title: 'Web Fundamentals & HTML',
      module: 'Web Development',
      difficulty: 'Beginner',
      duration: '2 hours',
      xp: 100,
      notes: [
        'HTML5 defines structural semantic content.',
        'CSS controls layout, margins, padding, and animations.',
        'JavaScript handles events and dynamic state changes.'
      ],
      videos: [
        { title: 'Web Development in 2026', channel: 'Traversy Media', duration: '20 mins', url: '#' },
      ],
      questions: ['What does semantic HTML mean?', 'What is the DOM in web applications?'],
      assignments: ['Write a valid semantic HTML landing page schema.', 'Align a grid box dynamically using CSS flexbox.'],
    },
    {
      id: 'database-basics',
      title: 'SQL & Database Basics',
      module: 'Data Systems',
      difficulty: 'Beginner',
      duration: '3 hours',
      xp: 120,
      notes: [
        'SQL is used to query relational database tables.',
        'Primary keys uniquely identify records.',
        'Joins combine data rows across multiple tables.'
      ],
      videos: [
        { title: 'SQL Course for Beginners', channel: 'Programming with Mosh', duration: '35 mins', url: '#' },
      ],
      questions: ['What is the difference between inner and outer joins?', 'What is a database index?'],
      assignments: ['Write a query to SELECT employees with salary > 50000.', 'Create a database schema for an orders tracking system.'],
    }
  ]
};
