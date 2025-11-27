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

    const [loading, setLoading] = useState(true);          // initial load
    const [isRefreshing, setIsRefreshing] = useState(false); // soft reload after submit

    const [newReview, setNewReview] = useState("");
    const [newRating, setNewRating] = useState(0);

    const [submittingReview, setSubmittingReview] = useState(false);
    const [submittingRating, setSubmittingRating] = useState(false);
    const [error, setError] = useState(null);

    // ⭐ Load Reviews + Ratings
    const loadReviewData = async (isInitial = false) => {
        try {
            setError(null);
            if (isInitial) {
                setLoading(true);
            } else {
                setIsRefreshing(true);
            }

            const [reviewRes, ratingRes] = await Promise.all([
                fetchReviews(productId),
                fetchRatings(productId),
            ]);

            setReviews(reviewRes || []);
            setRatings(ratingRes || []);
        } catch (err) {
            console.error(err);
            setError("Failed to load reviews. Please try again.");
        } finally {
            if (isInitial) {
                setLoading(false);
            } else {
                setIsRefreshing(false);
            }
        }
    };

    useEffect(() => {
        loadReviewData(true);
    }, [productId]);

    // ⭐ Average rating
    const avgRating = ratings.length
        ? (ratings.reduce((a, b) => a + b.rating, 0) / ratings.length).toFixed(1)
        : 0;

    // ⭐ Submit Review
    const handleSubmitReview = async () => {
        if (!newReview.trim()) return;

        try {
            setSubmittingReview(true);
            setError(null);

            await submitReview(productId, newReview.trim());
            setNewReview("");

            await loadReviewData(false);
        } catch (err) {
            console.error(err);
            setError("Could not submit your review. Please try again.");
        } finally {
            setSubmittingReview(false);
        }
    };

    // ⭐ Submit Rating
    const handleRatingSubmit = async () => {
        if (newRating <= 0) return;

        try {
            setSubmittingRating(true);
            setError(null);

            await submitRating(productId, newRating);
            setNewRating(0);

            await loadReviewData(false);
        } catch (err) {
            console.error(err);
            setError("Could not submit your rating. Please try again.");
        } finally {
            setSubmittingRating(false);
        }
    };

    // 🔄 Full-page loading only on first load
    if (loading) {
        return (
            <section className="w-full lg:max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-10 flex justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-600 text-sm sm:text-base">
                        Loading ratings & reviews...
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="w-full lg:max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-emerald-800">
                    Product Ratings & Reviews
                </h2>

                <div className="flex items-center gap-3 text-sm">
                    {isRefreshing && (
                        <div className="flex items-center gap-2 text-emerald-700">
                            <div className="h-4 w-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                            <span>Updating...</span>
                        </div>
                    )}
                </div>
            </div>

            {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-lg">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* ----------- LEFT PANEL ----------- */}
                <div className="bg-gray-50 border rounded-xl shadow-md p-4 sm:p-6 flex flex-col gap-5">
                    {/* Submit Review */}
                    <div className="bg-white border rounded-lg shadow-sm p-4 sm:p-5">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Write a Review
                            </h3>
                            <span className="text-xs text-gray-500">
                                Help others know more about this product
                            </span>
                        </div>

                        <textarea
                            value={newReview}
                            onChange={(e) => setNewReview(e.target.value)}
                            placeholder="Share your experience (quality, fit, delivery, etc.)..."
                            className="w-full h-28 p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-3">
                            <p className="text-xs text-gray-500">
                                Please avoid sharing personal info, contact numbers or links.
                            </p>
                            <button
                                onClick={handleSubmitReview}
                                disabled={submittingReview || !newReview.trim()}
                                className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white
                                    ${submittingReview || !newReview.trim()
                                        ? "bg-emerald-400 cursor-not-allowed"
                                        : "bg-emerald-700 hover:bg-emerald-800 transition"
                                    }`}
                            >
                                {submittingReview && (
                                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                )}
                                {submittingReview ? "Submitting..." : "Submit Review"}
                            </button>
                        </div>
                    </div>

                    {/* Customer Reviews Feed */}
                    <div className="bg-white border rounded-lg shadow-sm p-4 sm:p-5 max-h-80 overflow-y-auto">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-gray-800">
                                What Buyers Say
                            </h3>
                            <span className="text-xs text-gray-500">
                                {reviews.length} review{reviews.length !== 1 && "s"}
                            </span>
                        </div>

                        {reviews.length === 0 && (
                            <p className="text-gray-500 text-sm">
                                No reviews yet. Be the first to share your experience!
                            </p>
                        )}

                        {reviews.map((rev) => (
                            <div
                                key={rev.id}
                                className="border-b last:border-none pb-3 mb-3 last:pb-0 last:mb-0"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-medium text-gray-800">
                                        {rev.username || "Anonymous User"}
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {new Date(rev.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <p className="text-sm text-gray-700 mt-1 leading-snug">
                                    {rev.review}
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

                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <div className="flex items-end gap-2">
                                <span className="text-3xl font-bold">{avgRating}</span>
                                <span className="text-yellow-500 text-xl">★</span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                                Based on {ratings.length} rating
                                {ratings.length !== 1 && "s"}
                            </p>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                            <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <span
                                        key={i}
                                        className={`text-xl ${
                                            i < Math.round(avgRating)
                                                ? "text-yellow-400"
                                                : "text-gray-300"
                                        }`}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            <span className="text-xs text-gray-500">
                                Overall customer satisfaction
                            </span>
                        </div>
                    </div>

                    {/* Rating Distribution */}
                    {ratings.length > 0 && (
                        <div className="mb-6 space-y-2">
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count = ratings.filter(
                                    (r) => Math.round(r.rating) === star
                                ).length;
                                const percentage =
                                    ratings.length > 0 ? (count / ratings.length) * 100 : 0;

                                return (
                                    <div key={star} className="flex items-center gap-2 text-sm">
                                        <span className="w-14 text-xs sm:text-sm">
                                            {star} ★
                                        </span>
                                        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <span className="w-8 text-right text-xs text-gray-600">
                                            {count}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Rating Input */}
                    <div className="border-t pt-4 mt-4">
                        <label className="block text-gray-700 font-medium mb-2 text-sm">
                            Rate this product
                        </label>

                        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                            <select
                                value={newRating}
                                onChange={(e) => setNewRating(Number(e.target.value))}
                                className="border p-2 rounded-md w-full sm:w-48 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                                disabled={submittingRating || newRating <= 0}
                                className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white w-full sm:w-auto
                                    ${submittingRating || newRating <= 0
                                        ? "bg-emerald-400 cursor-not-allowed"
                                        : "bg-emerald-700 hover:bg-emerald-800 transition"
                                    }`}
                            >
                                {submittingRating && (
                                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                )}
                                {submittingRating ? "Submitting..." : "Submit Rating"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
