#!/bin/bash

# NextGen Perfumes Deployment Script
set -e

echo "🚀 Starting NextGen Perfumes deployment..."

# Backend deployment
echo "📦 Deploying backend..."
cd nextgen-perfumes-backend
composer install --no-dev --optimize-autoloader
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force
php artisan storage:link

# Frontend deployment
echo "🎨 Deploying frontend..."
cd ../nextgen-perfumes-frontend
npm ci --production
npm run build

# Restart services
echo "🔄 Restarting services..."
sudo systemctl restart nginx
sudo systemctl restart php8.1-fpm

echo "✅ Deployment completed successfully!"