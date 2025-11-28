// Shared product functions for all pages

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

function addToCart(productId, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: event.target.closest('.product-item').querySelector('h4').textContent,
            price: price,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    showNotification('Product added to cart!');
    updateCartCount();
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartIcon = document.querySelector('.nav-icons a[title="Cart"]');
    if (cartIcon && totalItems > 0) {
        cartIcon.style.position = 'relative';
        let badge = cartIcon.querySelector('.cart-badge');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'cart-badge';
            cartIcon.appendChild(badge);
        }
        badge.textContent = totalItems;
    }
}

// Product loading with pagination
let currentPage = 1;
let isLoading = false;
let hasMoreProducts = true;
let currentSort = '';
let currentCategory = '';
let totalProducts = 0;
let displayedProducts = 0;

async function loadMoreProducts(category, perPage = 6) {
    if (isLoading || !hasMoreProducts) return;
    
    if (!window.api) {
        showNotification('API not loaded. Please refresh the page.');
        return;
    }
    
    isLoading = true;
    const loadMoreBtn = document.querySelector('button[onclick*="loadMoreProducts"]');
    const originalText = loadMoreBtn.innerHTML;
    loadMoreBtn.innerHTML = '<i class="bi bi-arrow-clockwise spin"></i> Loading...';
    loadMoreBtn.disabled = true;
    
    try {
        currentPage++;
        const response = await window.api.getProducts(category, perPage, currentPage);
        
        if (response.data && response.data.length > 0) {
            displayProducts(response.data, category);
            
            if (response.current_page >= response.last_page) {
                hasMoreProducts = false;
                loadMoreBtn.style.display = 'none';
            }
        } else {
            hasMoreProducts = false;
            loadMoreBtn.style.display = 'none';
        }
    } catch (error) {
        console.error('Error loading products:', error);
        showNotification(`Error: ${error.message}`);
        currentPage--;
    } finally {
        isLoading = false;
        loadMoreBtn.innerHTML = originalText;
        loadMoreBtn.disabled = false;
    }
}

function displayProducts(products, category) {
    const productsContainer = document.querySelector('.products');
    const fallbackImages = {
        mens: ['images/perfume 1.jpg', 'images/perfume 4.jpg', 'images/perfume 5.jpg', 'images/perfume 6.jpg', 'images/perfume 10.jpg', 'images/perfume 11.jpg'],
        womens: ['images/perfume 3.jpg', 'images/perfume 7.jpg', 'images/perfume 9.jpg', 'images/perfume 2.jpg', 'images/perfume 8.jpg', 'images/perfume 11.jpg'],
        unisex: ['images/perfume 2.jpg', 'images/perfume 5.jpg', 'images/perfume 8.jpg'],
        gift_sets: ['images/perfume 1.jpg', 'images/perfume 2.jpg', 'images/perfume 3.jpg']
    };
    
    const images = fallbackImages[category] || fallbackImages.mens;
    
    products.forEach((product, index) => {
        const productElement = document.createElement('div');
        productElement.className = 'product-item';
        
        const imageUrl = product.full_image_url || product.image_url || images[index % images.length];
        
        productElement.innerHTML = `
            <div class="product-image" onclick="viewProduct(${product.id})">
                <img src="${imageUrl}" alt="${product.name}" onerror="this.src='${images[index % images.length]}'">
                <div class="product-badge">
                    <i class="bi bi-star-fill"></i> ${product.average_rating || product.rating || '4.5'}
                </div>
            </div>
            <div class="product-details">
                <h4>${product.name}</h4>
                <p>${product.description || 'Premium fragrance'}</p>
                <div class="product-price">
                    <span>$${product.price}</span>
                </div>
                <div class="product-actions">
                    <button class="btn btn-primary" onclick="event.stopPropagation(); addToCart('${product.id}', ${product.price})">
                        <i class="bi bi-bag-plus"></i>
                        Add to Cart
                    </button>
                    <button class="btn btn-wishlist" onclick="event.stopPropagation(); toggleWishlist(${product.id})" title="Add to Wishlist">
                        <i class="bi bi-heart"></i>
                    </button>
                </div>
            </div>
        `;
        
        productElement.style.cursor = 'pointer';
        productElement.onclick = () => viewProduct(product.id);
        
        productsContainer.appendChild(productElement);
    });
}

// Newsletter form handler
function initNewsletterForm() {
    const form = document.querySelector('.newsletter form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Thank you for subscribing!');
            this.reset();
        });
    }
}

// Sorting and filtering functions
function initializeFilters() {
    const sortSelect = document.querySelector('select');
    const categorySelect = document.querySelectorAll('select')[1];
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentSort = this.value;
            resetAndReload();
        });
    }
    
    if (categorySelect) {
        categorySelect.addEventListener('change', function() {
            currentCategory = this.value === 'All Categories' ? '' : this.value;
            resetAndReload();
        });
    }
}

function resetAndReload() {
    currentPage = 1;
    hasMoreProducts = true;
    const productsContainer = document.querySelector('.products');
    if (productsContainer) {
        productsContainer.innerHTML = '';
    }
    
    const pageCategory = getPageCategory();
    loadProducts(pageCategory);
}

function getPageCategory() {
    const path = window.location.pathname;
    if (path.includes('mensperfume')) return 'mens';
    if (path.includes('womensperfume')) return 'womens';
    if (path.includes('unisexperfume')) return 'unisex';
    if (path.includes('giftsets')) return 'gift_sets';
    return '';
}

async function loadProducts(category, perPage = 12) {
    if (isLoading) return;
    
    isLoading = true;
    const loadMoreBtn = document.querySelector('button[onclick*="loadMoreProducts"]');
    if (loadMoreBtn) {
        loadMoreBtn.innerHTML = '<i class="bi bi-arrow-clockwise spin"></i> Loading...';
        loadMoreBtn.disabled = true;
    }
    
    try {
        const params = {
            category: category,
            per_page: perPage,
            page: currentPage
        };
        
        if (currentSort) {
            if (currentSort === 'Low to High') params.sort = 'price_asc';
            if (currentSort === 'High to Low') params.sort = 'price_desc';
        }
        
        const response = await window.api.getProducts(params);
        
        if (currentPage === 1) {
            totalProducts = response.total || response.data.length;
            displayedProducts = 0;
            // Clear loading text
            const productsContainer = document.querySelector('.products');
            if (productsContainer) {
                productsContainer.innerHTML = '';
            }
        }
        
        if (response.data && response.data.length > 0) {
            displayProducts(response.data, category);
            displayedProducts += response.data.length;
            updateProductInfo();
            
            if (response.current_page >= response.last_page) {
                hasMoreProducts = false;
                if (loadMoreBtn) loadMoreBtn.style.display = 'none';
            }
        } else {
            hasMoreProducts = false;
            if (loadMoreBtn) loadMoreBtn.style.display = 'none';
        }
    } catch (error) {
        console.error('Error loading products:', error);
        showNotification(`Error: ${error.message}`);
    } finally {
        isLoading = false;
        if (loadMoreBtn) {
            loadMoreBtn.innerHTML = 'Load More Products';
            loadMoreBtn.disabled = false;
        }
    }
}

function updateProductInfo() {
    const filterInfo = document.querySelector('.filter-info');
    if (filterInfo) {
        const startNum = Math.min(1, displayedProducts);
        const endNum = displayedProducts;
        filterInfo.textContent = `Showing ${startNum}-${endNum} of ${totalProducts} products`;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    initNewsletterForm();
    initializeFilters();
});
