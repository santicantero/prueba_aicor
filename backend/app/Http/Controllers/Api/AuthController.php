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

        $isAdmin = $email === 'sct0012@alu.medac.es';

        $userDb = User::updateOrCreate(
            ['email' => $email],
            ['name' => $nuevoNombre, 'google_id' => $user->getId(), 'avatar' => $user->getAvatar(), 'is_admin' => $isAdmin],
        );
        
        if ($userDb->is_admin !== $isAdmin) {
            $userDb->is_admin = $isAdmin;
            $userDb->save();
        }

        $token = JWTAuth::fromUser($userDb);

        $frontendUrl = 'http://localhost:5173/auth/callback?' . http_build_query([
            'token' => $token,
            'name' => $userDb->name,
            'email' => $userDb->email,
            'avatar' => $userDb->avatar,
            'is_admin' => $userDb->is_admin ? '1' : '0',
        ]);

        return redirect($frontendUrl);
    }
}
