<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    // Public endpoint to validate a coupon
    public function validateCode(Request $request)
    {
        $request->validate(['code' => 'required|string']);
        
        $coupon = Coupon::where('code', strtoupper($request->code))->first();

        if (!$coupon) {
            return response()->json(['valid' => false, 'message' => 'El cupón no existe'], 404);
        }

        if (!$coupon->is_active) {
            return response()->json(['valid' => false, 'message' => 'El cupón no está activo'], 400);
        }

        return response()->json([
            'valid' => true,
            'discount_percentage' => $coupon->discount_percentage,
            'code' => $coupon->code
        ]);
    }

    // Admin endpoint to list coupons
    public function index()
    {
        return response()->json(Coupon::orderBy('created_at', 'desc')->get());
    }

    // Admin endpoint to create a coupon
    public function store(Request $request)
    {
        $data = $request->validate([
            'code' => 'required|string|unique:coupons,code',
            'discount_percentage' => 'required|integer|min:1|max:100',
        ]);

        $data['code'] = strtoupper($data['code']);
        $coupon = Coupon::create($data);

        return response()->json($coupon, 201);
    }

    // Admin endpoint to toggle a coupon's active status
    public function toggleStatus($id)
    {
        $coupon = Coupon::findOrFail($id);
        $coupon->is_active = !$coupon->is_active;
        $coupon->save();

        return response()->json($coupon);
    }

    // Admin endpoint to delete a coupon
    public function destroy($id)
    {
        $coupon = Coupon::findOrFail($id);
        $coupon->delete();

        return response()->json(['message' => 'Cupón eliminado correctamente']);
    }
}
