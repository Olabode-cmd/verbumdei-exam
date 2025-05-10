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

// Toast notification function
function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'fixed top-4 right-4 z-50';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `mb-3 p-4 rounded-md shadow-lg flex items-center transition-all transform translate-x-0 max-w-xs`;
    
    // Set background color based on type
    switch(type) {
        case 'success':
            toast.classList.add('bg-green-500', 'text-white');
            break;
        case 'error':
            toast.classList.add('bg-red-500', 'text-white');
            break;
        case 'warning':
            toast.classList.add('bg-yellow-500', 'text-white');
            break;
        default:
            toast.classList.add('bg-blue-500', 'text-white');
    }
    
    // Add icon based on type
    let icon = '';
    switch(type) {
        case 'success':
            icon = '<i class="fas fa-check-circle mr-2"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-exclamation-circle mr-2"></i>';
            break;
        case 'warning':
            icon = '<i class="fas fa-exclamation-triangle mr-2"></i>';
            break;
        default:
            icon = '<i class="fas fa-info-circle mr-2"></i>';
    }
    
    // Set toast content
    toast.innerHTML = `${icon}<span>${message}</span>`;
    
    // Add toast to container
    toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.add('opacity-100');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('opacity-0');
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 300);
    }, 3000);
}