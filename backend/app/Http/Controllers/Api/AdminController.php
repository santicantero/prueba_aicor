<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\User;
use App\Models\Product;

class AdminController extends Controller
{
    public function getOrders()
    {
        $orders = Order::with('user', 'orderItems.product')
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($orders);
    }

    public function getUsers()
    {
        $users = User::withCount('orders')
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($users);
    }

    public function createProduct(Request $request)
    {
        $data = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'precio' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'imagen_url' => 'nullable|string|url',
            'categoria' => 'nullable|string|max:255',
        ]);

        $product = Product::create($data);

        return response()->json([
            'message' => 'Producto creado con éxito',
            'product' => $product
        ], 201);
    }

    public function updateProduct(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Producto no encontrado'], 404);
        }

        $data = $request->validate([
            'nombre' => 'string|max:255',
            'descripcion' => 'string',
            'precio' => 'numeric|min:0',
            'stock' => 'integer|min:0',
            'imagen_url' => 'nullable|string|url',
            'categoria' => 'nullable|string|max:255',
        ]);

        $product->update($data);

        return response()->json([
            'message' => 'Producto actualizado con éxito',
            'product' => $product
        ]);
    }

    public function deleteProduct($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Producto no encontrado'], 404);
        }

        $product->delete();

        return response()->json(['message' => 'Producto eliminado correctamente']);
    }
}
