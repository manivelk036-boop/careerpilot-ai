export const quizData = {
  'java-oop': {
    title: 'Java OOP Quiz',
    topic: 'Object Oriented Programming',
    timeLimit: 600,
    xp: 50,
    coins: 50,
    questions: [
      {
        id: 1, type: 'mcq',
        question: 'Which OOP concept allows a class to inherit properties from another class?',
        options: ['Encapsulation', 'Inheritance', 'Polymorphism', 'Abstraction'],
        correct: 1,
        explanation: 'Inheritance allows a class to inherit fields and methods from another class.'
      },
      {
        id: 2, type: 'mcq',
        question: 'What is the output of the following code?\n\nclass A {\n  void show() { System.out.print("A"); }\n}\nclass B extends A {\n  void show() { System.out.print("B"); }\n}\nA obj = new B();\nobj.show();',
        options: ['A', 'B', 'AB', 'Compilation Error'],
        correct: 1,
        explanation: 'This is runtime polymorphism. The actual object is of type B, so B\'s show() is called.'
      },
      {
        id: 3, type: 'mcq',
        question: 'Which keyword is used to prevent a class from being inherited in Java?',
        options: ['static', 'private', 'final', 'abstract'],
        correct: 2,
        explanation: 'The "final" keyword prevents a class from being subclassed.'
      },
      {
        id: 4, type: 'mcq',
        question: 'What is encapsulation in OOP?',
        options: [
          'The ability of a class to take many forms',
          'Hiding internal implementation details and exposing only necessary parts',
          'Creating objects from a class',
          'The process of one class inheriting another'
        ],
        correct: 1,
        explanation: 'Encapsulation bundles data and methods that operate on that data, restricting direct access.'
      },
      {
        id: 5, type: 'mcq',
        question: 'Which of these is NOT a valid access modifier in Java?',
        options: ['public', 'private', 'protected', 'internal'],
        correct: 3,
        explanation: 'Java has public, private, protected, and default (package-private). "internal" is a C# keyword.'
      },
      {
        id: 6, type: 'mcq',
        question: 'What is an abstract class in Java?',
        options: [
          'A class with all private methods',
          'A class that cannot be instantiated and may contain abstract methods',
          'A class with static methods only',
          'A class that implements all interfaces'
        ],
        correct: 1,
        explanation: 'An abstract class cannot be instantiated and may have abstract (unimplemented) methods.'
      },
      {
        id: 7, type: 'mcq',
        question: 'What is the difference between an interface and an abstract class?',
        options: [
          'Interfaces can have constructors, abstract classes cannot',
          'Abstract classes support multiple inheritance, interfaces do not',
          'Interfaces cannot have method implementations (pre Java 8), while abstract classes can',
          'There is no difference'
        ],
        correct: 2,
        explanation: 'Before Java 8, interfaces only had abstract methods. Abstract classes can have concrete methods.'
      },
      {
        id: 8, type: 'mcq',
        question: 'Which concept describes the ability of an object to take different forms?',
        options: ['Encapsulation', 'Abstraction', 'Inheritance', 'Polymorphism'],
        correct: 3,
        explanation: 'Polymorphism means "many forms" - the same method can behave differently based on the object.'
      },
      {
        id: 9, type: 'mcq',
        question: 'What is method overloading?',
        options: [
          'A method that overrides a parent class method',
          'Multiple methods with the same name but different parameters',
          'A method that is called multiple times',
          'Inheriting methods from multiple classes'
        ],
        correct: 1,
        explanation: 'Method overloading allows multiple methods with the same name but different parameter lists.'
      },
      {
        id: 10, type: 'mcq',
        question: 'In Java, what is the "super" keyword used for?',
        options: [
          'To create a new object',
          'To access parent class constructor/methods',
          'To define a static method',
          'To implement an interface'
        ],
        correct: 1,
        explanation: '"super" is used to call the parent class constructor or methods from the child class.'
      },
    ]
  },
  'java-collections': {
    title: 'Java Collections Quiz',
    topic: 'Collections Framework',
    timeLimit: 480,
    xp: 50,
    coins: 50,
    questions: [
      {
        id: 1, type: 'mcq',
        question: 'Which collection allows duplicate elements and maintains insertion order?',
        options: ['HashSet', 'TreeSet', 'ArrayList', 'HashMap'],
        correct: 2,
        explanation: 'ArrayList maintains insertion order and allows duplicate elements.'
      },
      {
        id: 2, type: 'mcq',
        question: 'What is the time complexity of HashMap get() operation?',
        options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'],
        correct: 2,
        explanation: 'HashMap provides O(1) average time complexity for get() operations using hashing.'
      },
      {
        id: 3, type: 'mcq',
        question: 'Which interface does ArrayList implement?',
        options: ['Set', 'Map', 'List', 'Queue'],
        correct: 2,
        explanation: 'ArrayList implements the List interface which extends Collection.'
      },
      {
        id: 4, type: 'mcq',
        question: 'Which collection maintains elements in sorted order automatically?',
        options: ['LinkedList', 'TreeSet', 'ArrayList', 'HashSet'],
        correct: 1,
        explanation: 'TreeSet maintains elements in natural sorted order using a Red-Black tree.'
      },
      {
        id: 5, type: 'mcq',
        question: 'What happens when you add a duplicate key to a HashMap?',
        options: [
          'An exception is thrown',
          'The old value is retained',
          'The new value overwrites the old value',
          'Both values are stored'
        ],
        correct: 2,
        explanation: 'In HashMap, if a duplicate key is added, the new value replaces the existing value for that key.'
      },
    ]
  },
  'python-basics': {
    title: 'Python Basics Quiz',
    topic: 'Python Syntax',
    timeLimit: 300,
    xp: 50,
    coins: 50,
    questions: [
      {
        id: 1, type: 'mcq',
        question: 'Which of the following is an immutable data type in Python?',
        options: ['Tuple', 'List', 'Dictionary', 'Set'],
        correct: 0,
        explanation: 'Tuples are immutable sequences, meaning their elements cannot be changed after creation.'
      },
      {
        id: 2, type: 'mcq',
        question: 'What is the output of print(2 ** 3) in Python?',
        options: ['6', '8', '9', '5'],
        correct: 1,
        explanation: 'The double asterisk (**) is the exponentiation operator in Python. 2 to the power of 3 is 8.'
      },
      {
        id: 3, type: 'mcq',
        question: 'Which built-in function gets the number of items in a list?',
        options: ['len()', 'length()', 'size()', 'count()'],
        correct: 0,
        explanation: 'The len() function returns the length (the number of items) of an object.'
      },
      {
        id: 4, type: 'mcq',
        question: 'How do you start a single-line comment in Python?',
        options: ['#', '//', '/*', '--'],
        correct: 0,
        explanation: 'Single-line comments in Python start with the hash character (#).'
      },
      {
        id: 5, type: 'mcq',
        question: 'What is the output of [x for x in range(3)]?',
        options: ['[1, 2, 3]', '[0, 1, 2]', '[0, 1, 2, 3]', '[1, 2]'],
        correct: 1,
        explanation: 'range(3) generates numbers from 0 up to (but not including) 3: 0, 1, and 2.'
      }
    ]
  },
  'python-oop': {
    title: 'Python OOP Quiz',
    topic: 'OOP Concepts',
    timeLimit: 300,
    xp: 75,
    coins: 75,
    questions: [
      {
        id: 1, type: 'mcq',
        question: 'How do you define a constructor in a Python class?',
        options: ['def __init__(self):', 'def constructor(self):', 'def __new__(self):', 'def init(self):'],
        correct: 0,
        explanation: 'The __init__ method is the class constructor that initializes new instances.'
      },
      {
        id: 2, type: 'mcq',
        question: 'Which syntax is used to inherit a class in Python?',
        options: ['class Child extends Parent:', 'class Child(Parent):', 'class Child implements Parent:', 'class Child inherits Parent:'],
        correct: 1,
        explanation: 'Inheritance is defined by putting the parent class name in parentheses after the child class name.'
      },
      {
        id: 3, type: 'mcq',
        question: 'What does "self" represent inside a Python class method?',
        options: ['The class object itself', 'The current instance of the class', 'A global variable container', 'The parent class instance'],
        correct: 1,
        explanation: '"self" represents the specific object instance that the method is being called on.'
      },
      {
        id: 4, type: 'mcq',
        question: 'What is a decorator in Python?',
        options: ['A UI styling widget', 'A function that wraps another function to modify its behavior', 'A class attribute modifier', 'A comment annotation'],
        correct: 1,
        explanation: 'Decorators are functions that dynamically modify the functionality of another function without changing its source code.'
      },
      {
        id: 5, type: 'mcq',
        question: 'How do you implement multiple inheritance in Python?',
        options: ['By separating parent classes with commas in parentheses', 'Python does not support multiple inheritance', 'Using the super() keyword repeatedly', 'By nested class definitions'],
        correct: 0,
        explanation: 'Python supports multiple inheritance by specifying multiple parent classes separated by commas, like class Child(Parent1, Parent2):'
      }
    ]
  },
  'uiux-principles': {
    title: 'UI/UX Principles Quiz',
    topic: 'UX Principles',
    timeLimit: 300,
    xp: 50,
    coins: 50,
    questions: [
      {
        id: 1, type: 'mcq',
        question: 'What is the primary objective of UX Design?',
        options: ['To make digital interfaces look visually appealing', 'To ensure products are usable, intuitive, and efficient for users', 'To write optimized front-end markup', 'To market the app to prospective customers'],
        correct: 1,
        explanation: 'User Experience (UX) focuses on user satisfaction and the overall utility and usability of a product.'
      },
      {
        id: 2, type: 'mcq',
        question: 'Which design concept refers to structuring elements to guide users to the most important content first?',
        options: ['Symmetrical Balance', 'Contrast Ratios', 'Visual Hierarchy', 'Grid Alignment'],
        correct: 2,
        explanation: 'Visual hierarchy uses size, color, and positioning to direct the user\'s attention logically.'
      },
      {
        id: 3, type: 'mcq',
        question: 'What is a User Persona in UX research?',
        options: ['A real customer profile database', 'A semi-fictional archetype representing a key group of target users', 'A customer service agent simulation', 'An anonymous tester account'],
        correct: 1,
        explanation: 'A user persona represents a user type, summarizing their goals, behaviors, and pain points based on research.'
      },
      {
        id: 4, type: 'mcq',
        question: 'What is the purpose of wireframing?',
        options: ['To compile high-fidelity graphics', 'To map the core structural layout of a page or interface screen', 'To write CSS stylesheets', 'To test app speed performance'],
        correct: 1,
        explanation: 'Wireframes are low-fidelity guides used to show the layout structure and functional placement on a screen.'
      },
      {
        id: 5, type: 'mcq',
        question: 'What is the 60-30-10 rule in UI design?',
        options: ['A text size ratio system', 'A color balance rule (60% dominant color, 30% secondary, 10% accent)', 'A button sizing template', 'A layout column division structure'],
        correct: 1,
        explanation: 'The 60-30-10 rule suggests using 60% of a dominant color, 30% of a secondary color, and 10% of an accent color to maintain harmony.'
      }
    ]
  },
  'uiux-figma': {
    title: 'Figma Auto Layout Quiz',
    topic: 'Design Tools',
    timeLimit: 300,
    xp: 75,
    coins: 75,
    questions: [
      {
        id: 1, type: 'mcq',
        question: 'What is the main benefit of Figma\'s "Auto Layout" feature?',
        options: ['Auto-saving components', 'Creating dynamic containers that resize automatically with content', 'Auto-generating color palettes', 'Converting vectors to SVG markup'],
        correct: 1,
        explanation: 'Auto layout makes designs responsive, automatically adjusting paddings, alignments, and spacings.'
      },
      {
        id: 2, type: 'mcq',
        question: 'In Figma, what is a Component?',
        options: ['A web framework element', 'A reusable design element with instances that sync changes', 'A design system plugin', 'A vector drawing node'],
        correct: 1,
        explanation: 'Components are elements you can reuse. Modifying the main component updates all instances.'
      },
      {
        id: 3, type: 'mcq',
        question: 'Which trigger is best for creating a button hover effect in Figma prototypes?',
        options: ['On click', 'While hovering', 'Key/gamepad', 'Mouse enter'],
        correct: 1,
        explanation: '"While hovering" is the built-in trigger designed specifically for button hover interactions.'
      },
      {
        id: 4, type: 'mcq',
        question: 'What is a Design System?',
        options: ['A collection of layout guides', 'A source of truth containing reusable styles and components', 'An IDE coding workspace', 'An app store guideline catalog'],
        correct: 1,
        explanation: 'A design system is a comprehensive standard detailing the branding, design patterns, and components of a product.'
      },
      {
        id: 5, type: 'mcq',
        question: 'How do you create an instance of a component in Figma?',
        options: ['Duplicate the main component frame', 'Copy-paste the vector node', 'Drag the component from the Assets panel', 'Use the import button'],
        correct: 2,
        explanation: 'Dragging a component from the Assets panel or duplicating a main component creates a linked instance.'
      }
    ]
  },
  'fullstack-basics': {
    title: 'Web Fundamentals Quiz',
    topic: 'HTML, CSS & JS',
    timeLimit: 300,
    xp: 50,
    coins: 50,
    questions: [
      {
        id: 1, type: 'mcq',
        question: 'What does HTML stand for?',
        options: ['Hyper Text Markup Language', 'High Tech Machine Language', 'Hyperlinks Text Markup Link', 'Home Tool Markup Language'],
        correct: 0,
        explanation: 'HTML stands for Hyper Text Markup Language, the standard code for structuring web pages.'
      },
      {
        id: 2, type: 'mcq',
        question: 'Which HTML tag is used to define the largest heading?',
        options: ['<h6>', '<head>', '<heading>', '<h1>'],
        correct: 3,
        explanation: '<h1> defines the most important and largest heading in HTML hierarchy.'
      },
      {
        id: 3, type: 'mcq',
        question: 'Which CSS property controls the size of text?',
        options: ['font-size', 'text-size', 'font-style', 'size'],
        correct: 0,
        explanation: 'The font-size CSS property sets the size of the font.'
      },
      {
        id: 4, type: 'mcq',
        question: 'Which database type is non-relational (NoSQL)?',
        options: ['MySQL', 'PostgreSQL', 'MongoDB', 'Oracle'],
        correct: 2,
        explanation: 'MongoDB is a document-oriented NoSQL database. The others are relational databases.'
      },
      {
        id: 5, type: 'mcq',
        question: 'What is Node.js?',
        options: ['A style framework', 'A JavaScript runtime built on Chrome\'s V8 engine', 'A client-side UI library', 'A relational database'],
        correct: 1,
        explanation: 'Node.js is a backend runtime environment that executes JavaScript outside a web browser.'
      }
    ]
  },
  'sql-basics': {
    title: 'SQL & Database Quiz',
    topic: 'Database Systems',
    timeLimit: 300,
    xp: 75,
    coins: 75,
    questions: [
      {
        id: 1, type: 'mcq',
        question: 'What does SQL stand for?',
        options: ['Structured Query Language', 'Simple Query Language', 'Standard Query Language', 'System Query Language'],
        correct: 0,
        explanation: 'SQL stands for Structured Query Language, the language used to communicate with databases.'
      },
      {
        id: 2, type: 'mcq',
        question: 'Which SQL statement retrieves data from a database?',
        options: ['GET', 'EXTRACT', 'SELECT', 'OPEN'],
        correct: 2,
        explanation: 'The SELECT statement is used to select and query data from a database table.'
      },
      {
        id: 3, type: 'mcq',
        question: 'Which SQL statement returns all columns from a table named "Customers"?',
        options: ['SELECT * FROM Customers', 'SELECT Customers', 'SELECT [all] FROM Customers', 'SELECT ALL Customers'],
        correct: 0,
        explanation: 'The asterisk (*) represents all columns in SQL.'
      },
      {
        id: 4, type: 'mcq',
        question: 'Which keyword filters SQL query records based on conditions?',
        options: ['GROUP BY', 'ORDER BY', 'HAVING', 'WHERE'],
        correct: 3,
        explanation: 'The WHERE clause is used to extract records that fulfill a specified condition.'
      },
      {
        id: 5, type: 'mcq',
        question: 'What is a Primary Key in a database?',
        options: ['A database password', 'A unique identifier for each row/record in a table', 'A key linking to another table', 'A master database control key'],
        correct: 1,
        explanation: 'A primary key uniquely identifies each record in a database table. It must contain unique, non-null values.'
      }
    ]
  },
  'aptitude-quant': {
    title: 'Quantitative Aptitude',
    topic: 'Quantitative',
    timeLimit: 1800,
    xp: 75,
    coins: 75,
    questions: [
      {
        id: 1, type: 'mcq',
        question: 'A train 150m long is running at 60 km/h. In how much time will it pass a pole?',
        options: ['9 seconds', '9.5 seconds', '10 seconds', '8 seconds'],
        correct: 0,
        explanation: 'Speed = 60 km/h = 60×1000/3600 = 50/3 m/s. Time = 150 ÷ (50/3) = 9 seconds.'
      },
      {
        id: 2, type: 'mcq',
        question: 'If 20% of a number is 80, what is 25% of that number?',
        options: ['90', '95', '100', '105'],
        correct: 2,
        explanation: '20% = 80, so the number = 400. 25% of 400 = 100.'
      },
      {
        id: 3, type: 'mcq',
        question: 'A shopkeeper marks his goods 30% above cost price and gives 10% discount. What is the profit %?',
        options: ['17%', '18%', '19%', '20%'],
        correct: 0,
        explanation: 'Let CP = 100. MP = 130. SP = 130 × 0.9 = 117. Profit = 17%.'
      },
      {
        id: 4, type: 'mcq',
        question: 'Simple interest on a sum at 5% per annum for 3 years is ₹3600. Find the principal.',
        options: ['₹20,000', '₹22,000', '₹24,000', '₹18,000'],
        correct: 2,
        explanation: 'SI = P×R×T/100. 3600 = P×5×3/100. P = 3600×100/15 = ₹24,000.'
      },
      {
        id: 5, type: 'mcq',
        question: 'The ratio of two numbers is 3:5. If each is increased by 10, the ratio becomes 5:7. Find the numbers.',
        options: ['15 and 25', '12 and 20', '18 and 30', '21 and 35'],
        correct: 0,
        explanation: '3x and 5x. (3x+10)/(5x+10) = 5/7. 21x+70 = 25x+50. 4x=20. x=5. Numbers: 15 and 25.'
      },
    ]
  },
  'java-variables': {
    title: 'Variables & Data Types Quiz',
    topic: 'Java Fundamentals',
    timeLimit: 300,
    xp: 50,
    coins: 50,
    questions: [
      {
        id: 1, type: 'mcq',
        question: 'Which of the following is NOT a valid primitive data type in Java?',
        options: ['byte', 'short', 'string', 'double'],
        correct: 2,
        explanation: 'In Java, the primitive type is lowercase "char" or "boolean", and there is no primitive "string" (only the String class).'
      },
      {
        id: 2, type: 'mcq',
        question: 'What is the default value of a boolean instance variable in Java?',
        options: ['true', 'false', 'null', '0'],
        correct: 1,
        explanation: 'The default value for boolean variables is false.'
      },
      {
        id: 3, type: 'mcq',
        question: 'Which data type is used to store fractional numbers from 3.4e−038 to 3.4e+038?',
        options: ['int', 'float', 'long', 'short'],
        correct: 1,
        explanation: 'The float data type is a single-precision 32-bit IEEE 754 floating point.'
      }
    ]
  },
  'java-loops': {
    title: 'Control Flow & Loops Quiz',
    topic: 'Java Loops',
    timeLimit: 300,
    xp: 50,
    coins: 50,
    questions: [
      {
        id: 1, type: 'mcq',
        question: 'Which loop is guaranteed to execute at least once in Java?',
        options: ['for', 'while', 'do-while', 'for-each'],
        correct: 2,
        explanation: 'A do-while loop executes the block first, then evaluates the test condition.'
      },
      {
        id: 2, type: 'mcq',
        question: 'What does the "break" statement do in a loop?',
        options: ['Skips the current iteration', 'Terminates the loop immediately', 'Restarts the loop', 'Exits the entire program'],
        correct: 1,
        explanation: '"break" exits the innermost loop or switch statement immediately.'
      }
    ]
  },
  'java-arrays': {
    title: 'Arrays & Strings Quiz',
    topic: 'Java Arrays',
    timeLimit: 300,
    xp: 50,
    coins: 50,
    questions: [
      {
        id: 1, type: 'mcq',
        question: 'What is the array index of the first element in Java?',
        options: ['0', '1', '-1', 'Any integer'],
        correct: 0,
        explanation: 'Arrays in Java are zero-indexed, meaning the first element is at index 0.'
      },
      {
        id: 2, type: 'mcq',
        question: 'How do you find the length of an array "arr" in Java?',
        options: ['arr.length()', 'arr.length', 'arr.size()', 'arr.getSize()'],
        correct: 1,
        explanation: 'In Java, arrays have a final instance variable called "length" (no parentheses).'
      }
    ]
  },
  'java-oop-basics': {
    title: 'OOP Concepts Quiz',
    topic: 'OOP Pillars',
    timeLimit: 300,
    xp: 50,
    coins: 50,
    questions: [
      {
        id: 1, type: 'mcq',
        question: 'Which keyword is used to establish inheritance between classes in Java?',
        options: ['implements', 'extends', 'inherits', 'super'],
        correct: 1,
        explanation: 'The "extends" keyword is used to inherit a class in Java.'
      },
      {
        id: 2, type: 'mcq',
        question: 'What is method overriding?',
        options: [
          'Defining a method with same name but different parameters in same class',
          'Defining a method with same name and parameters in subclass as in superclass',
          'Overloading a method in interface',
          'Calling parent constructor'
        ],
        correct: 1,
        explanation: 'Method overriding happens when a subclass provides a specific implementation of a method declared in its superclass.'
      }
    ]
  },
  'python-variables': {
    title: 'Python Variables & Lists Quiz',
    topic: 'Python Basics',
    timeLimit: 300,
    xp: 50,
    coins: 50,
    questions: [
      {
        id: 1, type: 'mcq',
        question: 'Which of the following creates a list in Python?',
        options: ['x = (1, 2)', 'x = [1, 2]', 'x = {1, 2}', 'x = "1, 2"'],
        correct: 1,
        explanation: 'Square brackets [] are used to define list literals in Python.'
      },
      {
        id: 2, type: 'mcq',
        question: 'Are lists in Python mutable or immutable?',
        options: ['Mutable', 'Immutable', 'Depends on contents', 'Neither'],
        correct: 0,
        explanation: 'Lists are mutable, meaning you can modify their elements after creation.'
      }
    ]
  },
  'python-loops': {
    title: 'Control Flow & Loops Quiz',
    topic: 'Python Loops',
    timeLimit: 300,
    xp: 50,
    coins: 50,
    questions: [
      {
        id: 1, type: 'mcq',
        question: 'How is a code block defined in Python control flow?',
        options: ['Curly braces {}', 'Keywords begin/end', 'Indentation', 'Parentheses ()'],
        correct: 2,
        explanation: 'Python uses whitespace indentation to define scope and code blocks.'
      },
      {
        id: 2, type: 'mcq',
        question: 'What does "continue" do in a Python loop?',
        options: ['Exits the loop', 'Skips to the next iteration of the loop', 'Pauses the execution', 'Restarts the computer'],
        correct: 1,
        explanation: 'The continue statement rejects all remaining statements in the current iteration and moves flow to the next iteration.'
      }
    ]
  },
  'uiux-intro': {
    title: 'Design Thinking Quiz',
    topic: 'Design Basics',
    timeLimit: 300,
    xp: 50,
    coins: 50,
    questions: [
      {
        id: 1, type: 'mcq',
        question: 'What is the first step in the 5-phase Design Thinking process?',
        options: ['Ideate', 'Define', 'Empathize', 'Prototype'],
        correct: 2,
        explanation: 'Empathize is the first stage, focused on researching user needs to understand their challenges.'
      },
      {
        id: 2, type: 'mcq',
        question: 'What does user-centric design prioritize?',
        options: ['Developer convenience', 'User needs and experiences', 'Aesthetics only', 'Fast coding time'],
        correct: 1,
        explanation: 'User-centered design places user goals and satisfaction at the core of all design decisions.'
      }
    ]
  },
  'uiux-typography': {
    title: 'Typography & Color Theory Quiz',
    topic: 'Design Aesthetics',
    timeLimit: 300,
    xp: 50,
    coins: 50,
    questions: [
      {
        id: 1, type: 'mcq',
        question: 'Which type of font is characterized by small decorative strokes at the ends of characters?',
        options: ['Sans-serif', 'Serif', 'Monospace', 'Display'],
        correct: 1,
        explanation: 'Serif fonts have structural details (serifs) at the ends of strokes.'
      },
      {
        id: 2, type: 'mcq',
        question: 'What is color contrast critical for?',
        options: ['File size reduction', 'Visual Accessibility', 'Page loading speed', 'Auto layout constraint setting'],
        correct: 1,
        explanation: 'Sufficient color contrast is essential for legibility, especially for visually impaired users.'
      }
    ]
  },
  'web-basics': {
    title: 'Web Fundamentals Quiz',
    topic: 'HTML & CSS',
    timeLimit: 300,
    xp: 50,
    coins: 50,
    questions: [
      {
        id: 1, type: 'mcq',
        question: 'Which tag is used to create a hyperlink in HTML?',
        options: ['<link>', '<a>', '<href>', '<url>'],
        correct: 1,
        explanation: 'The <a> (anchor) tag is used to define hyperlinks.'
      },
      {
        id: 2, type: 'mcq',
        question: 'What does CSS stand for?',
        options: ['Computer Style Sheets', 'Creative Style Sheets', 'Cascading Style Sheets', 'Colorful Style Sheets'],
        correct: 2,
        explanation: 'CSS stands for Cascading Style Sheets, used to style document presentation.'
      }
    ]
  },
  'database-basics': {
    title: 'SQL & Database Basics Quiz',
    topic: 'Database Queries',
    timeLimit: 300,
    xp: 50,
    coins: 50,
    questions: [
      {
        id: 1, type: 'mcq',
        question: 'Which SQL statement is used to insert new data into a database?',
        options: ['ADD RECORD', 'INSERT INTO', 'UPDATE', 'SAVE AS'],
        correct: 1,
        explanation: 'The INSERT INTO statement is used to insert new records in a table.'
      },
      {
        id: 2, type: 'mcq',
        question: 'Which keyword is used to retrieve unique values in SQL?',
        options: ['UNIQUE', 'DIFFERENT', 'DISTINCT', 'ONLY'],
        correct: 2,
        explanation: 'SELECT DISTINCT is used to return only distinct (different) values.'
      }
    ]
  }
};

export const quizListByGoal = {
  'java-developer': [
    { id: 'java-oop', title: 'Java OOP Quiz', topic: 'OOP Concepts', difficulty: 'Intermediate', xp: 50, coins: 50, icon: '☕', questions: 10 },
    { id: 'java-collections', title: 'Java Collections', topic: 'Collections Framework', difficulty: 'Intermediate', xp: 50, coins: 50, icon: '📚', questions: 5 },
    { id: 'aptitude-quant', title: 'Quantitative Aptitude', topic: 'Mathematics', difficulty: 'Easy', xp: 75, coins: 75, icon: '🔢', questions: 5 },
  ],
  'python-developer': [
    { id: 'python-basics', title: 'Python Basics Quiz', topic: 'Python Syntax', difficulty: 'Easy', xp: 50, coins: 50, icon: '🐍', questions: 5 },
    { id: 'python-oop', title: 'Python OOP Quiz', topic: 'OOP Concepts', difficulty: 'Intermediate', xp: 75, coins: 75, icon: '⚡', questions: 5 },
    { id: 'aptitude-quant', title: 'Quantitative Aptitude', topic: 'Mathematics', difficulty: 'Easy', xp: 75, coins: 75, icon: '🔢', questions: 5 },
  ],
  'uiux-designer': [
    { id: 'uiux-principles', title: 'UI/UX Principles Quiz', topic: 'UX Principles', difficulty: 'Easy', xp: 50, coins: 50, icon: '🎨', questions: 5 },
    { id: 'uiux-figma', title: 'Figma Auto Layout Quiz', topic: 'Design Tools', difficulty: 'Intermediate', xp: 75, coins: 75, icon: '📐', questions: 5 },
    { id: 'aptitude-quant', title: 'Quantitative Aptitude', topic: 'Mathematics', difficulty: 'Easy', xp: 75, coins: 75, icon: '🔢', questions: 5 },
  ],
  'default': [
    { id: 'fullstack-basics', title: 'Web Fundamentals Quiz', topic: 'HTML, CSS & JS', difficulty: 'Easy', xp: 50, coins: 50, icon: '🌐', questions: 5 },
    { id: 'sql-basics', title: 'SQL & Database Quiz', topic: 'Database Systems', difficulty: 'Intermediate', xp: 75, coins: 75, icon: '💾', questions: 5 },
    { id: 'aptitude-quant', title: 'Quantitative Aptitude', topic: 'Mathematics', difficulty: 'Easy', xp: 75, coins: 75, icon: '🔢', questions: 5 },
  ]
};

export const aptitudeCategories = [
  { id: 'quant', title: 'Quantitative Aptitude', icon: '🔢', questions: 25, duration: '30 mins', color: 'from-blue-500 to-cyan-500' },
  { id: 'logical', title: 'Logical Reasoning', icon: '🧩', questions: 20, duration: '25 mins', color: 'from-purple-500 to-violet-600' },
  { id: 'verbal', title: 'Verbal Ability', icon: '📝', questions: 20, duration: '25 mins', color: 'from-green-500 to-emerald-600' },
];
