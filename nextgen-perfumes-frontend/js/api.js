// API Integration Layer for NextGen Perfumes
class NextGenAPI {
    constructor() {
        this.baseURL = 'http://localhost:8000/api';
        this.token = localStorage.getItem('auth_token');
    }

    // Helper method for making API requests
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options.headers
            },
            ...options
        };

        if (this.token) {
            config.headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'API request failed');
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Authentication methods
    async register(userData) {
        const response = await this.request('/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        
        if (response.token) {
            this.token = response.token;
            localStorage.setItem('auth_token', this.token);
        }
        
        return response;
    }

    async login(credentials) {
        const response = await this.request('/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
        
        if (response.token) {
            this.token = response.token;
            localStorage.setItem('auth_token', this.token);
        }
        
        return response;
    }

    async logout() {
        await this.request('/logout', { method: 'POST' });
        this.token = null;
        localStorage.removeItem('auth_token');
    }

    // Product methods
    async getProducts(filters = {}) {
        const params = new URLSearchParams(filters);
        return await this.request(`/products?${params}`);
    }

    async getProduct(id) {
        return await this.request(`/products/${id}`);
    }

    // Review methods
    async getReviews() {
        return await this.request('/reviews');
    }

    async createReview(reviewData) {
        return await this.request('/reviews', {
            method: 'POST',
            body: JSON.stringify(reviewData)
        });
    }

    // Contact methods
    async submitContact(contactData) {
        return await this.request('/contacts', {
            method: 'POST',
            body: JSON.stringify(contactData)
        });
    }

    // Newsletter methods
    async subscribeNewsletter(email) {
        return await this.request('/newsletters', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
    }

    // Order methods
    async createOrder(orderData) {
        return await this.request('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    }

    async getOrders() {
        return await this.request('/orders');
    }

    // Utility methods
    isAuthenticated() {
        return !!this.token;
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('auth_token', token);
    }
}

// Create global API instance
window.api = new NextGenAPI();