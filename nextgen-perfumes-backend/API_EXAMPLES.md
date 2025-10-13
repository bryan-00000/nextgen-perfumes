# NextGen Perfumes API Usage Examples

## Authentication

### Register User
```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login User
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "password123"
  }'
```

## Products

### Get All Products
```bash
curl -X GET http://localhost:8000/api/products
```

### Get Products by Category
```bash
curl -X GET "http://localhost:8000/api/products?category=mens"
```

### Get Featured Products
```bash
curl -X GET "http://localhost:8000/api/products?featured=1"
```

### Create Product (Protected)
```bash
curl -X POST http://localhost:8000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Fragrance",
    "price": 75.00,
    "category": "unisex",
    "description": "A fresh new scent",
    "stock_quantity": 50
  }'
```

## Reviews

### Get All Reviews
```bash
curl -X GET http://localhost:8000/api/reviews
```

### Create Review (Protected)
```bash
curl -X POST http://localhost:8000/api/reviews \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "name": "John Doe",
    "rating": 5,
    "comment": "Amazing fragrance!"
  }'
```

## Orders

### Create Order (Protected)
```bash
curl -X POST http://localhost:8000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "customer_phone": "+1234567890",
    "customer_location": "123 Main St, City, State",
    "products": [
      {
        "id": 1,
        "quantity": 2
      },
      {
        "id": 3,
        "quantity": 1
      }
    ]
  }'
```

## Contact Form

### Submit Contact Form
```bash
curl -X POST http://localhost:8000/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+1234567890",
    "message": "I have a question about your products."
  }'
```

## Newsletter

### Subscribe to Newsletter
```bash
curl -X POST http://localhost:8000/api/newsletters \
  -H "Content-Type: application/json" \
  -d '{
    "email": "subscriber@example.com"
  }'
```

## Response Examples

### Successful Product Response
```json
{
  "id": 1,
  "name": "Velvet Rose",
  "price": "50.00",
  "description": null,
  "category": "womens",
  "image_url": null,
  "is_featured": true,
  "stock_quantity": 100,
  "created_at": "2024-01-01T00:00:00.000000Z",
  "updated_at": "2024-01-01T00:00:00.000000Z"
}
```

### Successful Authentication Response
```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  },
  "token": "1|abc123def456..."
}
```