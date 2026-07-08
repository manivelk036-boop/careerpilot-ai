// Goal-based, topic-wise learning content
export const contentByGoal = {
  'java-developer': [
    {
      id: 'java-variables',
      title: 'Variables & Data Types',
      icon: '📦',
      duration: '45 min',
      notes: `# Java Variables & Data Types

## What is a Variable?
A variable is a named memory location that stores data.

## Primitive Types
- **int** — whole numbers (-2B to 2B)
- **double** — decimal numbers
- **char** — single character ('A')
- **boolean** — true / false
- **long** — large whole numbers
- **float** — small decimal numbers

## Declaring Variables
\`\`\`java
int age = 20;
double gpa = 8.5;
String name = "Arjun"; // String is a class, not primitive
boolean isPlaced = false;
\`\`\`

## Type Casting
\`\`\`java
int x = 10;
double y = (double) x; // explicit cast
\`\`\`

## Key Rules
- Variable names are case-sensitive
- Start with letter, _ or $
- Cannot use reserved keywords
`,
      videoUrl: 'https://www.youtube.com/embed/eIrMbAQSU34',
      practiceQuestions: [
        { q: 'Declare an int variable called score with value 95', hint: 'int score = 95;' },
        { q: 'Declare a double variable for CGPA with value 8.5', hint: 'double cgpa = 8.5;' },
        { q: 'Cast a double 9.7 to int — what is the result?', hint: '9 (decimal truncated)' },
      ],
      assignment: 'Write a Java program that declares variables for your name, age, CGPA, and department. Print all of them using System.out.println.',
    },
    {
      id: 'java-loops',
      title: 'Control Flow & Loops',
      icon: '🔄',
      duration: '60 min',
      notes: `# Control Flow & Loops

## if-else
\`\`\`java
if (score >= 90) {
  System.out.println("A Grade");
} else if (score >= 75) {
  System.out.println("B Grade");
} else {
  System.out.println("C Grade");
}
\`\`\`

## for loop
\`\`\`java
for (int i = 1; i <= 5; i++) {
  System.out.println(i);
}
\`\`\`

## while loop
\`\`\`java
int i = 1;
while (i <= 10) {
  System.out.println(i);
  i++;
}
\`\`\`

## do-while loop
\`\`\`java
do {
  System.out.println("runs at least once");
} while (false);
\`\`\`

## Enhanced for (for-each)
\`\`\`java
int[] arr = {1, 2, 3, 4, 5};
for (int num : arr) {
  System.out.println(num);
}
\`\`\`
`,
      videoUrl: 'https://www.youtube.com/embed/a3_7LcNHmsc',
      practiceQuestions: [
        { q: 'Write a for loop that prints numbers 1 to 10', hint: 'for(int i=1;i<=10;i++) System.out.println(i);' },
        { q: 'Write a while loop that prints even numbers from 2 to 20', hint: 'while(i<=20){ if(i%2==0) print(i); i++; }' },
        { q: 'What is the difference between break and continue?', hint: 'break exits loop; continue skips current iteration' },
      ],
      assignment: 'Write a program to print the multiplication table of any number entered by the user using a for loop.',
    },
    {
      id: 'java-oop',
      title: 'OOP Concepts',
      icon: '🧱',
      duration: '90 min',
      notes: `# Object-Oriented Programming

## Class and Object
\`\`\`java
class Student {
  String name;
  int age;
  
  void study() {
    System.out.println(name + " is studying");
  }
}

Student s = new Student();
s.name = "Arjun";
s.study();
\`\`\`

## Inheritance
\`\`\`java
class Animal {
  void speak() { System.out.println("..."); }
}
class Dog extends Animal {
  void speak() { System.out.println("Woof!"); }
}
\`\`\`

## Encapsulation
- Private fields + public getters/setters

## Polymorphism
- Same method, different behavior based on object type

## Abstraction
- Abstract classes and Interfaces
`,
      videoUrl: 'https://www.youtube.com/embed/7GwptabrYyk',
      practiceQuestions: [
        { q: 'Create a class Car with brand, speed fields and a drive() method', hint: 'class Car { String brand; int speed; void drive(){...} }' },
        { q: 'What is the difference between abstract class and interface?', hint: 'Abstract class can have concrete methods; interface (pre-Java8) only abstract methods' },
        { q: 'Demonstrate method overriding with a simple example', hint: 'Parent class method is overridden in child class with @Override' },
      ],
      assignment: 'Design a banking system with classes: Account, SavingsAccount (extends Account), with deposit and withdraw methods.',
    },
    {
      id: 'java-collections',
      title: 'Collections Framework',
      icon: '📚',
      duration: '75 min',
      notes: `# Java Collections Framework

## ArrayList
\`\`\`java
List<String> list = new ArrayList<>();
list.add("Java");
list.add("Python");
System.out.println(list.get(0)); // Java
\`\`\`

## HashMap
\`\`\`java
Map<String, Integer> map = new HashMap<>();
map.put("Alice", 90);
map.put("Bob", 85);
System.out.println(map.get("Alice")); // 90
\`\`\`

## HashSet
\`\`\`java
Set<Integer> set = new HashSet<>();
set.add(1); set.add(2); set.add(1); // duplicates ignored
System.out.println(set.size()); // 2
\`\`\`

## Iterating
\`\`\`java
for (Map.Entry<String, Integer> entry : map.entrySet()) {
  System.out.println(entry.getKey() + " -> " + entry.getValue());
}
\`\`\`
`,
      videoUrl: 'https://www.youtube.com/embed/GdAon80-0KA',
      practiceQuestions: [
        { q: 'Create an ArrayList and add 5 student names, then remove the 3rd one', hint: 'list.remove(2) removes index 2' },
        { q: 'Use HashMap to store student name → marks and print the highest scorer', hint: 'Iterate entries and track max value' },
        { q: 'What is the difference between ArrayList and LinkedList?', hint: 'ArrayList: fast random access; LinkedList: fast insertion/deletion' },
      ],
      assignment: 'Build a student grade tracker using HashMap<String, List<Integer>> where each student has multiple subject scores.',
    },
    {
      id: 'java-sql',
      title: 'SQL Basics',
      icon: '🗄️',
      duration: '60 min',
      notes: `# SQL for Java Developers

## Core Commands
\`\`\`sql
-- Create table
CREATE TABLE students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  cgpa DECIMAL(3,2)
);

-- Insert
INSERT INTO students (name, cgpa) VALUES ('Arjun', 8.5);

-- Select
SELECT * FROM students WHERE cgpa > 8.0 ORDER BY cgpa DESC;

-- Update
UPDATE students SET cgpa = 9.0 WHERE name = 'Arjun';

-- Delete
DELETE FROM students WHERE id = 1;
\`\`\`

## Joins
\`\`\`sql
SELECT s.name, c.course_name
FROM students s
INNER JOIN enrollments e ON s.id = e.student_id
INNER JOIN courses c ON e.course_id = c.id;
\`\`\`
`,
      videoUrl: 'https://www.youtube.com/embed/HXV3zeQKqGY',
      practiceQuestions: [
        { q: 'Write SQL to find all students with CGPA above 8.0', hint: 'SELECT * FROM students WHERE cgpa > 8.0' },
        { q: 'Write a JOIN query to get student names with their course names', hint: 'INNER JOIN between students and courses table' },
        { q: 'What is the difference between WHERE and HAVING?', hint: 'WHERE filters rows; HAVING filters groups after GROUP BY' },
      ],
      assignment: 'Design a database for a college library: Books table, Members table, and Borrowing history table. Write 5 SQL queries.',
    },
  ],

  'data-analyst': [
    {
      id: 'da-python',
      title: 'Python for Data Analysis',
      icon: '🐍',
      duration: '60 min',
      notes: `# Python for Data Analysis

## NumPy Basics
\`\`\`python
import numpy as np
arr = np.array([1, 2, 3, 4, 5])
print(arr.mean())  # 3.0
print(arr.std())   # 1.41
\`\`\`

## Pandas Basics
\`\`\`python
import pandas as pd
df = pd.read_csv('data.csv')
df.head()          # first 5 rows
df.describe()      # statistics
df.info()          # column types
df.isnull().sum()  # missing values
\`\`\`

## Data Cleaning
\`\`\`python
df.dropna()        # remove missing rows
df.fillna(0)       # fill with 0
df['col'].str.strip()  # remove spaces
\`\`\`
`,
      videoUrl: 'https://www.youtube.com/embed/r-uOLxNrNk8',
      practiceQuestions: [
        { q: 'Load a CSV file and print the first 5 rows', hint: 'pd.read_csv("file.csv").head()' },
        { q: 'Find columns with missing values', hint: 'df.isnull().sum()' },
        { q: 'Calculate mean and median of a column', hint: 'df["col"].mean(), df["col"].median()' },
      ],
      assignment: 'Load the Titanic dataset, clean missing values, and produce a summary of survival rates by passenger class.',
    },
    {
      id: 'da-sql',
      title: 'SQL for Data Analysis',
      icon: '🗄️',
      duration: '75 min',
      notes: `# SQL for Data Analysts

## Aggregations
\`\`\`sql
SELECT department, COUNT(*) as total, AVG(salary) as avg_salary
FROM employees
GROUP BY department
HAVING AVG(salary) > 50000
ORDER BY avg_salary DESC;
\`\`\`

## Window Functions
\`\`\`sql
SELECT name, salary,
  RANK() OVER (PARTITION BY dept ORDER BY salary DESC) as rank
FROM employees;
\`\`\`

## Subqueries
\`\`\`sql
SELECT name FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
\`\`\`
`,
      videoUrl: 'https://www.youtube.com/embed/7S_tz1z_5bA',
      practiceQuestions: [
        { q: 'Find the top 3 highest earning employees per department', hint: 'Use RANK() OVER (PARTITION BY dept ORDER BY salary DESC)' },
        { q: 'Write a query to find month-wise sales totals', hint: 'GROUP BY MONTH(date), SUM(amount)' },
        { q: 'What is a CTE (Common Table Expression)?', hint: 'WITH cte AS (SELECT ...) SELECT * FROM cte' },
      ],
      assignment: 'Given a sales database, write 5 analytical queries: monthly trends, top products, regional comparison, customer segments, YoY growth.',
    },
    {
      id: 'da-visualization',
      title: 'Data Visualization',
      icon: '📊',
      duration: '60 min',
      notes: `# Data Visualization with Python

## Matplotlib
\`\`\`python
import matplotlib.pyplot as plt
plt.plot([1,2,3], [4,5,6])
plt.title('My Chart')
plt.xlabel('X')
plt.ylabel('Y')
plt.show()
\`\`\`

## Seaborn
\`\`\`python
import seaborn as sns
sns.heatmap(df.corr(), annot=True)
sns.boxplot(x='category', y='value', data=df)
\`\`\`

## Chart Types
- **Bar chart** — comparisons
- **Line chart** — trends over time
- **Scatter plot** — correlation
- **Heatmap** — correlation matrix
- **Box plot** — distribution + outliers
`,
      videoUrl: 'https://www.youtube.com/embed/UO98lJQ3QGI',
      practiceQuestions: [
        { q: 'Create a bar chart of top 5 countries by population', hint: 'plt.bar(countries, populations)' },
        { q: 'Create a heatmap showing correlation of numeric columns', hint: 'sns.heatmap(df.corr(), annot=True)' },
        { q: 'When would you use a box plot vs histogram?', hint: 'Box plot: outliers & quartiles; Histogram: frequency distribution' },
      ],
      assignment: 'Create a complete EDA (Exploratory Data Analysis) notebook on a dataset of your choice with at least 5 different chart types.',
    },
  ],

  'ai-engineer': [
    {
      id: 'ai-python',
      title: 'Python & Math for AI',
      icon: '🔢',
      duration: '90 min',
      notes: `# Python & Mathematics for AI

## Linear Algebra Essentials
- Vectors, Matrices, Dot products
- Matrix multiplication → core of neural networks

\`\`\`python
import numpy as np
A = np.array([[1,2],[3,4]])
B = np.array([[5,6],[7,8]])
print(np.dot(A, B)) # Matrix multiplication
\`\`\`

## Calculus Concepts
- Derivatives → gradient descent
- Partial derivatives → backpropagation

## Probability
\`\`\`python
import numpy as np
# Normal distribution
samples = np.random.normal(mean=0, std=1, size=1000)
\`\`\`
`,
      videoUrl: 'https://www.youtube.com/embed/aircAruvnKk',
      practiceQuestions: [
        { q: 'Compute dot product of [1,2,3] and [4,5,6]', hint: 'np.dot([1,2,3],[4,5,6]) = 32' },
        { q: 'What is a gradient and why is it important in ML?', hint: 'Gradient = direction of steepest ascent; used in gradient descent to minimize loss' },
        { q: 'Explain the difference between mean and median', hint: 'Mean: average; Median: middle value; Median is robust to outliers' },
      ],
      assignment: 'Implement gradient descent from scratch in Python to minimize f(x) = x² and find the minimum.',
    },
    {
      id: 'ai-ml',
      title: 'Machine Learning Fundamentals',
      icon: '🤖',
      duration: '120 min',
      notes: `# Machine Learning Fundamentals

## Types of ML
- **Supervised** — labeled data (regression, classification)
- **Unsupervised** — unlabeled data (clustering)
- **Reinforcement** — reward-based learning

## Scikit-learn
\`\`\`python
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
model = LinearRegression()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
\`\`\`

## Model Evaluation
- **Accuracy** — for classification
- **MSE/RMSE** — for regression
- **Confusion Matrix** — TP, TN, FP, FN
- **Cross-validation** — prevent overfitting
`,
      videoUrl: 'https://www.youtube.com/embed/Gv9_4yMHFhI',
      practiceQuestions: [
        { q: 'What is overfitting and how do you prevent it?', hint: 'Model memorizes training data; prevent with regularization, dropout, cross-validation' },
        { q: 'Explain the bias-variance tradeoff', hint: 'High bias = underfitting; High variance = overfitting; Goal: balance both' },
        { q: 'When would you use Random Forest over Logistic Regression?', hint: 'RF: non-linear data, feature importance needed; LR: linearly separable, interpretability needed' },
      ],
      assignment: 'Build a spam email classifier using Naive Bayes on the SMS Spam Collection dataset. Report accuracy, precision, recall.',
    },
  ],

  'uiux-designer': [
    {
      id: 'uiux-fundamentals',
      title: 'Design Fundamentals',
      icon: '🎨',
      duration: '60 min',
      notes: `# Design Fundamentals

## Color Theory
- **Primary** colors: Red, Blue, Yellow (pigment) / Red, Green, Blue (light)
- **Complementary** colors: opposite on color wheel (high contrast)
- **Analogous** colors: adjacent on wheel (harmonious)
- **60-30-10 Rule**: 60% dominant, 30% secondary, 10% accent

## Typography
- **Serif** — formal, print (Times New Roman)
- **Sans-serif** — modern, screen (Inter, Roboto)
- **Font pairing**: heading + body should contrast
- **Type scale**: 12, 14, 16, 20, 24, 32, 48px

## Visual Hierarchy
- Size → bigger = more important
- Color → contrast draws attention
- Whitespace → breathing room
- Position → F-pattern reading

## 8px Grid System
- All spacing multiples of 8: 8, 16, 24, 32, 48px
`,
      videoUrl: 'https://www.youtube.com/embed/YqQx75OPRa0',
      practiceQuestions: [
        { q: 'What color combination would work for a finance app?', hint: 'Blue (trust) + white (clean) + green (growth) — avoid red (danger)' },
        { q: 'Name 3 principles of visual hierarchy', hint: 'Size contrast, color contrast, spacing/whitespace' },
        { q: 'What font would you use for a medical app and why?', hint: 'Sans-serif (Inter, Roboto) — clean, readable, professional' },
      ],
      assignment: 'Create a mood board for a food delivery app redesign. Define color palette, typography, and spacing system.',
    },
    {
      id: 'uiux-figma',
      title: 'Figma & Prototyping',
      icon: '🖼️',
      duration: '90 min',
      notes: `# Figma Essentials

## Key Concepts
- **Frames** — artboards / screen containers
- **Components** — reusable UI elements
- **Auto Layout** — responsive spacing (like flexbox)
- **Variants** — multiple states of a component
- **Prototype** — clickable interactions

## Auto Layout
- Direction: horizontal / vertical
- Gap between items: fixed or auto
- Padding: top/right/bottom/left
- Resizing: fixed / hug / fill

## Design Systems
- Color styles
- Text styles  
- Component library
- Spacing tokens

## Prototyping
- Connect frames with arrows
- Set trigger: On Click, On Hover
- Set animation: Instant, Dissolve, Smart Animate
`,
      videoUrl: 'https://www.youtube.com/embed/FTFaQWZBqQ8',
      practiceQuestions: [
        { q: 'What is the difference between a Frame and a Group in Figma?', hint: 'Frame: has constraints, clip content, auto layout; Group: just grouping without layout logic' },
        { q: 'How do you create a reusable button component?', hint: 'Design button → Right-click → Create Component → use in frames' },
        { q: 'What is Smart Animate and when do you use it?', hint: 'Transitions between frames by animating shared layers — great for micro-interactions' },
      ],
      assignment: 'Design a mobile app onboarding flow (3 screens) in Figma with proper Auto Layout and a clickable prototype.',
    },
  ],

  'fullstack-developer': [
    {
      id: 'fs-html',
      title: 'HTML & CSS Mastery',
      icon: '🌐',
      duration: '60 min',
      notes: `# HTML & CSS

## Semantic HTML
\`\`\`html
<header>, <nav>, <main>, <section>, <article>, <footer>
\`\`\`

## CSS Flexbox
\`\`\`css
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}
\`\`\`

## CSS Grid
\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
\`\`\`

## Responsive Design
\`\`\`css
@media (max-width: 768px) {
  .grid { grid-template-columns: 1fr; }
}
\`\`\`
`,
      videoUrl: 'https://www.youtube.com/embed/pQN-pnXPaVg',
      practiceQuestions: [
        { q: 'Center a div both horizontally and vertically using Flexbox', hint: 'display:flex; justify-content:center; align-items:center' },
        { q: 'Create a 3-column responsive grid that collapses to 1 column on mobile', hint: 'grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))' },
        { q: 'What is the difference between position relative and absolute?', hint: 'Relative: positioned relative to itself; Absolute: positioned relative to nearest positioned ancestor' },
      ],
      assignment: 'Build a responsive portfolio page with header, projects grid, and footer. Must work on both desktop and mobile.',
    },
  ],
};

// Fallback for goals without specific content
export const getContentForGoal = (goalId) => {
  return contentByGoal[goalId] || contentByGoal['java-developer'];
};
