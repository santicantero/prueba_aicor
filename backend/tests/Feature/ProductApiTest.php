<?php

namespace Tests\Feature;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_puede_obtener_el_listado_de_productos(): void
    {
        Product::create([
            'nombre' => 'Teclado',
            'descripcion' => 'Teclado mecánico',
            'precio' => 49.99,
            'stock' => 10,
            'imagen_url' => 'teclado.jpg',
        ]);

        Product::create([
            'nombre' => 'Ratón',
            'descripcion' => 'Ratón gaming',
            'precio' => 29.99,
            'stock' => 5,
            'imagen_url' => 'raton.jpg',
        ]);

        $response = $this->getJson('/api/products');

        $response->assertStatus(200);
        $response->assertJsonCount(2);
        $response->assertJsonFragment([
            'nombre' => 'Teclado',
        ]);
        $response->assertJsonFragment([
            'nombre' => 'Ratón',
        ]);
    }
}