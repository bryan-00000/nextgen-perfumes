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
            
            // Get raw response text first
            const text = await response.text();
            
            // Log for debugging
            console.log('Response status:', response.status);
            console.log('Response text:', text.substring(0, 500));
            
            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                console.error('Non-JSON response:', text);
                throw new Error(`Server returned non-JSON response: ${text.substring(0, 200)}`);
            }
            
            // Try to parse JSON
            let data;
            try {
                data = JSON.parse(text);
            } catch (parseError) {
                console.error('JSON Parse Error:', parseError);
                console.error('Raw response:', text);
                throw new Error(`Invalid JSON response: ${text.substring(0, 200)}`);
            }
            
            if (!response.ok) {
                throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
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
        const params = new URLSearchParams();
        
        // Default values
        const {
            category = null,
            search = null,
            min_price = null,
            max_price = null,
            brand = null,
            min_rating = null,
            sort_by = 'created_at',
            sort_order = 'desc',
            per_page = 12,
            page = 1
        } = filters;
        
        if (category) params.append('category', category);
        if (search) params.append('search', search);
        if (min_price) params.append('min_price', min_price);
        if (max_price) params.append('max_price', max_price);
        if (brand) params.append('brand', brand);
        if (min_rating) params.append('min_rating', min_rating);
        params.append('sort_by', sort_by);
        params.append('sort_order', sort_order);
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

    async getRandomProducts(category = null, limit = 10) {
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        params.append('limit', limit);
        
        return await this.request(`/products/random?${params}`);
    }

    async getProductOfTheMonth() {
        try {
            const response = await this.getAllProducts();
            const products = response.data || [];
            if (products.length === 0) return null;
            
            // Select random product
            const randomIndex = Math.floor(Math.random() * products.length);
            return products[randomIndex];
        } catch (error) {
            console.error('Error getting product of the month:', error);
            return null;
        }
    }

    // Review methods
    async getReviews(productId = null) {
        const params = productId ? `?product_id=${productId}` : '';
        return await this.request(`/reviews${params}`);
    }

    async createReview(reviewData) {
        return await this.request('/reviews', {
            method: 'POST',
            body: JSON.stringify(reviewData)
        });
    }

    async getUserReviews() {
        return await this.request('/user/reviews');
    }

    async updateReview(id, reviewData) {
        return await this.request(`/reviews/${id}`, {
            method: 'PUT',
            body: JSON.stringify(reviewData)
        });
    }

    async deleteReview(id) {
        return await this.request(`/reviews/${id}`, {
            method: 'DELETE'
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

    async getOrder(id) {
        return await this.request(`/orders/${id}`);
    }

    // Wishlist methods
    async getWishlist() {
        return await this.request('/wishlist');
    }

    async addToWishlist(productId) {
        return await this.request('/wishlist', {
            method: 'POST',
            body: JSON.stringify({ product_id: productId })
        });
    }

    async removeFromWishlist(productId) {
        return await this.request(`/wishlist/${productId}`, {
            method: 'DELETE'
        });
    }

    async checkWishlist(productId) {
        return await this.request(`/wishlist/check/${productId}`);
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
        // Bypass complex request method for debugging
        const response = await fetch(`${this.baseURL}/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': this.token ? `Bearer ${this.token}` : ''
            },
            body: JSON.stringify(productData)
        });
        
        const text = await response.text();
        console.log('Update response:', text.substring(0, 500));
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${text.substring(0, 200)}`);
        }
        
        try {
            return JSON.parse(text);
        } catch (error) {
            throw new Error(`JSON Parse Error: ${text.substring(0, 200)}`);
        }
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