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
                'imagen_url' => 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&q=80',
                'categoria' => 'periferico',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'DJI Dron Mini 3',
                'descripcion' => 'Drone potente y compacto, perfecto para capturar tus mejores momentos desde el aire.',
                'precio' => 450.00,
                'stock' => 5,
                'imagen_url' => 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=800&q=80',
                'categoria' => 'dron',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Ratón',
                'descripcion' => 'Ratón gaming, diseñado para aportar la mayor comodidad al usuario..',
                'precio' => 70.50,
                'stock' => 20,
                'imagen_url' => 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
                'categoria' => 'periferico',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Alfombrilla grande',
                'descripcion' => 'Alfombrilla de tamaño grande, 120cms x 60 cms.',
                'precio' => 19.99,
                'stock' => 50,
                'imagen_url' => 'https://images.unsplash.com/photo-1616428315106-904359e9bf9b?w=800&q=80',
                'categoria' => 'periferico',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Cascos Gaming',
                'descripcion' => 'Cascos Gaming, diseñados para aguantar grandes horas de trabajo continuo.',
                'precio' => 90.00,
                'stock' => 15,
                'imagen_url' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
                'categoria' => 'periferico',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Monitor 27 pulgadas',
                'descripcion' => 'Monitor 27 pulgadas, 120hz y tecnología OLED.',
                'precio' => 290.90,
                'stock' => 30,
                'imagen_url' => 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',
                'categoria' => 'periferico',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Ordenador de Sobremesa',
                'descripcion' => 'Ordenador de Sobremesa, perfecto para trabajos informáticos.',
                'precio' => 1699.00,
                'stock' => 10,
                'imagen_url' => 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=800&q=80',
                'categoria' => 'ordenador',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Lampara de lava',
                'descripcion' => 'Lampara de lava relajante para oficina.',
                'precio' => 24.99,
                'stock' => 30,
                'imagen_url' => 'https://images.unsplash.com/photo-1571167530330-9e635cbc1dca?w=800&q=80',
                'categoria' => 'periferico',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Regleta',
                'descripcion' => 'Regleta con 5 huecos para oficina, tiene un cable plegable de hasta 5 metros.',
                'precio' => 10.00,
                'stock' => 50,
                'imagen_url' => 'https://images.unsplash.com/photo-1629739683359-99436fc9fca6?w=800&q=80',
                'categoria' => 'periferico',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Hub usb C.',
                'descripcion' => 'Hub de puertos usb C, contiene lector de tarjeta, entrada ethernet, usb tipo C y thunderbolt.',
                'precio' => 36.99,
                'stock' => 60,
                'imagen_url' => 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80',
                'categoria' => 'periferico',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
