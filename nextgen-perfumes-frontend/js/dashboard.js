// Admin Dashboard JavaScript
class AdminDashboard {
    constructor() {
        this.init();
    }

    async init() {
        await this.loadDashboardData();
        this.setupEventListeners();
    }

    async loadDashboardData() {
        try {
            const data = await window.api.getDashboardStats();
            this.updateStats(data.stats);
            this.updateBestSelling(data.best_selling);
            this.updateRecentOrders(data.recent_orders);
            await this.loadUsers();
        } catch (error) {
            if (error.message === 'Unauthenticated.') {
                window.location.href = 'admin-login.html';
                return;
            }
            console.error('Failed to load dashboard data:', error);
        }
    }

    updateStats(stats) {
        const salesElement = document.querySelector('.counter-value');
        if (salesElement) {
            salesElement.textContent = this.formatCurrency(stats.total_sales);
        }

        const ordersElements = document.querySelectorAll('.counter-value');
        if (ordersElements[1]) {
            ordersElements[1].textContent = stats.total_orders.toLocaleString();
        }

        if (ordersElements[2]) {
            ordersElements[2].textContent = stats.total_customers.toLocaleString();
        }

        if (ordersElements[3]) {
            ordersElements[3].textContent = stats.total_stock.toLocaleString();
        }
    }

    updateBestSelling(products) {
        const tbody = document.getElementById('best-selling-tbody');
        if (!tbody || !products) return;

        tbody.innerHTML = products.map(product => `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="avatar-sm bg-light rounded p-1 me-2">
                            <div class="perfume-icon">${this.getProductIcon(product.category)}</div>
                        </div>
                        <div>
                            <h5 class="fs-14 my-1">${product.name}</h5>
                            <span class="text-muted">${this.getCategoryName(product.category)}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <h5 class="fs-14 my-1 fw-normal">${this.formatCurrency(product.price)}</h5>
                    <span class="text-muted">Price</span>
                </td>
                <td>
                    <h5 class="fs-14 my-1 fw-normal">${product.total_sold || 0}</h5>
                    <span class="text-muted">Sold</span>
                </td>
                <td>
                    <h5 class="fs-14 my-1 fw-normal">${this.getStockBadge(product.stock_quantity)}</h5>
                    <span class="text-muted">Stock</span>
                </td>
                <td>
                    <h5 class="fs-14 my-1 fw-normal">${this.formatCurrency((product.total_sold || 0) * product.price)}</h5>
                    <span class="text-muted">Revenue</span>
                </td>
            </tr>
        `).join('');
    }

    setupEventListeners() {
        const addProductForm = document.getElementById('add-product-form');
        if (addProductForm) {
            addProductForm.addEventListener('submit', this.handleAddProduct.bind(this));
        }

        const editProductForm = document.getElementById('edit-product-form');
        if (editProductForm) {
            editProductForm.addEventListener('submit', this.handleEditProduct.bind(this));
        }

        const addProductBtn = document.getElementById('add-product-btn');
        if (addProductBtn) {
            addProductBtn.addEventListener('click', () => {
                const modal = new bootstrap.Modal(document.getElementById('addProductModal'));
                modal.show();
            });
        }
    }

    async handleAddProduct(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        
        // Handle image upload
        const imageFile = formData.get('image');
        let imageUrl = null;
        
        if (imageFile && imageFile.size > 0) {
            // Create a unique filename
            const fileName = `perfume-${Date.now()}-${imageFile.name}`;
            imageUrl = `uploads/${fileName}`;
            
            // Save the file (in a real app, you'd upload to server)
            // For now, we'll use a data URL as fallback
            const reader = new FileReader();
            reader.onload = function(e) {
                // Store the data URL in localStorage for demo purposes
                localStorage.setItem(`image_${fileName}`, e.target.result);
            };
            reader.readAsDataURL(imageFile);
        }
        
        const productData = {
            name: formData.get('name'),
            description: formData.get('description'),
            category: formData.get('category'),
            price: parseFloat(formData.get('price')),
            stock_quantity: parseInt(formData.get('stock')),
            image_url: imageUrl
        };
        
        // Wait for image processing if file was uploaded
        if (imageFile && imageFile.size > 0) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        try {
            await window.api.createProduct(productData);
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
            modal.hide();
            
            event.target.reset();
            await this.loadDashboardData();
            await loadAllProducts();
            
            this.showNotification('Product added successfully!', 'success');
        } catch (error) {
            if (error.message === 'Unauthenticated.') {
                alert('Session expired. Please login again.');
                window.location.href = 'admin-login.html';
                return;
            }
            this.showNotification('Failed to add product: ' + error.message, 'error');
        }
    }

    async handleEditProduct(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const productId = formData.get('id');
        
        const productData = {
            name: formData.get('name'),
            description: formData.get('description'),
            category: formData.get('category'),
            price: parseFloat(formData.get('price')),
            stock_quantity: parseInt(formData.get('stock_quantity'))
        };

        try {
            await window.api.updateProduct(productId, productData);
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
            modal.hide();
            
            await this.loadDashboardData();
            await loadAllProducts();
            
            this.showNotification('Product updated successfully!', 'success');
        } catch (error) {
            this.showNotification('Failed to update product: ' + error.message, 'error');
        }
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    getProductIcon(category) {
        const icons = {
            'womens': '🌹',
            'mens': '🍊',
            'unisex': '🌙',
            'gift_sets': '🎁'
        };
        return icons[category] || '💎';
    }

    getCategoryName(category) {
        const names = {
            'womens': "Women's Collection",
            'mens': "Men's Collection", 
            'unisex': 'Unisex Collection',
            'gift_sets': 'Gift Sets'
        };
        return names[category] || 'Collection';
    }

    getStockBadge(quantity) {
        if (quantity < 10) {
            return '<span class="badge bg-danger-subtle text-danger">Low Stock</span>';
        }
        return quantity.toString();
    }

    showNotification(message, type) {
        const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
        const alertHtml = `
            <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        const container = document.querySelector('.container-fluid');
        if (container) {
            container.insertAdjacentHTML('afterbegin', alertHtml);
            
            setTimeout(() => {
                const alert = container.querySelector('.alert');
                if (alert) alert.remove();
            }, 5000);
        }
    }
}

// Global functions for user management
async function loadUsers() {
    try {
        const users = await window.api.getUsers();
        updateUsersTable(users);
    } catch (error) {
        console.error('Failed to load users:', error);
    }
}

function updateUsersTable(users) {
    const tbody = document.getElementById('users-tbody');
    if (!tbody) return;

    tbody.innerHTML = users.map(user => `
        <tr>
            <td>
                <div class="d-flex align-items-center">
                    <div class="flex-shrink-0 me-2">
                        <div class="avatar-xs rounded-circle bg-primary text-white d-flex align-items-center justify-content-center">
                            ${user.username.charAt(0).toUpperCase()}
                        </div>
                    </div>
                    <div class="flex-grow-1">${user.username}</div>
                </div>
            </td>
            <td>${user.email}</td>
            <td>${user.is_suspended ? '<span class="badge bg-danger-subtle text-danger">Suspended</span>' : '<span class="badge bg-success-subtle text-success">Active</span>'}</td>
            <td>${user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}</td>
            <td>
                <button class="btn btn-sm btn-soft-warning me-1" onclick="suspendUser(${user.id})">
                    ${user.is_suspended ? 'Unsuspend' : 'Suspend'}
                </button>
                <button class="btn btn-sm btn-soft-danger" onclick="forceLogoutUser(${user.id})">
                    Force Logout
                </button>
            </td>
        </tr>
    `).join('');
}

async function suspendUser(userId) {
    try {
        await window.api.suspendUser(userId);
        await loadUsers();
    } catch (error) {
        alert('Failed to suspend user: ' + error.message);
    }
}

async function forceLogoutUser(userId) {
    try {
        await window.api.forceLogoutUser(userId);
        await loadUsers();
        alert('User logged out successfully');
    } catch (error) {
        alert('Failed to logout user: ' + error.message);
    }
}

// Products management functions
async function loadAllProducts() {
    try {
        const response = await window.api.getAllProducts();
        updateProductsTable(response.data);
    } catch (error) {
        console.error('Failed to load products:', error);
    }
}

function updateProductsTable(products) {
    const tbody = document.getElementById('products-tbody');
    if (!tbody) return;

    tbody.innerHTML = products.map(product => `
        <tr>
            <td>
                <div class="d-flex align-items-center">
                    <div class="avatar-sm bg-light rounded p-1 me-2">
                        <div class="perfume-icon">${getProductIcon(product.category)}</div>
                    </div>
                    <div>
                        <h5 class="fs-14 my-1">${product.name}</h5>
                        <span class="text-muted">${product.description || 'No description'}</span>
                    </div>
                </div>
            </td>
            <td><span class="badge bg-info-subtle text-info">${getCategoryName(product.category)}</span></td>
            <td><span class="fw-semibold">$${product.price}</span></td>
            <td>
                <span class="${product.stock_quantity < 10 ? 'text-danger fw-bold' : 'text-success'}">
                    ${product.stock_quantity} units
                </span>
            </td>
            <td>
                ${product.stock_quantity < 10 ? 
                    '<span class="badge bg-danger-subtle text-danger">Low Stock</span>' : 
                    '<span class="badge bg-success-subtle text-success">In Stock</span>'
                }
            </td>
            <td>
                <button class="btn btn-sm btn-soft-primary me-1" onclick="editProduct(${product.id})">
                    <i class="ri-edit-line"></i>
                </button>
                <button class="btn btn-sm btn-soft-danger" onclick="deleteProduct(${product.id})">
                    <i class="ri-delete-bin-line"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function getProductIcon(category) {
    const icons = {
        'womens': '🌹',
        'mens': '🍊', 
        'unisex': '🌙',
        'gift_sets': '🎁'
    };
    return icons[category] || '💎';
}

function getCategoryName(category) {
    const names = {
        'womens': "Women's",
        'mens': "Men's",
        'unisex': 'Unisex',
        'gift_sets': 'Gift Sets'
    };
    return names[category] || 'Other';
}

async function editProduct(productId) {
    try {
        const product = await window.api.getProduct(productId);
        
        document.getElementById('edit-product-id').value = product.id;
        document.getElementById('edit-product-name').value = product.name;
        document.getElementById('edit-product-description').value = product.description || '';
        document.getElementById('edit-product-category').value = product.category;
        document.getElementById('edit-product-price').value = product.price;
        document.getElementById('edit-product-stock').value = product.stock_quantity;
        
        const modal = new bootstrap.Modal(document.getElementById('editProductModal'));
        modal.show();
    } catch (error) {
        alert('Failed to load product: ' + error.message);
    }
}

async function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        try {
            await window.api.deleteProduct(productId);
            await loadAllProducts();
            showNotification('Product deleted successfully', 'success');
        } catch (error) {
            showNotification('Failed to delete product: ' + error.message, 'error');
        }
    }
}

function showNotification(message, type) {
    const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
    const alertHtml = `
        <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    const container = document.querySelector('.container-fluid');
    if (container) {
        container.insertAdjacentHTML('afterbegin', alertHtml);
        setTimeout(() => {
            const alert = container.querySelector('.alert');
            if (alert) alert.remove();
        }, 5000);
    }
}

// Admin logout function
async function adminLogout() {
    try {
        await window.api.logout();
        window.location.href = 'admin-login.html';
    } catch (error) {
        console.error('Logout error:', error);
        // Force logout even if API call fails
        localStorage.removeItem('auth_token');
        window.location.href = 'admin-login.html';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AdminDashboard();
    loadAllProducts();
});