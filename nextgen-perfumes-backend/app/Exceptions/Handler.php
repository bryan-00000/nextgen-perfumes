<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Auth\AuthenticationException;
use Throwable;

class Handler extends ExceptionHandler
{
    protected $dontReport = [];
    protected $dontFlash = ['current_password', 'password', 'password_confirmation'];

    protected function unauthenticated($request, AuthenticationException $exception)
    {
        if ($request->expectsJson()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }
        return redirect()->guest('/login');
    }

    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }
}