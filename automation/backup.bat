@echo off
REM NextGen Perfumes Backup Script

set BACKUP_DIR=C:\backups\nextgen-perfumes
set DATE=%date:~-4,4%%date:~-10,2%%date:~-7,2%

echo Creating backup directory...
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

echo Backing up database...
mysqldump -u root -p nextgen_perfumes > "%BACKUP_DIR%\database_%DATE%.sql"

echo Backing up uploaded files...
xcopy "nextgen-perfumes-backend\storage\app\public" "%BACKUP_DIR%\files_%DATE%\" /E /I

echo Backing up configuration...
copy "nextgen-perfumes-backend\.env" "%BACKUP_DIR%\env_%DATE%.txt"

echo Backup completed: %BACKUP_DIR%