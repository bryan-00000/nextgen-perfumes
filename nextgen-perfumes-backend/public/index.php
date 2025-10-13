<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

$baseDir = realpath(__DIR__.'/..');
$autoloadPath = realpath(__DIR__.'/../vendor/autoload.php');
if ($autoloadPath && $baseDir && strpos($autoloadPath, $baseDir) === 0 && is_file($autoloadPath)) {
    require $autoloadPath;
} else {
    http_response_code(500);
    exit('Autoload file not found.');
}

$app = require_once __DIR__.'/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$response = $kernel->handle(
    $request = Request::capture()
)->send();

$kernel->terminate($request, $response);