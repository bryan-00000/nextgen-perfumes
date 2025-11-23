<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected $commands = [
        Commands\InventoryCheck::class,
    ];

    protected function schedule(Schedule $schedule)
    {
        // Inventory checks every hour
        $schedule->command('inventory:check')->hourly();
        
        // Database backup daily at 2 AM
        $schedule->exec('mysqldump -u root -p nextgen_perfumes > /var/backups/db_$(date +%Y%m%d).sql')->dailyAt('02:00');
        
        // Log rotation weekly
        $schedule->exec('find /var/log -name "*.log" -size +100M -delete')->weekly();
        
        // Performance monitoring every 5 minutes
        $schedule->exec('/var/www/nextgen-perfumes/automation/monitoring.sh')->everyFiveMinutes();
    }

    protected function commands()
    {
        $this->load(__DIR__.'/Commands');
        require base_path('routes/console.php');
    }
}