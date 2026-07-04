export const leaderboardData = [
  { rank: 1, name: 'Priya Sharma', college: 'IIT Madras', xp: 45200, coins: 3200, streak: 87, score: 96, career: 'AI Engineer', avatar: '👩‍💻', level: 7 },
  { rank: 2, name: 'Arjun Mehta', college: 'NIT Trichy', xp: 42800, coins: 2980, streak: 72, score: 94, career: 'Full Stack Dev', avatar: '👨‍💻', level: 7 },
  { rank: 3, name: 'Sneha Reddy', college: 'BITS Pilani', xp: 38500, coins: 2650, streak: 65, score: 91, career: 'Data Analyst', avatar: '👩‍🔬', level: 6 },
  { rank: 4, name: 'Rahul Kumar', college: 'VIT Vellore', xp: 35200, coins: 2400, streak: 54, score: 88, career: 'Java Developer', avatar: '👨‍🎓', level: 6 },
  { rank: 5, name: 'Ananya Singh', college: 'SRCC Delhi', xp: 31800, coins: 2100, streak: 48, score: 85, career: 'Cloud Engineer', avatar: '👩‍🚀', level: 5 },
  { rank: 6, name: 'Kiran Patel', college: 'Amity University', xp: 28400, coins: 1900, streak: 42, score: 83, career: 'DevOps Engineer', avatar: '👨‍💼', level: 5 },
  { rank: 7, name: 'Meera Nair', college: 'PSG Tech', xp: 25600, coins: 1750, streak: 38, score: 81, career: 'UI/UX Designer', avatar: '👩‍🎨', level: 5 },
  { rank: 8, name: 'Vikram Iyer', college: 'Anna University', xp: 22800, coins: 1580, streak: 33, score: 79, career: 'Python Dev', avatar: '🧑‍💻', level: 4 },
  { rank: 9, name: 'Divya Menon', college: 'CEG Chennai', xp: 20100, coins: 1420, streak: 28, score: 76, career: 'ML Engineer', avatar: '👩‍🔬', level: 4 },
  { rank: 10, name: 'Rohan Joshi', college: 'MIT Pune', xp: 18500, coins: 1300, streak: 25, score: 74, career: 'Full Stack Dev', avatar: '👨‍🏫', level: 4 },
  { rank: 11, name: 'Aisha Khan', college: 'RAIT Mumbai', xp: 16200, coins: 1150, streak: 21, score: 72, career: 'Java Developer', avatar: '👩‍💻', level: 3 },
  { rank: 12, name: 'Suresh Babu', college: 'SRM Chennai', xp: 14800, coins: 1050, streak: 18, score: 70, career: 'Data Analyst', avatar: '👨‍💻', level: 3 },
];

export const levels = [
  { level: 1, title: 'Career Explorer', minXP: 0, maxXP: 1000, color: 'from-slate-400 to-slate-500', icon: '🌱' },
  { level: 2, title: 'Learner', minXP: 1000, maxXP: 3000, color: 'from-blue-400 to-blue-500', icon: '📚' },
  { level: 3, title: 'Developer', minXP: 3000, maxXP: 7000, color: 'from-green-400 to-green-500', icon: '💻' },
  { level: 4, title: 'Problem Solver', minXP: 7000, maxXP: 15000, color: 'from-purple-400 to-purple-500', icon: '🧠' },
  { level: 5, title: 'Placement Ready', minXP: 15000, maxXP: 28000, color: 'from-cyan-400 to-cyan-500', icon: '🎯' },
  { level: 6, title: 'Interview Master', minXP: 28000, maxXP: 45000, color: 'from-orange-400 to-orange-500', icon: '🎤' },
  { level: 7, title: 'Career Champion', minXP: 45000, maxXP: Infinity, color: 'from-yellow-400 to-amber-500', icon: '🏆' },
];

export const getLevelInfo = (xp) => {
  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i].minXP) return levels[i];
  }
  return levels[0];
};

export const successStories = [
  {
    name: 'Rahul Sharma',
    college: 'Anna University',
    company: 'TCS',
    package: '4.2 LPA',
    duration: '5 months',
    skills: ['Java', 'SQL', 'OOP', 'Spring Boot'],
    avatar: '👨‍💻',
    story: 'Followed the Java Developer roadmap rigorously and cracked TCS on first attempt.',
    placementScore: 84,
    tips: 'Focus on OOP concepts and practice at least 2 aptitude tests daily.',
  },
  {
    name: 'Kavya Nair',
    college: 'PSG Tech',
    company: 'Zoho',
    package: '8.5 LPA',
    duration: '7 months',
    skills: ['C++', 'DSA', 'Problem Solving', 'OOP'],
    avatar: '👩‍💻',
    story: 'Solved 300+ problems on LeetCode alongside the platform roadmap.',
    placementScore: 91,
    tips: 'Zoho focuses heavily on programming. Code every single day.',
  },
  {
    name: 'Arun Krishnan',
    college: 'SASTRA University',
    company: 'Infosys',
    package: '3.6 LPA',
    duration: '4 months',
    skills: ['Python', 'SQL', 'Communication'],
    avatar: '🧑‍💻',
    story: 'Used the AI mock interviews to improve communication skills significantly.',
    placementScore: 79,
    tips: 'Communication is key for service companies. Practice speaking clearly.',
  },
];
