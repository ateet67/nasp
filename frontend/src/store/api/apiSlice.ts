import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import API_CONFIG from '../../config/api'

// Define types for API responses
export interface User {
  _id: string
  fullName: string
  email: string
  role: string
  regionId?: string
  schoolId?: string
  createdAt: string
  updatedAt: string
}

export interface Student {
  _id: string
  fullName: string
  email: string
  regionId?: string
  schoolId?: string
  teacherId?: string
  approved: boolean
  progress?: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface Conservation {
  _id: string
  title: string
  description: string
  regionId: string
  order: number
  progress?: {
    completedTopics: number
    totalTopics: number
    eligibleForFinal: boolean
  }
}

export interface Topic {
  _id: string
  title: string
  description: string
  conservationId: string
  order: number
  unlocked?: boolean
  completed?: boolean
}

export interface Item {
  _id: string
  title: string
  description: string
  topicId: string
  order: number
  images?: string[]
  videos?: string[]
}

export interface Assessment {
  _id: string
  title: string
  description: string
  topicId?: string
  conservationId?: string
  questions: Array<{
    question: string
    options: Array<{
      text: string
      isCorrect: boolean
    }>
  }>
}

export interface Badge {
  _id: string
  name: string
  description: string
  icon: string
  criteria: string
}

export interface Notification {
  _id: string
  title: string
  message: string
  type: string
  read: boolean
  createdAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  user: User
}

export interface SignupRequest {
  email: string
  fullName: string
  password: string
}

export interface CreateUserRequest {
  fullName: string
  email: string
  role: string
  regionId?: string
  schoolId?: string
}

export interface UpdateUserRequest {
  fullName?: string
  email?: string
  role?: string
  regionId?: string
  schoolId?: string
}

export interface UsersListResponse {
  items: User[]
  total: number
  page: number
  limit: number
}

export interface StudentDashboardResponse {
  student: Student
  conservations: Conservation[]
  achievements: any[]
  totalProgress: {
    completedAssessments: number
    totalConservations: number
    completedConservations: number
  }
}

export interface AssessmentSubmissionRequest {
  assessmentId: string
  answers: number[]
}

export interface AssessmentSubmissionResponse {
  ok: boolean
  score: number
  total: number
  passed: boolean
  badgeEarned: boolean
  percentage: number
}

// Create the API slice
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem('token')
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['User', 'Student', 'Conservation', 'Topic', 'Item', 'Assessment', 'Badge', 'Notification'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    
    signup: builder.mutation<LoginResponse, SignupRequest>({
      query: (userData) => ({
        url: '/auth/signup',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    
    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: (data) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),
    
    resetPassword: builder.mutation<{ message: string }, { token: string; newPassword: string }>({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
    
    setPassword: builder.mutation<{ message: string }, { newPassword: string }>({
      query: (data) => ({
        url: '/auth/set-password',
        method: 'POST',
        body: data,
      }),
    }),
    
    // User endpoints
    getMe: builder.query<User, void>({
      query: () => '/users/me',
      providesTags: ['User'],
    }),
    
    getUsers: builder.query<UsersListResponse, { page?: number; limit?: number; search?: string; role?: string }>({
      query: ({ page = 1, limit = 10, search = '', role = '' }) => ({
        url: '/users',
        params: { page, limit, search, role },
      }),
      providesTags: ['User'],
    }),
    
    createUser: builder.mutation<User, CreateUserRequest>({
      query: (userData) => ({
        url: '/users',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    
    updateUser: builder.mutation<User, { id: string; data: UpdateUserRequest }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    
    deleteUser: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    
    // Student endpoints
    getStudents: builder.query<{ items: Student[]; total: number; page: number; limit: number }, { page?: number; limit?: number; filters?: any }>({
      query: ({ page = 1, limit = 10, filters = {} }) => ({
        url: '/students',
        params: { page, limit, ...filters },
      }),
      providesTags: ['Student'],
    }),
    
    createStudent: builder.mutation<Student, any>({
      query: (studentData) => ({
        url: '/students',
        method: 'POST',
        body: studentData,
      }),
      invalidatesTags: ['Student'],
    }),
    
    updateStudent: builder.mutation<Student, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/students/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Student'],
    }),
    
    deleteStudent: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/students/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Student'],
    }),
    
    approveStudent: builder.mutation<Student, string>({
      query: (id) => ({
        url: `/students/${id}/approve`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Student'],
    }),
    
    // Student Portal endpoints
    getStudentDashboard: builder.query<StudentDashboardResponse, void>({
      query: () => '/student-portal/dashboard',
      providesTags: ['Student', 'Conservation'],
    }),
    
    getStudentConservations: builder.query<Conservation[], void>({
      query: () => '/student-portal/conservations',
      providesTags: ['Conservation'],
    }),
    
    getConservationTopics: builder.query<Topic[], string>({
      query: (conservationId) => `/student-portal/conservations/${conservationId}/topics`,
      providesTags: ['Topic'],
    }),
    
    getTopicItems: builder.query<Item[], string>({
      query: (topicId) => `/student-portal/topics/${topicId}/items`,
      providesTags: ['Item'],
    }),
    
    getTopicAssessment: builder.query<Assessment, string>({
      query: (topicId) => `/student-portal/topics/${topicId}/assessment`,
      providesTags: ['Assessment'],
    }),
    
    getConservationAssessment: builder.query<Assessment, string>({
      query: (conservationId) => `/student-portal/conservations/${conservationId}/assessment`,
      providesTags: ['Assessment'],
    }),
    
    submitAssessment: builder.mutation<AssessmentSubmissionResponse, AssessmentSubmissionRequest>({
      query: (data) => ({
        url: '/student-portal/assessments/submit',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Student', 'Conservation', 'Topic'],
    }),
    
    // Badge endpoints
    getBadges: builder.query<Badge[], void>({
      query: () => '/badges',
      providesTags: ['Badge'],
    }),
    
    getStudentBadges: builder.query<Badge[], string>({
      query: (studentId) => `/badges/student/${studentId}`,
      providesTags: ['Badge'],
    }),
    
    getMyBadges: builder.query<Badge[], void>({
      query: () => '/badges/my-badges',
      providesTags: ['Badge'],
    }),
    
    // Notification endpoints
    getNotifications: builder.query<{ items: Notification[]; total: number; page: number; limit: number }, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => ({
        url: '/notifications',
        params: { page, limit },
      }),
      providesTags: ['Notification'],
    }),
    
    getUnreadCount: builder.query<{ count: number }, void>({
      query: () => '/notifications/unread-count',
      providesTags: ['Notification'],
    }),
    
    markNotificationAsRead: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),
    
    markAllNotificationsAsRead: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/notifications/mark-all-read',
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
})

export const {
  useLoginMutation,
  useSignupMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useSetPasswordMutation,
  useGetMeQuery,
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetStudentsQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useApproveStudentMutation,
  useGetStudentDashboardQuery,
  useGetStudentConservationsQuery,
  useGetConservationTopicsQuery,
  useGetTopicItemsQuery,
  useGetTopicAssessmentQuery,
  useGetConservationAssessmentQuery,
  useSubmitAssessmentMutation,
  useGetBadgesQuery,
  useGetStudentBadgesQuery,
  useGetMyBadgesQuery,
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} = apiSlice
