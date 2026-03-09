<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Product::insert([
            [
                'nombre' => 'Teclado',
                'descripcion' => 'Teclado mecánico, diseñado para trabajos en los que necesites una gran rapidez escribiendo.',
                'precio' => 45.00,
                'stock' => 36,
                'imagen_url' => '',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Ratón',
                'descripcion' => 'Ratón gaming, diseñado para aportar la mayor comodidad al usuario..',
                'precio' => 70.50,
                'stock' => 20,
                'imagen_url' => '',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Alfombrilla grande',
                'descripcion' => 'Alfombrilla de tamaño grande, 120cms x 60 cms.',
                'precio' => 19.99,
                'stock' => 50,
                'imagen_url' => '',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Cascos Gaming',
                'descripcion' => 'Cascos Gaming, diseñados para aguantar grandes horas de trabajo continuo.',
                'precio' => 90.00,
                'stock' => 15,
                'imagen_url' => '',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Monitor 27 pulgadas',
                'descripcion' => 'Monitor 27 pulgadas, 120hz y tecnología OLED.',
                'precio' => 290.90,
                'stock' => 30,
                'imagen_url' => '',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Ordenador de Sobremesa',
                'descripcion' => 'Ordenador de Sobremesa, perfecto para trabajos informáticos.',
                'precio' => 1699.00,
                'stock' => 10,
                'imagen_url' => '',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Lampara de lava',
                'descripcion' => 'Lampara de lava relajante para oficina.',
                'precio' => 24.99,
                'stock' => 30,
                'imagen_url' => '',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Regleta',
                'descripcion' => 'Regleta con 5 huecos para oficina, tiene un cable plegable de hasta 5 metros.',
                'precio' => 10.00,
                'stock' => 50,
                'imagen_url' => '',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Hub usb C.',
                'descripcion' => 'Hub de puertos usb C, contiene lector de tarjeta, entrada ethernet, usb tipo C y thunderbolt.',
                'precio' => 36.99,
                'stock' => 60,
                'imagen_url' => '',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
