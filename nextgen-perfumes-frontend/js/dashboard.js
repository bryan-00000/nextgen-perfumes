// Dashboard JavaScript for NextGen Perfumes Admin
class PerfumeDashboard {
    constructor() {
        this.apiBase = 'http://localhost:8000/api';
        this.init();
    }

    init() {
        this.animateCounters();
        this.loadDashboardData();
        this.setupEventListeners();
    }

    // Animate counter values
    animateCounters() {
        const counters = document.querySelectorAll('.counter-value');
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/,/g, ''));
            const increment = target / 100;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target.toLocaleString();
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current).toLocaleString();
                }
            }, 20);
        });
    }

    // Load dashboard data from API
    async loadDashboardData() {
        try {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                console.log('No auth token found');
                return;
            }

            // Load recent orders
            await this.loadRecentOrders();
            
            // Load product stats
            await this.loadProductStats();
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    // Load recent orders
    async loadRecentOrders() {
        try {
            const response = await fetch(`${this.apiBase}/orders`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                const orders = await response.json();
                this.updateOrdersTable(orders.data || []);
            }
        } catch (error) {
            console.error('Error loading orders:', error);
        }
    }

    // Load product statistics
    async loadProductStats() {
        try {
            const response = await fetch(`${this.apiBase}/products`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                const products = await response.json();
                this.updateProductStats(products.data || []);
            }
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }

    // Update orders table with real data
    updateOrdersTable(orders) {
        const tbody = document.querySelector('table tbody');
        if (!tbody || orders.length === 0) return;

        tbody.innerHTML = orders.slice(0, 5).map(order => `
            <tr>
                <td><a href="#" class="fw-medium link-primary">#NG${order.id}</a></td>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="flex-shrink-0 me-2">
                            <div class="avatar-xs rounded-circle bg-primary text-white d-flex align-items-center justify-content-center">
                                ${order.customer_name ? order.customer_name.charAt(0).toUpperCase() : 'U'}
                            </div>
                        </div>
                        <div class="flex-grow-1">${order.customer_name || 'Unknown Customer'}</div>
                    </div>
                </td>
                <td>${order.product_name || 'Product'}</td>
                <td><span class="text-success">$${order.total_amount || '0.00'}</span></td>
                <td><span class="badge ${this.getStatusBadgeClass(order.status)}">${order.status || 'Pending'}</span></td>
                <td>${this.formatDate(order.created_at)}</td>
            </tr>
        `).join('');
    }

    // Update product statistics
    updateProductStats(products) {
        // Calculate category distribution
        const categories = {
            'Men': products.filter(p => p.category === 'men').length,
            'Women': products.filter(p => p.category === 'women').length,
            'Unisex': products.filter(p => p.category === 'unisex').length,
            'Gift Sets': products.filter(p => p.category === 'gift-sets').length
        };

        const total = Object.values(categories).reduce((sum, count) => sum + count, 0);
        
        if (total > 0) {
            this.updateCategoryProgress(categories, total);
        }
    }

    // Update category progress bars
    updateCategoryProgress(categories, total) {
        const categoryItems = document.querySelectorAll('.category-item');
        const categoryNames = ['Women\'s Perfumes', 'Men\'s Perfumes', 'Unisex Perfumes', 'Gift Sets'];
        const categoryKeys = ['Women', 'Men', 'Unisex', 'Gift Sets'];

        categoryItems.forEach((item, index) => {
            const percentage = Math.round((categories[categoryKeys[index]] / total) * 100);
            const percentageSpan = item.querySelector('.fw-bold');
            const progressBar = item.querySelector('.progress-bar');
            
            if (percentageSpan && progressBar) {
                percentageSpan.textContent = `${percentage}%`;
                progressBar.style.width = `${percentage}%`;
            }
        });
    }

    // Get status badge class
    getStatusBadgeClass(status) {
        const statusClasses = {
            'delivered': 'bg-success-subtle text-success',
            'shipped': 'bg-info-subtle text-info',
            'processing': 'bg-warning-subtle text-warning',
            'pending': 'bg-secondary-subtle text-secondary',
            'cancelled': 'bg-danger-subtle text-danger'
        };
        
        return statusClasses[status?.toLowerCase()] || 'bg-secondary-subtle text-secondary';
    }

    // Format date
    formatDate(dateString) {
        if (!dateString) return 'N/A';
        
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // Setup event listeners
    setupEventListeners() {
        // Add Product button
        const addProductBtn = document.querySelector('.btn-soft-success');
        if (addProductBtn) {
            addProductBtn.addEventListener('click', () => {
                this.showAddProductModal();
            });
        }

        // Export buttons
        const exportBtns = document.querySelectorAll('.btn-soft-primary, .btn-soft-info');
        exportBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.exportReport(btn.textContent.trim());
            });
        });
    }

    // Show add product modal (placeholder)
    showAddProductModal() {
        alert('Add Product functionality would open a modal here.\nThis would integrate with the backend API to add new perfumes.');
    }

    // Export report functionality
    exportReport(reportType) {
        console.log(`Exporting ${reportType}...`);
        alert(`${reportType} functionality would generate and download a report here.`);
    }

    // Refresh dashboard data
    async refreshData() {
        await this.loadDashboardData();
        console.log('Dashboard data refreshed');
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new PerfumeDashboard();
    
    // Auto-refresh every 5 minutes
    setInterval(() => {
        dashboard.refreshData();
    }, 300000);
});

// Utility functions for dashboard
const DashboardUtils = {
    // Format currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },

    // Format number with commas
    formatNumber(num) {
        return num.toLocaleString();
    },

    // Calculate percentage change
    calculatePercentageChange(current, previous) {
        if (previous === 0) return 0;
        return ((current - previous) / previous * 100).toFixed(1);
    }
};