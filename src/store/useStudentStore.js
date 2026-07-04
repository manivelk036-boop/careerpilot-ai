import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getLevelInfo, levels } from '../data/students';
import toast from 'react-hot-toast';

const API_URL = 'https://careerpilot-ai-production-6050.up.railway.app/api';

const initialStudent = {
  id: null,
  name: '',
  email: '',
  college: '',
  department: '',
  year: 1,
  cgpa: 0,
  careerGoal: null,
  skills: [],
  projects: [],
  certifications: [],
  internships: [],
  xp: 0,
  coins: 0,
  streak: 0,
  lastLoginDate: new Date().toDateString(),
  badges: [],
  topicsCompleted: [],
  quizScores: {},
  placementScore: 0,
  placementBreakdown: {
    technical: 0,
    communication: 0,
    problemSolving: 0,
    interviewReadiness: 0,
    certifications: 0,
    projects: 0,
    aptitude: 0,
    internship: 0,
  },
  aptitudeScores: { quant: 0, logical: 0, verbal: 0 },
  communicationScore: 0,
  resumeScore: 0,
  resumeKeywords: [],
  roadmapProgress: {},
  studyStreak: [false, false, false, false, false, false, false],
  mockInterviewsDone: 0,
  isLoggedIn: false,
  isOnboarded: false,
  baselineAssessmentCompleted: false,
};

export const useStudentStore = create(
  persist(
    (set, get) => ({
      ...initialStudent,

      login: async ({ email, password }) => {
        try {
          const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          if (!res.ok) {
            const errText = await res.text();
            throw new Error(errText || 'Invalid email or password.');
          }
          const data = await res.json();
          set({ ...data, isLoggedIn: true });
          return data;
        } catch (error) {
          toast.error(error.message || 'Login failed.');
          throw error;
        }
      },

      logout: () => {
        set({ ...initialStudent, isLoggedIn: false, isOnboarded: false });
        toast.success('Logged out successfully.');
      },

      register: async (regData) => {
        try {
          const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(regData)
          });
          if (!res.ok) {
            const errText = await res.text();
            throw new Error(errText || 'Registration failed.');
          }
          const data = await res.json();
          set({ ...data, isLoggedIn: true });
          return data;
        } catch (error) {
          toast.error(error.message || 'Registration failed.');
          throw error;
        }
      },

      syncFromBackend: async () => {
        const email = get().email;
        if (!email) return;
        try {
          const res = await fetch(`${API_URL}/student/${encodeURIComponent(email)}`);
          if (res.ok) {
            const data = await res.json();
            // Preserve isLoggedIn
            set({ ...data, isLoggedIn: true });
          }
        } catch (error) {
          console.error('Error syncing student from backend:', error);
        }
      },

      setCareerGoal: (goal) => set({
        careerGoal: goal,
        isOnboarded: true,
        baselineAssessmentCompleted: false,
        roadmapProgress: {},
      }),

      completeBaselineAssessment: (scores, weakTopics) => {
        set(state => {
          const newBreakdown = {
            ...state.placementBreakdown,
            technical: scores.technical,
            problemSolving: scores.problemSolving,
            communication: scores.communication,
          };
          const breakdownScores = Object.values(newBreakdown);
          const avgPlacement = Math.round(breakdownScores.reduce((a, b) => a + b, 0) / breakdownScores.length);
          
          return {
            baselineAssessmentCompleted: true,
            placementBreakdown: newBreakdown,
            placementScore: avgPlacement,
            xp: state.xp + 100, // Reward for completing baseline assessment
            coins: state.coins + 50,
            roadmapProgress: {
              ...state.roadmapProgress,
              customOrder: weakTopics, // Store identified weak topics to prioritize in the roadmap
            }
          };
        });
      },

      addXP: (amount) => {
        const newXP = get().xp + amount;
        set({ xp: newXP });
        return newXP;
      },

      addCoins: (amount) => set(state => ({ coins: state.coins + amount })),

      spendCoins: (amount) => {
        if (get().coins >= amount) {
          set(state => ({ coins: state.coins - amount }));
          return true;
        }
        return false;
      },

      incrementStreak: () => set(state => ({ streak: state.streak + 1 })),

      unlockBadge: (badgeId) => {
        if (!get().badges.includes(badgeId)) {
          set(state => ({ badges: [...state.badges, badgeId] }));
          return true;
        }
        return false;
      },

      completeTopic: (topicId) => {
        if (!get().topicsCompleted.includes(topicId)) {
          set(state => ({
            topicsCompleted: [...state.topicsCompleted, topicId],
            xp: state.xp + 100,
            coins: state.coins + 20,
          }));
        }
      },

      saveQuizScore: (quizId, score, xpEarned, coinsEarned) => {
        set(state => {
          const newQuizScores = { ...state.quizScores, [quizId]: score };
          
          // Calculate technical score from non-aptitude quiz scores
          const techQuizzes = Object.entries(newQuizScores).filter(([id]) => id !== 'aptitude-quant');
          const avgTech = techQuizzes.length > 0 ? Math.round(techQuizzes.reduce((sum, [_, val]) => sum + val, 0) / techQuizzes.length) : 0;
          
          const newBreakdown = {
            ...state.placementBreakdown,
            technical: avgTech,
          };
          
          // Calculate overall placementScore average
          const scores = Object.values(newBreakdown);
          const avgPlacement = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

          return {
            quizScores: newQuizScores,
            xp: state.xp + xpEarned,
            coins: state.coins + coinsEarned,
            placementBreakdown: newBreakdown,
            placementScore: avgPlacement,
          };
        });
      },

      updateRoadmapProgress: (careerId, monthIndex, progress) => {
        set(state => ({
          roadmapProgress: {
            ...state.roadmapProgress,
            [careerId]: {
              ...(state.roadmapProgress[careerId] || {}),
              [monthIndex]: progress,
            }
          }
        }));
      },

      updatePlacementScore: (breakdown) => {
        const scores = Object.values(breakdown);
        const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        set({ placementBreakdown: breakdown, placementScore: avg });
      },

      addSkill: (skill) => {
        if (!get().skills.includes(skill)) {
          set(state => ({ skills: [...state.skills, skill] }));
        }
      },

      getCurrentLevel: () => {
        return getLevelInfo(get().xp);
      },

      getNextLevel: () => {
        const current = getLevelInfo(get().xp);
        const idx = levels.findIndex(l => l.level === current.level);
        return idx < levels.length - 1 ? levels[idx + 1] : null;
      },

      getXPProgress: () => {
        const xp = get().xp;
        const current = getLevelInfo(xp);
        if (current.maxXP === Infinity) return 100;
        return Math.round(((xp - current.minXP) / (current.maxXP - current.minXP)) * 100);
      },

      updateProfile: (data) => set(data),

      setResumeScore: (score, keywords) => set({ resumeScore: score, resumeKeywords: keywords }),

      completeMockInterview: () => set(state => {
        const newBreakdown = {
          ...state.placementBreakdown,
          interviewReadiness: Math.min(100, (state.placementBreakdown.interviewReadiness || 0) + 5),
        };
        const scores = Object.values(newBreakdown);
        const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        return {
          mockInterviewsDone: state.mockInterviewsDone + 1,
          xp: state.xp + 150,
          coins: state.coins + 75,
          placementBreakdown: newBreakdown,
          placementScore: avg
        };
      }),

      resetProgress: () => set(initialStudent),
    }),
    {
      name: 'careerpilot-student',
    }
  )
);

// Automatic State Synchronization to Backend Subscriber with Debounce
let syncTimeout = null;
useStudentStore.subscribe((state) => {
  if (state.isLoggedIn && state.email) {
    if (syncTimeout) clearTimeout(syncTimeout);
    syncTimeout = setTimeout(async () => {
      try {
        await fetch(`${API_URL}/student/${encodeURIComponent(state.email)}/sync`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(state)
        });
      } catch (err) {
        console.error('Error auto-syncing state to backend:', err);
      }
    }, 1000); // 1-second debounce to batch rapid updates
  }
});
