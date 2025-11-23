// CSRF Token Management
class CSRFManager {
    static async getToken() {
        try {
            const response = await fetch('/sanctum/csrf-cookie');
            const cookies = document.cookie.split(';');
            
            for (let cookie of cookies) {
                const [name, value] = cookie.trim().split('=');
                if (name === 'XSRF-TOKEN') {
                    return decodeURIComponent(value);
                }
            }
        } catch (error) {
            console.warn('Could not fetch CSRF token:', error);
        }
        return null;
    }

    static async setTokenInForm(formId) {
        const token = await this.getToken();
        const tokenInput = document.querySelector(`#${formId} input[name="_token"]`);
        
        if (token && tokenInput) {
            tokenInput.value = token;
        }
    }

    static addToHeaders(headers = {}) {
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        
        if (token) {
            headers['X-CSRF-TOKEN'] = token;
        }
        
        return headers;
    }
}

// Auto-set CSRF tokens on page load
document.addEventListener('DOMContentLoaded', () => {
    CSRFManager.setTokenInForm('login-form');
    CSRFManager.setTokenInForm('signup-form');
});

window.CSRFManager = CSRFManager;