import API_CONFIG from '../config/api';

class ApiService {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.headers = API_CONFIG.HEADERS;
    }

    async getAuthHeader() {
        const token = localStorage.getItem('token');
        return token ? { ...this.headers, Authorization: `Bearer ${token}` } : this.headers;
    }

    async handleResponse(response) {
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Something went wrong');
        }
        return response.json();
    }

    async get(endpoint) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'GET',
                headers: await this.getAuthHeader(),
                credentials: 'include'
            });
            return this.handleResponse(response);
        } catch (error) {
            console.error('GET Request Error:', error);
            throw error;
        }
    }

    async post(endpoint, data) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers: await this.getAuthHeader(),
                credentials: 'include',
                body: JSON.stringify(data)
            });
            return this.handleResponse(response);
        } catch (error) {
            console.error('POST Request Error:', error);
            throw error;
        }
    }

    async put(endpoint, data) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'PUT',
                headers: await this.getAuthHeader(),
                credentials: 'include',
                body: JSON.stringify(data)
            });
            return this.handleResponse(response);
        } catch (error) {
            console.error('PUT Request Error:', error);
            throw error;
        }
    }

    async delete(endpoint) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'DELETE',
                headers: await this.getAuthHeader(),
                credentials: 'include'
            });
            return this.handleResponse(response);
        } catch (error) {
            console.error('DELETE Request Error:', error);
            throw error;
        }
    }
}

export const apiService = new ApiService(); 