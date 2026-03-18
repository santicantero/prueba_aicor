<?php

namespace Tests\Feature;

use App\Models\CartItem;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

class OrderApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_usuario_autenticado_puede_confirmar_una_compra(): void
    {
        $user = User::factory()->create();

        $product = Product::create([
            'nombre' => 'Portátil',
            'descripcion' => 'Portátil gaming',
            'precio' => 999.99,
            'stock' => 5,
            'imagen_url' => 'portatil.jpg',
        ]);

        CartItem::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'cantidad' => 2,
        ]);

        $token = JWTAuth::fromUser($user);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/orders/confirm');

        $response->assertStatus(201);

        $this->assertDatabaseHas('orders', [
            'user_id' => $user->id,
        ]);

        $order = Order::where('user_id', $user->id)->first();

        $this->assertDatabaseHas('order_items', [
            'order_id' => $order->id,
            'product_id' => $product->id,
            'cantidad' => 2,
        ]);

        $this->assertDatabaseMissing('cart_items', [
            'user_id' => $user->id,
            'product_id' => $product->id,
        ]);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'stock' => 3,
        ]);
    }

    public function test_usuario_autenticado_puede_ver_sus_pedidos(): void
    {
        $user = User::factory()->create();

        $product = Product::create([
            'nombre' => 'Tablet',
            'descripcion' => 'Tablet 10 pulgadas',
            'precio' => 199.99,
            'stock' => 6,
            'imagen_url' => 'tablet.jpg',
        ]);

        $order = \App\Models\Order::create([
            'user_id' => $user->id,
            'total' => 199.99,
        ]);

        \App\Models\OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'cantidad' => 1,
            'precio' => 199.99,
        ]);

        $token = JWTAuth::fromUser($user);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/orders');

        $response->assertStatus(200);
        $response->assertJsonCount(1);
        $response->assertJsonFragment([
            'user_id' => $user->id,
            'total' => '199.99',
        ]);
    }
}
