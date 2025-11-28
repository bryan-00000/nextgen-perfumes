// Home page specific JavaScript

function viewProduct(id) {
    window.location.href = `product-detail.html?id=${id}`;
}

async function toggleWishlist(productId) {
    if (!api.isAuthenticated()) {
        alert('Please login to add items to wishlist');
        window.location.href = 'login.html';
        return;
    }
    
    try {
        const response = await api.checkWishlist(productId);
        const btn = event.target.closest('button');
        const icon = btn.querySelector('i');
        
        if (response.in_wishlist) {
            await api.removeFromWishlist(productId);
            icon.className = 'bi bi-heart';
            btn.style.background = 'white';
            btn.style.color = '#dc1212';
        } else {
            await api.addToWishlist(productId);
            icon.className = 'bi bi-heart-fill';
            btn.style.background = '#dc1212';
            btn.style.color = 'white';
        }
    } catch (error) {
        console.error('Wishlist error:', error);
        alert('Error updating wishlist');
    }
}

async function loadProducts() {
    try {
        const response = await api.getProducts({ per_page: 50 });
        const allProducts = response.data || [];
        
        if (allProducts.length === 0) {
            document.getElementById('best-sellers-products').innerHTML = '<p>No products available.</p>';
            document.getElementById('spotlight-product').innerHTML = '<p>No featured product available.</p>';
            return;
        }
        
        // Group by category and get random from each
        const byCategory = {
            mens: allProducts.filter(p => p.category === 'mens'),
            womens: allProducts.filter(p => p.category === 'womens'),
            unisex: allProducts.filter(p => p.category === 'unisex'),
            gift_sets: allProducts.filter(p => p.category === 'gift_sets')
        };
        
        const randomProducts = [];
        Object.values(byCategory).forEach(products => {
            if (products.length > 0) {
                const shuffled = products.sort(() => 0.5 - Math.random());
                randomProducts.push(...shuffled.slice(0, 3));
            }
        });
        
        const finalProducts = randomProducts.sort(() => 0.5 - Math.random()).slice(0, 12);
        
        // Display products
        document.getElementById('best-sellers-products').innerHTML = finalProducts.map(product => {
            const imageUrl = product.full_image_url || 'images/perfume 1.jpg';
            return `
                <div class="product-item" onclick="viewProduct(${product.id})" style="cursor: pointer;">
                    <div class="product" style="background-image: url('${imageUrl}'); background-size: cover; background-position: center; height: 200px; border-radius: 8px;"></div>
                    <h4>${product.name}</h4>
                    <p>$${product.price}</p>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn" onclick="event.stopPropagation(); addToCart('${product.id}', ${product.price})" style="flex: 1;">Add to Cart</button>
                        <button onclick="event.stopPropagation(); toggleWishlist(${product.id})" style="padding: 0.75rem; border: 2px solid #dc1212; background: white; color: #dc1212; border-radius: 4px; cursor: pointer;" title="Add to Wishlist">
                            <i class="bi bi-heart"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        // Random product of the month
        const randomIndex = Math.floor(Math.random() * allProducts.length);
        const spotlightProduct = allProducts[randomIndex];
        const spotlightImageUrl = spotlightProduct.full_image_url || 'images/perfume 1.jpg';
        
        document.getElementById('spotlight-product').innerHTML = `
            <div class="spotlight-card" onclick="viewProduct(${spotlightProduct.id})" style="cursor: pointer;">
                <div class="spotlight" style="background-image: url('${spotlightImageUrl}'); background-size: cover; background-position: center; height: 300px; border-radius: 8px;"></div>
                <h3>${spotlightProduct.name} – Product of the Month</h3>
                <p>$${spotlightProduct.price}</p>
                <div style="display: flex; gap: 0.5rem; padding: 0 1rem 1rem;">
                    <button class="btn" onclick="event.stopPropagation(); addToCart('${spotlightProduct.id}', ${spotlightProduct.price})" style="flex: 1;">Add to Cart</button>
                    <button onclick="event.stopPropagation(); toggleWishlist(${spotlightProduct.id})" style="padding: 0.75rem; border: 2px solid #dc1212; background: white; color: #dc1212; border-radius: 4px; cursor: pointer;" title="Add to Wishlist">
                        <i class="bi bi-heart"></i>
                    </button>
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('best-sellers-products').innerHTML = '<p>Error loading products.</p>';
        document.getElementById('spotlight-product').innerHTML = '<p>Error loading featured product.</p>';
    }
}

function addToCart(productId, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: event.target.closest('.product-item, .spotlight-card').querySelector('h4, h3').textContent.replace(' – Product of the Month', ''),
            price: price,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Product added to cart!');
}

// Slideshow functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
}

function changeSlide(direction) {
    currentSlide += direction;
    if (currentSlide >= totalSlides) currentSlide = 0;
    if (currentSlide < 0) currentSlide = totalSlides - 1;
    showSlide(currentSlide);
}

// Auto-advance slideshow every 5 seconds
setInterval(() => {
    changeSlide(1);
}, 5000);

// Newsletter form
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    
    const newsletterForm = document.querySelector('.newsletter form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for subscribing!');
            this.reset();
        });
    }
});
