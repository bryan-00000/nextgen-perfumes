// Frontend form validation
class FormValidator {
    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    static validatePassword(password) {
        // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return re.test(password);
    }

    static validateUsername(username) {
        // Alphanumeric and underscore only, 3-20 chars
        const re = /^[a-zA-Z0-9_]{3,20}$/;
        return re.test(username);
    }

    static validateRequired(value) {
        return value && value.trim().length > 0;
    }

    static showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorDiv = document.getElementById(fieldId + '-error') || this.createErrorDiv(fieldId);
        
        field.classList.add('error');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }

    static clearError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorDiv = document.getElementById(fieldId + '-error');
        
        if (field) field.classList.remove('error');
        if (errorDiv) errorDiv.style.display = 'none';
    }

    static createErrorDiv(fieldId) {
        const errorDiv = document.createElement('div');
        errorDiv.id = fieldId + '-error';
        errorDiv.className = 'error-message';
        errorDiv.style.color = 'red';
        errorDiv.style.fontSize = '14px';
        errorDiv.style.marginTop = '5px';
        
        const field = document.getElementById(fieldId);
        field.parentNode.insertBefore(errorDiv, field.nextSibling);
        
        return errorDiv;
    }

    static validateLoginForm(formData) {
        const errors = {};
        
        if (!this.validateRequired(formData.username)) {
            errors.username = 'Username is required';
        }
        
        if (!this.validateRequired(formData.password)) {
            errors.password = 'Password is required';
        }
        
        return errors;
    }

    static validateSignupForm(formData) {
        const errors = {};
        
        if (!this.validateRequired(formData.name)) {
            errors.name = 'Name is required';
        }
        
        if (!this.validateUsername(formData.username)) {
            errors.username = 'Username must be 3-20 characters, letters, numbers, and underscores only';
        }
        
        if (!this.validateEmail(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }
        
        if (!this.validatePassword(formData.password)) {
            errors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
        }
        
        if (formData.password !== formData.password_confirmation) {
            errors.password_confirmation = 'Passwords do not match';
        }
        
        return errors;
    }
}

window.FormValidator = FormValidator;