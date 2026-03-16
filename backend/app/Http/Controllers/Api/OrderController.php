<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::with('orderItems.product')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json($orders);
    }

    public function confirm(Request $request)
    {
        $items = CartItem::with('product')
            ->where('user_id', $request->user()->id)
            ->get();

        if ($items->isEmpty()) {
            return response()->json(["message" => "El carrito esta vacio"], 400);
        }

        $total = 0;

        foreach ($items as $item) {
            if ($item->product->stock < $item->cantidad) {
                return response()->json([
                    'message' => 'No hay suficiente stock para uno de los productos'
                ], 400);
            }
            $total += $item->product->precio * $item->cantidad;
        }


        $order = Order::create([
            'user_id' => $request->user()->id,
            'total' => $total,
        ]);

        foreach ($items as $item) {
            OrderItem::Create([
                'order_id' => $order->id,
                'product_id' => $item->product->id,
                'cantidad' => $item->cantidad,
                'precio' => $item->product->precio,
            ]);

            $item->product->stock -= $item->cantidad;
            $item->product->save();
        }

        CartItem::where('user_id', $request->user()->id)->delete();

        return response()->json([
            'message' => 'Compra confirmada correctamente',
            'order' => $order
        ], 201);
    }
}
