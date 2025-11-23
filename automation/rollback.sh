#!/bin/bash
set -e

echo "🔄 NextGen Perfumes Rollback Script"

DEPLOY_DIR="/var/www/nextgen-perfumes"
BACKUP_DIR="/var/backups/nextgen-perfumes"

# List available backups
echo "📋 Available backups:"
ls -la $BACKUP_DIR/db_*.sql | tail -5

read -p "Enter backup date (YYYYMMDD_HHMMSS): " BACKUP_DATE

if [ ! -f "$BACKUP_DIR/db_$BACKUP_DATE.sql" ]; then
    echo "❌ Backup not found!"
    exit 1
fi

echo "⚠️  Rolling back to $BACKUP_DATE..."

# Put application in maintenance mode
cd $DEPLOY_DIR/nextgen-perfumes-backend
php artisan down --message="Rolling back application"

# Restore database
echo "🗄️  Restoring database..."
mysql -u root -p nextgen_perfumes < $BACKUP_DIR/db_$BACKUP_DATE.sql

# Restore files if available
if [ -f "$BACKUP_DIR/files_$BACKUP_DATE.tar.gz" ]; then
    echo "📁 Restoring files..."
    tar -xzf $BACKUP_DIR/files_$BACKUP_DATE.tar.gz -C /
fi

# Clear caches
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Bring application back online
php artisan up

echo "✅ Rollback completed successfully!"