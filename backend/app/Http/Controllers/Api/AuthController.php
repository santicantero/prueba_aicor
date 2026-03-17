<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Laravel\Socialite\Facades\Socialite;
use Tymon\JWTAuth\Facades\JWTAuth;

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

        $userDb = User::updateOrCreate(
            ['email' => $email],
            ['name' => $nuevoNombre, 'google_id' => $user->getId(), 'avatar' => $user->getAvatar()],
        );

        $token = JWTAuth::fromUser($userDb);

        $frontendUrl = 'http://localhost:5173/auth/callback?' . http_build_query([
            'token' => $token,
            'name' => $userDb->name,
            'email' => $userDb->email,
            'avatar' => $userDb->avatar,            
        ]);

        return redirect($frontendUrl);
    }
}
