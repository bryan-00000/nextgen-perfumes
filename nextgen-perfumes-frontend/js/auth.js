// Authentication functionality for NextGen Perfumes

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login_form');
    const signupForm = document.querySelector('.signup_form');
    
    // Handle login form
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (!username || !password) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            try {
                const response = await window.api.login({ username, password });
                showNotification('Login successful!', 'success');
                
                // Redirect to home page after successful login
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
                
            } catch (error) {
                showNotification('Invalid credentials. Please try again.', 'error');
            }
        });
    }
    
    // Handle signup form
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm_password').value;
            
            if (!username || !email || !password || !confirmPassword) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }
            
            if (password.length < 6) {
                showNotification('Password must be at least 6 characters', 'error');
                return;
            }
            
            try {
                const response = await window.api.register({ username, email, password });
                showNotification('Registration successful!', 'success');
                
                // Redirect to home page after successful registration
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
                
            } catch (error) {
                showNotification('Registration failed. Username or email may already exist.', 'error');
            }
        });
    }
    
    // Update UI based on authentication status
    updateAuthUI();
});

function updateAuthUI() {
    const isAuthenticated = window.api.isAuthenticated();
    const userIcon = document.querySelector('.nav-icons a[href="#"]:nth-child(2)');
    
    if (userIcon) {
        if (isAuthenticated) {
            userIcon.innerHTML = '👤';
            userIcon.onclick = () => logout();
            userIcon.title = 'Logout';
        } else {
            userIcon.innerHTML = '👤';
            userIcon.onclick = () => showLoginForm();
            userIcon.title = 'Login';
        }
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        z-index: 1000;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
}

function showLoginForm() {
    window.location.href = 'login.html';
}

function logout() {
    window.api.logout();
    showNotification('Logged out successfully!', 'success');
    setTimeout(() => window.location.reload(), 1000);
}