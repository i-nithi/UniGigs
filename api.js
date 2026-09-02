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
            window.dispatchEvent(new CustomEvent('unigigs:unauthorized'));
        }

        // 204 No Content response handling
        if (response.status === 204) {
            return null;
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
    // Auth & OTP APIs
    signup: (signupData) => apiFetch('/auth/signup', { method: 'POST', body: JSON.stringify(signupData) }),
    login: (loginData) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(loginData) }),
    requestOTP: (email) => apiFetch('/auth/request-otp', { method: 'POST', body: JSON.stringify({ email }) }),
    verifyOTP: (email, code) => apiFetch('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ email, otp_code: code }) }),
    getMe: () => apiFetch('/users/me'),
    
    // Profile APIs
    updateProfile: (updateData) => apiFetch('/users/me', { method: 'PUT', body: JSON.stringify(updateData) }),
    getPublicProfile: (userId) => apiFetch(`/users/${userId}`)
};

// Gig API Service Wrapper
const GigAPI = {
    // Fetch paginated Gigs with query params (search, category, location, min/max reward, sort, page, limit)
    getGigs: (params = {}) => {
        const query = new URLSearchParams();
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null && params[key] !== '' && params[key] !== 'all') {
                query.append(key, params[key]);
            }
        });
        const queryString = query.toString();
        return apiFetch(`/gigs${queryString ? '?' + queryString : ''}`);
    },

    // Fetch full detail for a specific Gig
    getGigDetails: (gigId) => apiFetch(`/gigs/${gigId}`),

    // Post a new Gig (authenticated poster)
    createGig: (gigData) => apiFetch('/gigs', { method: 'POST', body: JSON.stringify(gigData) }),

    // Update existing Gig (poster only)
    updateGig: (gigId, updateData) => apiFetch(`/gigs/${gigId}`, { method: 'PUT', body: JSON.stringify(updateData) }),

    // Soft-delete Gig (poster only)
    deleteGig: (gigId) => apiFetch(`/gigs/${gigId}`, { method: 'DELETE' }),

    // Phase 5 Lifecycle APIs
    startWork: (gigId) => apiFetch(`/gigs/${gigId}/start`, { method: 'POST' }),
    submitWork: (gigId, submissionData) => apiFetch(`/gigs/${gigId}/submit`, { method: 'POST', body: JSON.stringify(submissionData) }),
    completeGig: (gigId) => apiFetch(`/gigs/${gigId}/complete`, { method: 'POST' }),
    cancelGig: (gigId) => apiFetch(`/gigs/${gigId}/cancel`, { method: 'POST' })
};

// File Upload Utility API
const UploadAPI = {
    uploadFile: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const headers = {};
        const token = getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const response = await fetch(`${API_BASE_URL}/upload`, {
            method: 'POST',
            headers,
            body: formData
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.detail || 'File upload failed.');
        }
        return data;
    }
};

// Payment & Wallet API Service Wrapper
const PaymentAPI = {
    getWallet: () => apiFetch('/wallet'),
    getTransactions: (params = {}) => {
        const query = new URLSearchParams();
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null) {
                query.append(key, params[key]);
            }
        });
        const queryString = query.toString();
        return apiFetch(`/transactions${queryString ? '?' + queryString : ''}`);
    },
    lockPayment: (gigId) => apiFetch('/payment/lock', { method: 'POST', body: JSON.stringify({ gig_id: Number(gigId) }) }),
    releasePayment: (gigId) => apiFetch('/payment/release', { method: 'POST', body: JSON.stringify({ gig_id: Number(gigId) }) })
};

// In-App Notification API Service Wrapper
const NotificationAPI = {
    getNotifications: (params = {}) => {
        const query = new URLSearchParams();
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null) {
                query.append(key, params[key]);
            }
        });
        const queryString = query.toString();
        return apiFetch(`/notifications${queryString ? '?' + queryString : ''}`);
    },
    markAsRead: (notificationId) => apiFetch(`/notifications/${notificationId}/read`, { method: 'POST' })
};

// Export to window scope
window.API_BASE_URL = API_BASE_URL;
window.getAuthToken = getAuthToken;
window.setAuthToken = setAuthToken;
window.removeAuthToken = removeAuthToken;
window.apiFetch = apiFetch;
window.UserAPI = UserAPI;
window.GigAPI = GigAPI;
window.UploadAPI = UploadAPI;
window.PaymentAPI = PaymentAPI;
window.NotificationAPI = NotificationAPI;
