#!/bin/bash

# Automated SSL certificate setup with Let's Encrypt
DOMAIN="your-domain.com"
EMAIL="admin@nextgenperfumes.com"

# Install certbot
apt update
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d $DOMAIN --email $EMAIL --agree-tos --non-interactive

# Setup auto-renewal
echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -

# Update nginx config for SSL
cat > /etc/nginx/sites-available/nextgen-perfumes-ssl << 'EOF'
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    root /var/www/nextgen-perfumes/nextgen-perfumes-frontend/src;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto https;
    }
}

server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
EOF

nginx -t && systemctl reload nginx