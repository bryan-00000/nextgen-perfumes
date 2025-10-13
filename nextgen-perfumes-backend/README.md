# NextGen Perfumes Backend API

Laravel-based REST API for the NextGen Perfumes e-commerce platform.

## Features

- **Authentication**: User registration, login, logout with Sanctum tokens
- **Products**: Full CRUD operations with categories (mens, womens, unisex, gift_sets)
- **Reviews**: Customer reviews with ratings (1-5 stars)
- **Orders**: Order management with customer details and product tracking
- **Contacts**: Contact form submissions management
- **Newsletter**: Email subscription management

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout (protected)

### Products
- `GET /api/products` - List all products (with category filter)
- `GET /api/products/{id}` - Get single product
- `POST /api/products` - Create product (protected)
- `PUT /api/products/{id}` - Update product (protected)
- `DELETE /api/products/{id}` - Delete product (protected)

### Reviews
- `GET /api/reviews` - List all reviews
- `POST /api/reviews` - Create review (protected)
- `PUT /api/reviews/{id}` - Update review (protected)
- `DELETE /api/reviews/{id}` - Delete review (protected)

### Orders
- `GET /api/orders` - List orders (protected)
- `POST /api/orders` - Create order (protected)
- `GET /api/orders/{id}` - Get single order (protected)
- `PUT /api/orders/{id}` - Update order status (protected)

### Contacts
- `POST /api/contacts` - Submit contact form
- `GET /api/contacts` - List contacts (protected)
- `PUT /api/contacts/{id}` - Update contact status (protected)

### Newsletter
- `POST /api/newsletters` - Subscribe to newsletter
- `GET /api/newsletters` - List subscriptions (protected)

## Setup

1. Install dependencies: `composer install`
2. Configure database in `.env`
3. Run migrations: `php artisan migrate`
4. Seed database: `php artisan db:seed`
5. Start server: `php artisan serve`

## Database Schema

- **users**: id, username, email, password
- **products**: id, name, price, description, category, image_url, is_featured, stock_quantity
- **reviews**: id, user_id, product_id, name, rating, comment
- **orders**: id, user_id, customer_name, customer_email, customer_phone, customer_location, total_amount, status
- **order_product**: order_id, product_id, quantity, price
- **contacts**: id, name, email, phone, message, status
- **newsletters**: id, email, is_active