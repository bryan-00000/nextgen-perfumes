// Cart Management System
class CartManager {
    constructor() {
        this.cart = this.loadCart();
    }

    loadCart() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartCount();
    }

    addToCart(productId, price, name, imageUrl = null) {
        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: productId,
                name: name,
                price: parseFloat(price),
                quantity: 1,
                image: imageUrl
            });
        }
        
        this.saveCart();
        this.showNotification('Product added to cart!');
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
    }

    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = parseInt(quantity);
            if (item.quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                this.saveCart();
            }
        }
    }

    getTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
    }

    updateCartCount() {
        const totalItems = this.getItemCount();
        const cartIcons = document.querySelectorAll('.nav-icons a[title="Cart"]');
        
        cartIcons.forEach(cartIcon => {
            if (totalItems > 0) {
                cartIcon.style.position = 'relative';
                let badge = cartIcon.querySelector('.cart-badge');
                if (!badge) {
                    badge = document.createElement('span');
                    badge.className = 'cart-badge';
                    badge.style.cssText = `
                        position: absolute; top: -8px; right: -8px; background: #dc1212; color: white;
                        border-radius: 50%; width: 18px; height: 18px; font-size: 0.7rem;
                        display: flex; align-items: center; justify-content: center; font-weight: bold;
                    `;
                    cartIcon.appendChild(badge);
                }
                badge.textContent = totalItems;
            } else {
                const badge = cartIcon.querySelector('.cart-badge');
                if (badge) badge.remove();
            }
        });
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; background: #28a745; color: white;
            padding: 1rem 1.5rem; border-radius: 5px; z-index: 10000; 
            animation: slideIn 0.3s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    isUserLoggedIn() {
        return !!localStorage.getItem('auth_token');
    }

    proceedToCheckout() {
        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty!');
            return;
        }

        if (!this.isUserLoggedIn()) {
            // Store current page for redirect after login
            localStorage.setItem('redirect_after_login', 'checkout.html');
            window.location.href = 'login.html';
        } else {
            // User is logged in, proceed to payment (placeholder for now)
            this.showNotification('Redirecting to payment platform...');
            setTimeout(() => {
                alert('Payment platform integration will be added here');
            }, 1000);
        }
    }
}

// Global cart instance
window.cartManager = new CartManager();

// Global functions for backward compatibility
function addToCart(productId, price, name = null, imageUrl = null) {
    // Get product name from DOM if not provided
    if (!name && event && event.target) {
        const productItem = event.target.closest('.product-item');
        if (productItem) {
            const nameElement = productItem.querySelector('h4');
            name = nameElement ? nameElement.textContent : `Product ${productId}`;
        }
    }
    
    window.cartManager.addToCart(productId, price, name || `Product ${productId}`, imageUrl);
}

function updateCartCount() {
    window.cartManager.updateCartCount();
}

function showNotification(message) {
    window.cartManager.showNotification(message);
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', function() {
    window.cartManager.updateCartCount();
    
    // Handle redirect after login
    const redirectUrl = localStorage.getItem('redirect_after_login');
    if (redirectUrl && window.cartManager.isUserLoggedIn()) {
        localStorage.removeItem('redirect_after_login');
        if (window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html')) {
            window.location.href = redirectUrl;
        }
    }
});