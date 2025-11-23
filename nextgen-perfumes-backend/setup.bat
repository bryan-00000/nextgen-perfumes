@echo off
echo Setting up NextGen Perfumes Backend...

echo Clearing cache...
php artisan config:clear
php artisan cache:clear

echo Installing dependencies...
composer install --no-dev

echo Generating app key...
php artisan key:generate

echo Running migrations...
php artisan migrate:fresh --seed

echo Starting development server...
php artisan serve --host=127.0.0.1 --port=8000

pause