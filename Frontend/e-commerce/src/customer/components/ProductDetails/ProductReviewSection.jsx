import React, { useEffect, useState } from "react";
import {
    fetchReviews,
    fetchRatings,
    submitReview,
    submitRating,
} from "../Product/apiReviewRating";

export default function ProductReviewSection({ productId }) {
    const [reviews, setReviews] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [newReview, setNewReview] = useState("");
    const [newRating, setNewRating] = useState(0);

    // ⭐ Load Reviews + Ratings
    const loadReviewData = async () => {
        try {
            setLoading(true);

            const [reviewRes, ratingRes] = await Promise.all([
                fetchReviews(productId),
                fetchRatings(productId),
            ]);

            setReviews(reviewRes);
            setRatings(ratingRes);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReviewData();
    }, [productId]);

    // ⭐ Average rating
    const avgRating = ratings.length
        ? (ratings.reduce((a, b) => a + b.rating, 0) / ratings.length).toFixed(1)
        : 0;

    // ⭐ Submit Review
    const handleSubmitReview = async () => {
        if (!newReview.trim()) return;

        await submitReview(productId, newReview);
        setNewReview("");

        loadReviewData();
    };

    // ⭐ Submit Rating
    const handleRatingSubmit = async () => {
        if (newRating <= 0) return;

        await submitRating(productId, newRating);
        setNewRating(0);

        loadReviewData();
    };

    if (loading) {
        return <p className="text-center py-6">Loading reviews...</p>;
    }

    return (
        <section className="w-full lg:max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-8">

            <h2 className="text-xl sm:text-2xl font-semibold text-emerald-800 border-b-2 border-emerald-700 pb-2 mb-6 text-center sm:text-left">
                Product Ratings & Reviews
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* ----------- LEFT PANEL ----------- */}
                <div className="bg-gray-50 border rounded-xl shadow-md p-4 sm:p-6 flex flex-col gap-5">

                    {/* Submit Review */}
                    <div className="bg-white border rounded-lg shadow-sm p-4 sm:p-5">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Write a Review</h3>

                        <textarea
                            value={newReview}
                            onChange={(e) => setNewReview(e.target.value)}
                            placeholder="Share your experience..."
                            className="w-full h-28 p-3 border border-gray-300 rounded-md"
                        ></textarea>

                        <button
                            onClick={handleSubmitReview}
                            className="mt-3 bg-emerald-700 text-white py-2 px-4 rounded-md hover:bg-emerald-800 transition w-full sm:w-auto"
                        >
                            Submit Review
                        </button>
                    </div>

                    {/* Customer Reviews Feed */}
                    <div className="bg-white border rounded-lg shadow-sm p-4 sm:p-5 max-h-80 overflow-y-auto">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">What Buyers Say</h3>

                        {reviews.length === 0 && (
                            <p className="text-gray-500 text-sm">No reviews yet.</p>
                        )}

                        {reviews.map((rev) => (
                            <div key={rev.id} className="border-b pb-3 mb-3 last:border-none">
                                <div className="text-sm font-medium text-gray-800">
                                    {rev.username || "Anonymous User"}
                                </div>
                                <p className="text-sm text-gray-700 mt-1">{rev.review}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {new Date(rev.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ----------- RIGHT PANEL ----------- */}
                <div className="bg-gray-50 border rounded-xl shadow-md p-4 sm:p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Product Ratings Summary
                    </h3>

                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl font-bold">{avgRating} ⭐</span>
                        <span className="text-sm text-gray-700">
                            ({ratings.length} {ratings.length === 1 ? 'rating' : 'ratings'})
                        </span>
                    </div>

                    {/* Rating Distribution (Optional Enhancement) */}
                    {ratings.length > 0 && (
                        <div className="mb-6 space-y-2">
                            {[5, 4, 3, 2, 1].map(star => {
                                const count = ratings.filter(r => Math.round(r.rating) === star).length;
                                const percentage = ratings.length > 0 ? (count / ratings.length) * 100 : 0;
                                return (
                                    <div key={star} className="flex items-center gap-2 text-sm">
                                        <span className="w-12">{star} ⭐</span>
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-emerald-600 h-2 rounded-full transition-all"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="w-8 text-gray-600">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <label className="block text-gray-700 font-medium mb-1">
                        Rate this product:
                    </label>

                    <select
                        value={newRating}
                        onChange={(e) => setNewRating(Number(e.target.value))}
                        className="border p-2 rounded-md w-full sm:w-48"
                    >
                        <option value="0">Select rating</option>
                        <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                        <option value="4">⭐⭐⭐⭐ Very Good</option>
                        <option value="3">⭐⭐⭐ Good</option>
                        <option value="2">⭐⭐ Average</option>
                        <option value="1">⭐ Poor</option>
                    </select>

                    <button
                        onClick={handleRatingSubmit}
                        className="mt-3 bg-emerald-700 text-white py-2 px-4 rounded-md hover:bg-emerald-800 transition w-full"
                    >
                        Submit Rating
                    </button>
                </div>
            </div>
        </section>
    );
}