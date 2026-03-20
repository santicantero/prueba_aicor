<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CouponSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Coupon::create([
            'code' => 'BIENVENIDA10',
            'discount_percentage' => 10,
            'is_active' => true,
        ]);
    }
}
