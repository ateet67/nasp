import API_CONFIG from '../config/api'

const API_BASE_URL = API_CONFIG.BASE_URL

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token')
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (!response.ok) throw new Error('Login failed')
    return response.json()
  }

  async signup(email: string, fullName: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, fullName, password })
    })
    if (!response.ok) throw new Error('Signup failed')
    return response.json()
  }

  async forgotPassword(email: string) {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    if (!response.ok) throw new Error('Failed to send reset email')
    return response.json()
  }

  async resetPassword(token: string, newPassword: string) {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword })
    })
    if (!response.ok) throw new Error('Failed to reset password')
    return response.json()
  }

  async setPassword(newPassword: string) {
    const response = await fetch(`${API_BASE_URL}/auth/set-password`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ newPassword })
    })
    if (!response.ok) throw new Error('Failed to set password')
    return response.json()
  }

  // User endpoints
  async getUsers(page = 1, limit = 10, search = '', role = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(role && { role })
    })
    const response = await fetch(`${API_BASE_URL}/users?${params}`, {
      headers: this.getAuthHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch users')
    return response.json()
  }

  async createUser(userData: any) {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData)
    })
    if (!response.ok) throw new Error('Failed to create user')
    return response.json()
  }

  async updateUser(id: string, userData: any) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData)
    })
    if (!response.ok) throw new Error('Failed to update user')
    return response.json()
  }

  async deleteUser(id: string) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    })
    if (!response.ok) throw new Error('Failed to delete user')
    return response.json()
  }

  async getUser(id: string) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: this.getAuthHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch user')
    return response.json()
  }

  async getMe() {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: this.getAuthHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch user profile')
    return response.json()
  }

  // Student endpoints
  async getStudents(page = 1, limit = 10, filters: any = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== '') {
          acc[key] = value.toString()
        }
        return acc
      }, {} as Record<string, string>)
    })
    const response = await fetch(`${API_BASE_URL}/students?${params}`, {
      headers: this.getAuthHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch students')
    return response.json()
  }

  async createStudent(studentData: any) {
    const response = await fetch(`${API_BASE_URL}/students`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(studentData)
    })
    if (!response.ok) throw new Error('Failed to create student')
    return response.json()
  }

  async updateStudent(id: string, studentData: any) {
    const response = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(studentData)
    })
    if (!response.ok) throw new Error('Failed to update student')
    return response.json()
  }

  async deleteStudent(id: string) {
    const response = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    })
    if (!response.ok) throw new Error('Failed to delete student')
    return response.json()
  }

  async approveStudent(id: string) {
    const response = await fetch(`${API_BASE_URL}/students/${id}/approve`, {
      method: 'PATCH',
      headers: this.getAuthHeaders()
    })
    if (!response.ok) throw new Error('Failed to approve student')
    return response.json()
  }

  // School endpoints
  async getSchools(page = 1, limit = 10, search = '', regionId = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(regionId && { regionId })
    })
    const response = await fetch(`${API_BASE_URL}/schools?${params}`, {
      headers: this.getAuthHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch schools')
    return response.json()
  }

  async createSchool(schoolData: any) {
    const response = await fetch(`${API_BASE_URL}/schools`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(schoolData)
    })
    if (!response.ok) throw new Error('Failed to create school')
    return response.json()
  }

  async updateSchool(id: string, schoolData: any) {
    const response = await fetch(`${API_BASE_URL}/schools/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(schoolData)
    })
    if (!response.ok) throw new Error('Failed to update school')
    return response.json()
  }

  async deleteSchool(id: string) {
    const response = await fetch(`${API_BASE_URL}/schools/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    })
    if (!response.ok) throw new Error('Failed to delete school')
    return response.json()
  }

  // Region endpoints
  async getRegions(page = 1, limit = 10, search = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search })
    })
    const response = await fetch(`${API_BASE_URL}/regions?${params}`, {
      headers: this.getAuthHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch regions')
    return response.json()
  }

  async createRegion(regionData: any) {
    const response = await fetch(`${API_BASE_URL}/regions`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(regionData)
    })
    if (!response.ok) throw new Error('Failed to create region')
    return response.json()
  }

  async updateRegion(id: string, regionData: any) {
    const response = await fetch(`${API_BASE_URL}/regions/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(regionData)
    })
    if (!response.ok) throw new Error('Failed to update region')
    return response.json()
  }

  async deleteRegion(id: string) {
    const response = await fetch(`${API_BASE_URL}/regions/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    })
    if (!response.ok) throw new Error('Failed to delete region')
    return response.json()
  }

  // Conservation endpoints
  async getConservations(page = 1, limit = 10, regionId = '', search = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(regionId && { regionId }),
      ...(search && { search })
    })
    const response = await fetch(`${API_BASE_URL}/conservations?${params}`, {
      headers: this.getAuthHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch conservations')
    return response.json()
  }

  async createConservation(conservationData: any) {
    const response = await fetch(`${API_BASE_URL}/conservations`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(conservationData)
    })
    if (!response.ok) throw new Error('Failed to create conservation')
    return response.json()
  }

  async updateConservation(id: string, conservationData: any) {
    const response = await fetch(`${API_BASE_URL}/conservations/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(conservationData)
    })
    if (!response.ok) throw new Error('Failed to update conservation')
    return response.json()
  }

  async deleteConservation(id: string) {
    const response = await fetch(`${API_BASE_URL}/conservations/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    })
    if (!response.ok) throw new Error('Failed to delete conservation')
    return response.json()
  }

  // Student Portal endpoints
  async getStudentDashboard() {
    const response = await fetch(`${API_BASE_URL}/student-portal/dashboard`, {
      headers: this.getAuthHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch dashboard')
    return response.json()
  }

  async getStudentConservations() {
    const response = await fetch(`${API_BASE_URL}/student-portal/conservations`, {
      headers: this.getAuthHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch conservations')
    return response.json()
  }

  async getConservationTopics(conservationId: string) {
    const response = await fetch(`${API_BASE_URL}/student-portal/conservations/${conservationId}/topics`, {
      headers: this.getAuthHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch topics')
    return response.json()
  }

  async getTopicItems(topicId: string) {
    const response = await fetch(`${API_BASE_URL}/student-portal/topics/${topicId}/items`, {
      headers: this.getAuthHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch items')
    return response.json()
  }

  async getTopicAssessment(topicId: string) {
    const response = await fetch(`${API_BASE_URL}/student-portal/topics/${topicId}/assessment`, {
      headers: this.getAuthHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch assessment')
    return response.json()
  }

  async getConservationAssessment(conservationId: string) {
    const response = await fetch(`${API_BASE_URL}/student-portal/conservations/${conservationId}/assessment`, {
      headers: this.getAuthHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch assessment')
    return response.json()
  }

  async submitAssessment(assessmentId: string, answers: number[]) {
    const response = await fetch(`${API_BASE_URL}/student-portal/assessments/submit`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ assessmentId, answers })
    })
    if (!response.ok) throw new Error('Failed to submit assessment')
    return response.json()
  }

  // Badge endpoints
  async getBadges() {
    const response = await fetch(`${API_BASE_URL}/badges`, {
      headers: this.getAuthHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch badges')
    return response.json()
  }

  async getStudentBadges(studentId: string) {
    const response = await fetch(`${API_BASE_URL}/badges/student/${studentId}`, {
      headers: this.getAuthHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch student badges')
    return response.json()
  }

  async getMyBadges() {
    const response = await fetch(`${API_BASE_URL}/badges/my-badges`, {
      headers: this.getAuthHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch my badges')
    return response.json()
  }

  // Notification endpoints
  async getNotifications(page = 1, limit = 10) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    })
    const response = await fetch(`${API_BASE_URL}/notifications?${params}`, {
      headers: this.getAuthHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch notifications')
    return response.json()
  }

  async getUnreadCount() {
    const response = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
      headers: this.getAuthHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch unread count')
    return response.json()
  }

  async markNotificationAsRead(id: string) {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: this.getAuthHeaders()
    })
    if (!response.ok) throw new Error('Failed to mark notification as read')
    return response.json()
  }

  async markAllNotificationsAsRead() {
    const response = await fetch(`${API_BASE_URL}/notifications/mark-all-read`, {
      method: 'PATCH',
      headers: this.getAuthHeaders()
    })
    if (!response.ok) throw new Error('Failed to mark all notifications as read')
    return response.json()
  }
}

export const apiService = new ApiService()
export default apiService
