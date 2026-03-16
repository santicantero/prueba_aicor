<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $cartItems = CartItem::where('user_id', $request->user()->id)->with('product')->get();
        return response()->json($cartItems);
    }

    public function add(Request $request)
    {
        $data = $request->validate([
            'product_id' => 'required|exists:products,id',
            'cantidad' => 'nullable|integer|min:1',
        ]);

        $cantidad = $data['cantidad'] ?? 1;

        $cartItem = CartItem::where('user_id', $request->user()->id)
            ->where('product_id', $data['product_id'])
            ->first();

        if ($cartItem) {
            $cartItem->cantidad += $cantidad;
            $cartItem->save();
        } else {
            $cartItem = new CartItem();
            $cartItem->user_id = $request->user()->id;
            $cartItem->product_id = $data['product_id'];
            $cartItem->cantidad = $cantidad;
            $cartItem->save();
        }

        $cartItem->load('product');

        return response()->json($cartItem, 201);
    }

    public function remove(Request $request, $productId)
    {
        $cartItem = CartItem::where('user_id', $request->user()->id)
            ->where('product_id', $productId)
            ->first();

        if ($cartItem) {
            $cartItem->delete();
        }

        return response()->json('Producto eliminado del carrito');
    }
}
