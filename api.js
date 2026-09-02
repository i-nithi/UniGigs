/**
 * UniGigs Frontend API Utility Client
 * Handles HTTP requests, JWT token storage, Authorization headers, and error handling.
 */

const API_BASE_URL = 'http://localhost:8000';
const TOKEN_KEY = 'access_token';

// Token Management Helpers
function getAuthToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function setAuthToken(token) {
    if (token) {
        localStorage.setItem(TOKEN_KEY, token);
    }
}

function removeAuthToken() {
    localStorage.removeItem(TOKEN_KEY);
}

/**
 * Reusable fetch wrapper for backend API calls.
 */
async function apiFetch(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Set up default headers
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };

    // Automatically attach Bearer JWT token if available
    const token = getAuthToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers
    };

    try {
        const response = await fetch(url, config);

        // Handle 401 Unauthorized (Expired or invalid token)
        if (response.status === 401) {
            removeAuthToken();
            // Dispatch a custom auth error event for UI listeners
            window.dispatchEvent(new CustomEvent('unigigs:unauthorized'));
        }

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            let errorMsg = data.detail || `Request failed with status ${response.status}`;
            if (Array.isArray(data.detail)) {
                errorMsg = data.detail.map(e => e.msg || e.detail).join(', ');
            }
            const error = new Error(errorMsg);
            error.status = response.status;
            error.data = data;
            throw error;
        }

        return data;
    } catch (error) {
        console.error(`API Fetch Error [${options.method || 'GET'} ${endpoint}]:`, error.message);
        throw error;
    }
}

// User Profile API Service Wrapper
const UserAPI = {
    // Auth APIs
    signup: (signupData) => apiFetch('/auth/signup', { method: 'POST', body: JSON.stringify(signupData) }),
    login: (loginData) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(loginData) }),
    getMe: () => apiFetch('/users/me'),
    
    // Profile APIs
    updateProfile: (updateData) => apiFetch('/users/me', { method: 'PUT', body: JSON.stringify(updateData) }),
    getPublicProfile: (userId) => apiFetch(`/users/${userId}`)
};

// Export to window scope for easy usage in java.js
window.API_BASE_URL = API_BASE_URL;
window.getAuthToken = getAuthToken;
window.setAuthToken = setAuthToken;
window.removeAuthToken = removeAuthToken;
window.apiFetch = apiFetch;
window.UserAPI = UserAPI;
