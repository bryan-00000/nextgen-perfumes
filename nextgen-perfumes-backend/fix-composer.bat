@echo off
echo Fixing Composer autoload issues...
composer dump-autoload --no-scripts
php artisan clear-compiled
php artisan config:clear
php artisan cache:clear
composer install --no-scripts
echo Fix complete!