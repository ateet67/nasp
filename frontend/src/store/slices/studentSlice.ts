import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Student, Conservation, Topic, Item, Assessment, Badge, Notification } from '../api/apiSlice'

interface StudentState {
  // Dashboard data
  student: Student | null
  conservations: Conservation[]
  achievements: any[]
  totalProgress: {
    completedAssessments: number
    totalConservations: number
    completedConservations: number
  } | null
  
  // Current learning state
  currentConservation: Conservation | null
  currentTopic: Topic | null
  currentItems: Item[]
  currentAssessment: Assessment | null
  
  // Badges and notifications
  badges: Badge[]
  notifications: Notification[]
  unreadNotificationCount: number
  
  // UI state
  isLoading: boolean
  error: string | null
  showAssessmentModal: boolean
  showBadgeModal: boolean
  showNotificationModal: boolean
  
  // Assessment state
  assessmentAnswers: number[]
  assessmentSubmitted: boolean
  assessmentResult: {
    score: number
    total: number
    passed: boolean
    badgeEarned: boolean
    percentage: number
  } | null
}

const initialState: StudentState = {
  student: null,
  conservations: [],
  achievements: [],
  totalProgress: null,
  currentConservation: null,
  currentTopic: null,
  currentItems: [],
  currentAssessment: null,
  badges: [],
  notifications: [],
  unreadNotificationCount: 0,
  isLoading: false,
  error: null,
  showAssessmentModal: false,
  showBadgeModal: false,
  showNotificationModal: false,
  assessmentAnswers: [],
  assessmentSubmitted: false,
  assessmentResult: null,
}

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    // Dashboard actions
    setDashboardData: (state, action: PayloadAction<{
      student: Student
      conservations: Conservation[]
      achievements: any[]
      totalProgress: any
    }>) => {
      state.student = action.payload.student
      state.conservations = action.payload.conservations
      state.achievements = action.payload.achievements
      state.totalProgress = action.payload.totalProgress
    },
    
    // Learning state actions
    setCurrentConservation: (state, action: PayloadAction<Conservation | null>) => {
      state.currentConservation = action.payload
      state.currentTopic = null
      state.currentItems = []
      state.currentAssessment = null
    },
    
    setCurrentTopic: (state, action: PayloadAction<Topic | null>) => {
      state.currentTopic = action.payload
      state.currentItems = []
      state.currentAssessment = null
    },
    
    setCurrentItems: (state, action: PayloadAction<Item[]>) => {
      state.currentItems = action.payload
    },
    
    setCurrentAssessment: (state, action: PayloadAction<Assessment | null>) => {
      state.currentAssessment = action.payload
      state.assessmentAnswers = []
      state.assessmentSubmitted = false
      state.assessmentResult = null
    },
    
    // Badge and notification actions
    setBadges: (state, action: PayloadAction<Badge[]>) => {
      state.badges = action.payload
    },
    
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload
    },
    
    setUnreadNotificationCount: (state, action: PayloadAction<number>) => {
      state.unreadNotificationCount = action.payload
    },
    
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n._id === action.payload)
      if (notification) {
        notification.read = true
        state.unreadNotificationCount = Math.max(0, state.unreadNotificationCount - 1)
      }
    },
    
    // UI state actions
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    
    clearError: (state) => {
      state.error = null
    },
    
    showAssessmentModal: (state) => {
      state.showAssessmentModal = true
    },
    
    hideAssessmentModal: (state) => {
      state.showAssessmentModal = false
      state.assessmentAnswers = []
      state.assessmentSubmitted = false
      state.assessmentResult = null
    },
    
    showBadgeModal: (state) => {
      state.showBadgeModal = true
    },
    
    hideBadgeModal: (state) => {
      state.showBadgeModal = false
    },
    
    showNotificationModal: (state) => {
      state.showNotificationModal = true
    },
    
    hideNotificationModal: (state) => {
      state.showNotificationModal = false
    },
    
    // Assessment actions
    setAssessmentAnswer: (state, action: PayloadAction<{ questionIndex: number; answer: number }>) => {
      state.assessmentAnswers[action.payload.questionIndex] = action.payload.answer
    },
    
    setAssessmentAnswers: (state, action: PayloadAction<number[]>) => {
      state.assessmentAnswers = action.payload
    },
    
    setAssessmentSubmitted: (state, action: PayloadAction<boolean>) => {
      state.assessmentSubmitted = action.payload
    },
    
    setAssessmentResult: (state, action: PayloadAction<{
      score: number
      total: number
      passed: boolean
      badgeEarned: boolean
      percentage: number
    }>) => {
      state.assessmentResult = action.payload
      state.assessmentSubmitted = true
    },
    
    // Progress update actions
    updateConservationProgress: (state, action: PayloadAction<{ conservationId: string; progress: any }>) => {
      const conservation = state.conservations.find(c => c._id === action.payload.conservationId)
      if (conservation) {
        conservation.progress = action.payload.progress
      }
    },
    
    updateTopicProgress: (state, action: PayloadAction<{ topicId: string; completed: boolean }>) => {
      const topic = state.conservations
        .flatMap(c => c.topics || [])
        .find(t => t._id === action.payload.topicId)
      if (topic) {
        topic.completed = action.payload.completed
      }
    },
    
    // Reset actions
    resetStudentState: (state) => {
      return initialState
    },
    
    resetLearningState: (state) => {
      state.currentConservation = null
      state.currentTopic = null
      state.currentItems = []
      state.currentAssessment = null
      state.assessmentAnswers = []
      state.assessmentSubmitted = false
      state.assessmentResult = null
    },
  },
})

export const {
  setDashboardData,
  setCurrentConservation,
  setCurrentTopic,
  setCurrentItems,
  setCurrentAssessment,
  setBadges,
  setNotifications,
  setUnreadNotificationCount,
  markNotificationAsRead,
  setLoading,
  setError,
  clearError,
  showAssessmentModal,
  hideAssessmentModal,
  showBadgeModal,
  hideBadgeModal,
  showNotificationModal,
  hideNotificationModal,
  setAssessmentAnswer,
  setAssessmentAnswers,
  setAssessmentSubmitted,
  setAssessmentResult,
  updateConservationProgress,
  updateTopicProgress,
  resetStudentState,
  resetLearningState,
} = studentSlice.actions

export default studentSlice.reducer

// Selectors
export const selectStudent = (state: { student: StudentState }) => state.student.student
export const selectConservations = (state: { student: StudentState }) => state.student.conservations
export const selectAchievements = (state: { student: StudentState }) => state.student.achievements
export const selectTotalProgress = (state: { student: StudentState }) => state.student.totalProgress
export const selectCurrentConservation = (state: { student: StudentState }) => state.student.currentConservation
export const selectCurrentTopic = (state: { student: StudentState }) => state.student.currentTopic
export const selectCurrentItems = (state: { student: StudentState }) => state.student.currentItems
export const selectCurrentAssessment = (state: { student: StudentState }) => state.student.currentAssessment
export const selectBadges = (state: { student: StudentState }) => state.student.badges
export const selectNotifications = (state: { student: StudentState }) => state.student.notifications
export const selectUnreadNotificationCount = (state: { student: StudentState }) => state.student.unreadNotificationCount
export const selectStudentLoading = (state: { student: StudentState }) => state.student.isLoading
export const selectStudentError = (state: { student: StudentState }) => state.student.error
export const selectShowAssessmentModal = (state: { student: StudentState }) => state.student.showAssessmentModal
export const selectShowBadgeModal = (state: { student: StudentState }) => state.student.showBadgeModal
export const selectShowNotificationModal = (state: { student: StudentState }) => state.student.showNotificationModal
export const selectAssessmentAnswers = (state: { student: StudentState }) => state.student.assessmentAnswers
export const selectAssessmentSubmitted = (state: { student: StudentState }) => state.student.assessmentSubmitted
export const selectAssessmentResult = (state: { student: StudentState }) => state.student.assessmentResult
