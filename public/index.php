<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Redirect direct visits to /public or /public/ to the clean base application URL
if (isset($_SERVER['REQUEST_URI']) && preg_match('#^(/[^/]+)?/public(/.*)?$#i', $_SERVER['REQUEST_URI'], $matches)) {
    $prefix = $matches[1] ?? '';
    $rest = $matches[2] ?? '';
    $cleanUrl = ($prefix . $rest) ?: '/';
    header('Location: ' . $cleanUrl, true, 301);
    exit;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

// Normalize SCRIPT_NAME when running in a subfolder behind a root rewrite
if (isset($_SERVER['SCRIPT_NAME']) && str_contains($_SERVER['SCRIPT_NAME'], '/public/index.php')) {
    $_SERVER['SCRIPT_NAME'] = str_replace('/public/index.php', '/index.php', $_SERVER['SCRIPT_NAME']);
    if (isset($_SERVER['PHP_SELF'])) {
        $_SERVER['PHP_SELF'] = str_replace('/public/index.php', '/index.php', $_SERVER['PHP_SELF']);
    }
}

$app->handleRequest(Request::capture());
