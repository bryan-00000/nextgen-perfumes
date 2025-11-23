#!/bin/bash
set -e

echo "🚀 NextGen Perfumes Docker Deployment"

# Pull latest images
echo "📥 Pulling latest images..."
docker-compose pull

# Stop services gracefully
echo "⏹️ Stopping services..."
docker-compose down --timeout 30

# Start services
echo "▶️ Starting services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services..."
sleep 30

# Run migrations
echo "🗄️ Running migrations..."
docker-compose exec -T backend php artisan migrate --force

# Clear caches
echo "🧹 Clearing caches..."
docker-compose exec -T backend php artisan config:cache
docker-compose exec -T backend php artisan route:cache
docker-compose exec -T backend php artisan view:cache

# Health check
echo "🏥 Health check..."
if curl -f http://localhost/api/health; then
    echo "✅ Deployment successful!"
else
    echo "❌ Health check failed!"
    docker-compose logs backend
    exit 1
fi