// Enhanced functionality with API integration for NextGen Perfumes

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const reviewForm = document.getElementById('reviewForm');
    const reviewsList = document.getElementById('reviewsList');
    const newsletterForm = document.querySelector('.newsletter form');

    // Load initial data
    loadProducts();
    loadReviews();

    // Handle contact form submission with API
    if (contactForm) {
        contactForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"], input[type="submit"]');
            if (submitBtn) submitBtn.disabled = true;

            const formData = new FormData(contactForm);
            const contactData = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                message: formData.get('message')
            };

            if (validateContactForm(contactData.email, contactData.phone)) {
                try {
                    await window.api.submitContact(contactData);
                    showNotification('Thank you for contacting us! We\'ll get back to you soon.', 'success');
                    contactForm.reset();
                } catch (error) {
                    // Log detailed error for developers, but show a generic message to users
                    console.error('Contact form submission failed:', error);
                    showNotification('Failed to send message. Please try again later.', 'error');
                } finally {
                    if (submitBtn) submitBtn.disabled = false;
                }
            } else {
                if (submitBtn) submitBtn.disabled = false;
                showNotification('Please enter valid email and phone number.', 'error');
            }
        });
    }

    // Handle newsletter subscription
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            
            try {
                await window.api.subscribeNewsletter(email);
                showNotification('Successfully subscribed to newsletter!', 'success');
                newsletterForm.reset();
            } catch (error) {
                showNotification('Failed to subscribe. Please try again.', 'error');
            }
        });
    }

    // Handle review form submission with API
    if (reviewForm) {
        reviewForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const rating = document.getElementById('rating').value;
            const comment = document.getElementById('comment').value.trim();
            const productId = document.getElementById('product_id')?.value || 1;

            if (name && rating && comment) {
                try {
                    const reviewData = {
                        name,
                        rating: parseInt(rating),
                        comment,
                        product_id: parseInt(productId)
                    };
                    
                    await window.api.createReview(reviewData);
                    showNotification('Review submitted successfully!', 'success');
                    reviewForm.reset();
                    loadReviews(); // Reload reviews
                } catch (error) {
                    if (error.message.includes('Unauthenticated')) {
                        showNotification('Please login to submit a review.', 'error');
                    } else {
                        showNotification('Failed to submit review. Please try again.', 'error');
                    }
                }
            }
        });
    }

    // Load products from API
    async function loadProducts() {
        try {
            const products = await window.api.getProducts();
            displayProducts(products);
        } catch (error) {
            console.error('Failed to load products:', error);
        }
    }

    // Load reviews from API
    async function loadReviews() {
        try {
            const reviews = await window.api.getReviews();
            displayReviews(reviews);
        } catch (error) {
            console.error('Failed to load reviews:', error);
        }
    }

    // Display products in the UI
    function displayProducts(products) {
        const productsContainer = document.querySelector('.products');
        if (!productsContainer || !products.length) return;

        productsContainer.innerHTML = '';
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product-item';
            
            const productImage = document.createElement('div');
            productImage.className = 'product';
            // encode URI to reduce risk of injection via image URLs
            const rawUrl = product.image_url || 'images/perfume-default.jpg';
            try {
                productImage.style.backgroundImage = `url("${encodeURI(String(rawUrl))}")`;
            } catch (e) {
                productImage.style.backgroundImage = `url("images/perfume-default.jpg")`;
            }
            
            const productName = document.createElement('h4');
            productName.textContent = product.name || 'Unnamed product';
            
            const productPrice = document.createElement('p');
            productPrice.textContent = `$${product.price}`;
            
            const addButton = document.createElement('a');
            addButton.href = '#';
            addButton.className = 'btn';
            addButton.textContent = 'Add to Cart';
            addButton.onclick = () => addToCart(product.id);
            
            productDiv.appendChild(productImage);
            productDiv.appendChild(productName);
            productDiv.appendChild(productPrice);
            productDiv.appendChild(addButton);
            
            productsContainer.appendChild(productDiv);
        });
    }

    // Display reviews in the UI
    function displayReviews(reviews) {
        if (!reviewsList || !reviews.length) return;

        reviewsList.innerHTML = '';
        reviews.forEach(review => {
            const reviewDiv = document.createElement('div');
            reviewDiv.className = 'review';
            
            const nameDiv = document.createElement('div');
            nameDiv.className = 'name';
            nameDiv.textContent = review.name || 'Anonymous';
            
            const ratingDiv = document.createElement('div');
            ratingDiv.className = 'rating';
            const rating = Math.max(0, Math.min(5, parseInt(review.rating, 10) || 0));
            ratingDiv.textContent = '★'.repeat(rating) + '☆'.repeat(5 - rating);
            
            const commentDiv = document.createElement('div');
            commentDiv.className = 'comment';
            commentDiv.textContent = review.comment || '';
            
            reviewDiv.appendChild(nameDiv);
            reviewDiv.appendChild(ratingDiv);
            reviewDiv.appendChild(commentDiv);
            
            reviewsList.appendChild(reviewDiv);
        });
    }

    // Utility functions
    function validateContactForm(email, phone) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phonePattern = /^[\d\s\-\+\(\)]{10,}$/;
        return emailPattern.test(email) && phonePattern.test(phone);
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
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

    // Make functions globally available
    window.addToCart = function(productId) {
        // Add to cart functionality
        showNotification('Product added to cart!', 'success');
    };
});

// Authentication functions
function showLoginForm() {
    window.location.href = 'login.html';
}

function logout() {
    window.api.logout();
    showNotification('Logged out successfully!', 'success');
    setTimeout(() => window.location.reload(), 1000);
}