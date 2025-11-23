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
            
            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('Non-JSON response:', text);
                throw new Error('Server returned non-JSON response');
            }
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
            }
            
            return data;
        } catch (error) {
            if (error instanceof SyntaxError) {
                console.error('JSON Parse Error:', error);
                throw new Error('Invalid JSON response from server');
            }
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
    async getProducts(category = null, per_page = 12, page = 1) {
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        params.append('per_page', per_page);
        params.append('page', page);
        return await this.request(`/products?${params}`);
    }

    async getProduct(id) {
        return await this.request(`/products/${id}`);
    }

    async getAllProducts() {
        return await this.request('/products?per_page=100');
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

    // Admin methods
    async getDashboardStats() {
        return await this.request('/admin/dashboard');
    }

    async createProduct(productData) {
        return await this.request('/products', {
            method: 'POST',
            body: JSON.stringify(productData)
        });
    }

    async updateProduct(id, productData) {
        return await this.request(`/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(productData)
        });
    }

    async deleteProduct(id) {
        return await this.request(`/products/${id}`, {
            method: 'DELETE'
        });
    }

    // User management methods
    async getUsers() {
        return await this.request('/admin/users');
    }

    async suspendUser(userId) {
        return await this.request(`/admin/users/${userId}/suspend`, {
            method: 'POST'
        });
    }

    async forceLogoutUser(userId) {
        return await this.request(`/admin/users/${userId}/logout`, {
            method: 'POST'
        });
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