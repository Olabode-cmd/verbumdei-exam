const API_CONFIG = {
    BASE_URL: 'https://service.verbumdeiportal.com/',
    ENDPOINTS: {
        STUDENT_SESSION: (registrationId, code) => `/sessions/${registrationId}/${code}`,
        AUTH: {
            LOGIN: 'user/login',
            LOGOUT: 'user/logout'
        }
    }
};

// Authorized roles for admin dashboard
const AUTHORIZED_ROLES = ['HEAD TEACHER', 'TEACHER', 'SECRETARY'];

// Utility function to check if user role is authorized
function isAuthorizedRole(role) {
    return AUTHORIZED_ROLES.includes(role);
}

// Regular authentication login
async function login(credentials) {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

// Get student exam session
async function getStudentSession(registrationId, code) {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STUDENT_SESSION(registrationId, code)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch exam session');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

// Store user session
function storeUserSession(userData) {
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('adminToken', userData.token);
}

// Get user session
function getUserSession() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
}

// Clear user session
function clearUserSession() {
    localStorage.removeItem('userData');
    localStorage.removeItem('adminToken');
}

// Get authorization header
function getAuthHeader() {
    const token = localStorage.getItem('adminToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
} 