<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Review;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function index($productId)
    {
        $reviews = Review::with('user:id,name')->where('product_id', $productId)->latest()->get();
        $averageRating = $reviews->avg('rating') ?: 0;
        
        return response()->json([
            'reviews' => $reviews,
            'average_rating' => round($averageRating, 1),
            'total_reviews' => $reviews->count()
        ]);
    }

    public function checkEligibility($productId)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['eligible' => false]);
        }

        $hasBought = Order::where('user_id', $user->id)
            ->whereHas('orderItems', function ($q) use ($productId) {
                $q->where('product_id', $productId);
            })->exists();

        $hasReviewed = Review::where('user_id', $user->id)->where('product_id', $productId)->exists();

        return response()->json([
            'eligible' => $hasBought && !$hasReviewed,
            'has_bought' => $hasBought,
            'has_reviewed' => $hasReviewed
        ]);
    }

    public function store(Request $request, $productId)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000'
        ]);

        $user = Auth::user();

        $hasBought = Order::where('user_id', $user->id)
            ->whereHas('orderItems', function ($q) use ($productId) {
                $q->where('product_id', $productId);
            })->exists();

        if (!$hasBought) {
            return response()->json(['message' => 'Debes comprar este producto para poder valorarlo.'], 403);
        }

        $hasReviewed = Review::where('user_id', $user->id)->where('product_id', $productId)->exists();
        if ($hasReviewed) {
            return response()->json(['message' => 'Ya has valorado este producto.'], 403);
        }

        $review = Review::create([
            'user_id' => $user->id,
            'product_id' => $productId,
            'rating' => $request->rating,
            'comment' => $request->comment
        ]);

        return response()->json([
            'message' => 'Reseña enviada correctamente.',
            'review' => $review->load('user:id,name')
        ], 201);
    }

    public function adminIndex()
    {
        $reviews = Review::with(['user:id,name', 'product:id,nombre'])->latest()->get();
        return response()->json($reviews);
    }

    public function destroy($id)
    {
        $review = Review::findOrFail($id);
        $review->delete();
        return response()->json(['message' => 'Reseña eliminada']);
    }

    public function respond(Request $request, $id)
    {
        $request->validate([
            'admin_response' => 'required|string|max:1000'
        ]);

        $review = Review::findOrFail($id);
        $review->update([
            'admin_response' => $request->admin_response
        ]);

        return response()->json(['message' => 'Respuesta enviada', 'review' => $review]);
    }
}
