<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

class CartApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_usuario_autenticado_puede_añadir_un_producto_al_carrito(): void
    {
        $user = User::factory()->create();

        $product = Product::create([
            'nombre' => 'Teclado',
            'descripcion' => 'Teclado mecánico',
            'precio' => 49.99,
            'stock' => 10,
            'imagen_url' => 'teclado.jpg',
        ]);

        $token = JWTAuth::fromUser($user);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/cart', [
                'product_id' => $product->id,
                'cantidad' => 1,
            ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('cart_items', [
            'user_id' => $user->id,
            'product_id' => $product->id,
            'cantidad' => 1,
        ]);
    }

    public function test_usuario_autenticado_puede_ver_su_carrito(): void
    {
        $user = User::factory()->create();

        $product = Product::create([
            'nombre' => 'Ratón',
            'descripcion' => 'Ratón gaming',
            'precio' => 29.99,
            'stock' => 8,
            'imagen_url' => 'raton.jpg',
        ]);

        \App\Models\CartItem::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'cantidad' => 2,
        ]);

        $token = JWTAuth::fromUser($user);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/cart');

        $response->assertStatus(200);
        $response->assertJsonCount(1);
        $response->assertJsonFragment([
            'product_id' => $product->id,
            'cantidad' => 2,
        ]);
    }

    public function test_usuario_autenticado_puede_eliminar_un_producto_del_carrito(): void
    {
        $user = User::factory()->create();

        $product = Product::create([
            'nombre' => 'Monitor',
            'descripcion' => 'Monitor 24 pulgadas',
            'precio' => 149.99,
            'stock' => 4,
            'imagen_url' => 'monitor.jpg',
        ]);

        \App\Models\CartItem::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'cantidad' => 1,
        ]);

        $token = JWTAuth::fromUser($user);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->deleteJson('/api/cart/' . $product->id);

        $response->assertStatus(200);

        $this->assertDatabaseMissing('cart_items', [
            'user_id' => $user->id,
            'product_id' => $product->id,
        ]);
    }
}
