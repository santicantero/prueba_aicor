<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Coupon;
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


        $couponCode = $request->input('coupon_code');
        if ($couponCode) {
            $coupon = Coupon::where('code', strtoupper($couponCode))->where('is_active', true)->first();
            if ($coupon) {
                $total = $total - ($total * ($coupon->discount_percentage / 100));
            } else {
                return response()->json(['message' => 'Cupón no válido o inactivo'], 400);
            }
        }

        $order = Order::create([
            'user_id' => $request->user()->id,
            'total' => $total,
            'full_name' => $request->input('fullName'),
            'email' => $request->input('email'),
            'phone' => $request->input('phone'),
            'address' => $request->input('address'),
            'zip_code' => $request->input('zipCode'),
            'coupon_code' => $couponCode,
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

    public function fastCheckout(Request $request)
    {
        $product = Product::find($request->input('product_id'));
        if (!$product) {
            return response()->json(['message' => 'Producto no encontrado'], 404);
        }

        $cantidad = $request->input('cantidad', 1);

        if ($product->stock < $cantidad) {
            return response()->json(['message' => 'No hay suficiente stock'], 400);
        }

        $total = $product->precio * $cantidad;
        
        // Asigna user_id si por casualidad estuviera autenticado
        $user_id = auth('api')->check() ? auth('api')->user()->id : null;

        $couponCode = $request->input('coupon_code');
        if ($couponCode) {
            $coupon = Coupon::where('code', strtoupper($couponCode))->where('is_active', true)->first();
            if ($coupon) {
                $total = $total - ($total * ($coupon->discount_percentage / 100));
            } else {
                return response()->json(['message' => 'Cupón no válido o inactivo'], 400);
            }
        }

        $order = Order::create([
            'user_id' => $user_id,
            'total' => $total,
            'full_name' => $request->input('fullName'),
            'email' => $request->input('email'),
            'phone' => $request->input('phone'),
            'address' => $request->input('address'),
            'zip_code' => $request->input('zipCode'),
            'coupon_code' => $couponCode,
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'cantidad' => $cantidad,
            'precio' => $product->precio,
        ]);

        $product->stock -= $cantidad;
        $product->save();

        return response()->json([
            'message' => 'Compra rápida confirmada correctamente',
            'order' => $order
        ], 201);
    }
}
