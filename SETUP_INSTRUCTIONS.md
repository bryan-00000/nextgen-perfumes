# NextGen Perfumes - Setup Instructions

## Backend Setup (Laravel API)

### Prerequisites
- PHP 8.1 or higher
- Composer
- MySQL/MariaDB
- Node.js (optional, for frontend development)

### 1. Backend Installation

```bash
cd nextgen-perfumes-backend

# Install PHP dependencies
composer install

# Create environment file
cp .env.example .env
# OR on Windows:
copy .env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env file
# Edit .env and update these values:
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nextgen_perfumes
DB_USERNAME=root
DB_PASSWORD=

# Add these to .env:
APP_CIPHER=AES-256-CBC
SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000

# Run database migrations
php artisan migrate

# Seed the database with sample data
php artisan db:seed

# Start the development server
php artisan serve
```

The API will be available at `http://localhost:8000`

### 2. Frontend Setup

```bash
cd nextgen-perfumes-frontend

# No build process required - just serve the files
# You can use any web server or VS Code Live Server extension
```

Open `src/index.html` in your browser or use a local web server.

### 3. CORS Configuration

Add this to your Laravel `config/cors.php`:

```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_methods' => ['*'],
'allowed_origins' => ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:8080'],
'allowed_origins_patterns' => [],
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => true,
```

### 4. Create Database

```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE nextgen_perfumes;
exit

# OR use phpMyAdmin/MySQL Workbench to create database
```

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login  
- `POST /api/logout` - User logout (requires auth)

### Products
- `GET /api/products` - List all products
- `GET /api/products?category=mens` - Filter by category
- `GET /api/products/{id}` - Get single product
- `POST /api/products` - Create product (requires auth)
- `PUT /api/products/{id}` - Update product (requires auth)
- `DELETE /api/products/{id}` - Delete product (requires auth)

### Reviews
- `GET /api/reviews` - List all reviews
- `POST /api/reviews` - Create review (requires auth)
- `PUT /api/reviews/{id}` - Update review (requires auth)
- `DELETE /api/reviews/{id}` - Delete review (requires auth)

### Contact & Newsletter
- `POST /api/contacts` - Submit contact form
- `POST /api/newsletters` - Subscribe to newsletter

## Security Features Implemented

✅ **Fixed Critical Issues:**
- XSS protection in frontend (using textContent instead of innerHTML)
- SQL injection prevention (input validation in controllers)
- CSRF protection configuration
- Proper authentication with Laravel Sanctum
- Input sanitization and validation

✅ **API Integration:**
- Complete frontend-backend integration
- Authentication flow (login/signup)
- Dynamic product loading
- Review submission with API
- Contact form integration
- Newsletter subscription
- Error handling and notifications

## Testing the Integration

1. **Start the backend server:**
   ```bash
   cd nextgen-perfumes-backend
   php artisan serve
   ```

2. **Open the frontend:**
   - Open `nextgen-perfumes-frontend/src/index.html` in your browser
   - Or use a local web server

3. **Test features:**
   - Register a new account
   - Login with credentials
   - Submit reviews (requires login)
   - Submit contact form
   - Subscribe to newsletter
   - Browse products (loaded from API)

## Troubleshooting

### CORS Issues
If you encounter CORS errors:
1. CORS is already configured in `config/cors.php`
2. Ensure frontend is running on allowed origins (localhost:3000, localhost:8080, etc.)
3. Clear browser cache and try again

### Database Issues
- Ensure MySQL/XAMPP is running
- Check database exists: `nextgen_perfumes`
- Check database credentials in `.env`
- Run `php artisan migrate:fresh --seed` to reset database
- If Console Kernel error: ensure `app/Console/Kernel.php` exists

### Authentication Issues
- Clear browser localStorage: `localStorage.clear()`
- Check if Sanctum is properly configured
- Verify API endpoints are accessible

## Production Deployment

### Backend (Laravel)
1. Set `APP_ENV=production` in `.env`
2. Set `APP_DEBUG=false`
3. Configure proper database credentials
4. Run `composer install --optimize-autoloader --no-dev`
5. Run `php artisan config:cache`
6. Run `php artisan route:cache`

### Frontend
1. Update API base URL in `js/api.js`
2. Deploy static files to web server
3. Ensure HTTPS is configured for production

## Next Steps

- Add shopping cart functionality
- Implement order management
- Add product image uploads
- Implement email notifications
- Add admin dashboard
- Implement payment integration