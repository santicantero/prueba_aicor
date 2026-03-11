<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function redirectToGoogle()
    {
        /** @var \Laravel\Socialite\Two\GoogleProvider $driver */
        $driver = Socialite::driver('google');

        return $driver->stateless()->redirect();
    }

    public function handleGoogleCallback()
    {
        /** @var \Laravel\Socialite\Two\GoogleProvider $driver */
        $driver = Socialite::driver('google');
        $user = $driver->stateless()->user();

        $email = $user->getEmail();
        $nuevoNombre = $user->getName();

        User::updateOrCreate(
            ['email' => $email],
            ['name' => $nuevoNombre, 'google_id' => $user->getId(), 'avatar' => $user->getAvatar()]
        );

        return response()->json(
            [
                'email' => $user->getEmail(),
                'name' => $user->getName(),
                'google_id' => $user->getId() ?? $user->getEmail(),
                'avatar' => $user->getAvatar(),
            ]
        );
    }
}
