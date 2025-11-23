#!/bin/bash
set -e

echo "🖥️  NextGen Perfumes Server Setup"

# Update system
apt update && apt upgrade -y

# Install required packages
apt install -y nginx mysql-server php8.1-fpm php8.1-mysql php8.1-xml php8.1-mbstring php8.1-curl php8.1-zip composer nodejs npm git curl

# Configure MySQL
mysql_secure_installation

# Create database
mysql -u root -p -e "CREATE DATABASE nextgen_perfumes;"
mysql -u root -p -e "CREATE USER 'nextgen'@'localhost' IDENTIFIED BY 'secure_password';"
mysql -u root -p -e "GRANT ALL PRIVILEGES ON nextgen_perfumes.* TO 'nextgen'@'localhost';"

# Configure Nginx
cat > /etc/nginx/sites-available/nextgen-perfumes << 'EOF'
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/nextgen-perfumes/nextgen-perfumes-frontend/src;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

ln -s /etc/nginx/sites-available/nextgen-perfumes /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# Clone repository
cd /var/www
git clone https://github.com/bryan-00000/nextgen-perfumes.git
chown -R www-data:www-data nextgen-perfumes

# Setup Laravel
cd nextgen-perfumes/nextgen-perfumes-backend
cp .env.example .env
composer install --no-dev --optimize-autoloader
php artisan key:generate
php artisan migrate
php artisan storage:link

# Setup systemd service for Laravel
cat > /etc/systemd/system/nextgen-backend.service << 'EOF'
[Unit]
Description=NextGen Perfumes Backend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/nextgen-perfumes/nextgen-perfumes-backend
ExecStart=/usr/bin/php artisan serve --host=0.0.0.0 --port=8000
Restart=always

[Install]
WantedBy=multi-user.target
EOF

systemctl enable nextgen-backend
systemctl start nextgen-backend

echo "✅ Server setup completed!"
echo "🔧 Don't forget to:"
echo "  - Update .env with production settings"
echo "  - Configure SSL certificate"
echo "  - Set up firewall rules"