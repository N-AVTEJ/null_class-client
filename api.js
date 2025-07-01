// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// API Endpoints
const ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        SIGNUP: '/auth/signup',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh'
    },
    USER: {
        PROFILE: '/user/profile',
        UPDATE: '/user/update',
        STATS: '/user/stats'
    },
    VIDEOS: {
        LIST: '/videos',
        DETAIL: '/videos/:id',
        SEARCH: '/videos/search',
        CATEGORIES: '/videos/categories'
    },
    GROUPS: {
        LIST: '/groups',
        DETAIL: '/groups/:id',
        JOIN: '/groups/:id/join',
        LEAVE: '/groups/:id/leave',
        MESSAGES: '/groups/:id/messages'
    },
    PAYMENTS: {
        PLANS: '/payments/plans',
        SUBSCRIBE: '/payments/subscribe',
        CANCEL: '/payments/cancel'
    }
};

export class ApiClient {
    constructor() {
        this.baseUrl = API_BASE_URL;
        this.token = localStorage.getItem('token');
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
            ...options.headers
        };

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Auth endpoints
    async login(email, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    }

    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    // Group endpoints
    async getGroups() {
        return this.request('/groups');
    }

    async joinGroup(groupId) {
        return this.request(`/groups/${groupId}/join`, {
            method: 'POST'
        });
    }

    async createGroup(groupData) {
        return this.request('/groups', {
            method: 'POST',
            body: JSON.stringify(groupData)
        });
    }

    // Course endpoints
    async getCourses() {
        return this.request('/courses');
    }

    async enrollCourse(courseId) {
        return this.request(`/courses/${courseId}/enroll`, {
            method: 'POST'
        });
    }

    // User endpoints
    async getProfile() {
        return this.request('/users/profile');
    }

    async updateProfile(userData) {
        return this.request('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    }

    // Subscription endpoints
    async getSubscription() {
        return this.request('/subscription');
    }

    async upgradePlan(planId) {
        return this.request('/subscription/upgrade', {
            method: 'POST',
            body: JSON.stringify({ planId })
        });
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('token');
    }
}

// Create and export API client instance
const api = new ApiClient();
export default api; 