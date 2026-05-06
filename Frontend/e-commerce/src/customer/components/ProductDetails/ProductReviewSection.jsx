import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    fetchReviews,
    fetchRatings,
    submitReview,
    submitRating,
} from "../Product/apiReviewRating";

export default function ProductReviewSection({ productId }) {
    const navigate = useNavigate();
    const { auth } = useSelector((store) => store);

    const isAuthenticated = auth.user !== null;

    const [reviews, setReviews] = useState([]);
    const [ratings, setRatings] = useState([]);

    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const [newReview, setNewReview] = useState("");
    const [newRating, setNewRating] = useState(0);

    const [submittingReview, setSubmittingReview] = useState(false);
    const [submittingRating, setSubmittingRating] = useState(false);

    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    // ⭐ Load reviews + ratings
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
        ? (
              ratings.reduce((a, b) => a + b.rating, 0) / ratings.length
          ).toFixed(1)
        : 0;

    // ⭐ Submit Review
    const handleSubmitReview = async () => {
        if (!isAuthenticated) {
            setError("Please login to submit a review");

            setTimeout(() => {
                navigate("/login");
            }, 1500);

            return;
        }

        if (!newReview.trim()) return;

        try {
            setSubmittingReview(true);
            setError(null);
            setSuccessMsg(null);

            await submitReview(productId, newReview.trim());

            setNewReview("");

            setSuccessMsg("Your review has been submitted!");

            await loadReviewData(false);
        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                    "Could not submit your review. Please try again."
            );
        } finally {
            setSubmittingReview(false);
        }
    };

    // ⭐ Submit Rating
    const handleRatingSubmit = async () => {
        if (!isAuthenticated) {
            setError("Please login to submit a rating");

            setTimeout(() => {
                navigate("/login");
            }, 1500);

            return;
        }

        if (newRating <= 0) return;

        try {
            setSubmittingRating(true);
            setError(null);
            setSuccessMsg(null);

            await submitRating(productId, newRating);

            setNewRating(0);

            setSuccessMsg("Your rating has been submitted!");

            await loadReviewData(false);
        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                    "Could not submit your rating. Please try again."
            );
        } finally {
            setSubmittingRating(false);
        }
    };

    // ⭐ Initial Loading
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

            {/* Error Banner */}
            {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg flex items-start gap-2">
                    <svg
                        className="w-5 h-5 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                        />
                    </svg>

                    <div>
                        <p className="font-medium">{error}</p>

                        {error.includes("login") && (
                            <p className="text-xs mt-1">
                                Redirecting to login page...
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Success Banner */}
            {successMsg && (
                <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                    <svg
                        className="w-5 h-5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                        />
                    </svg>

                    <p className="font-medium">{successMsg}</p>
                </div>
            )}

            {/* Login Prompt */}
            {!isAuthenticated && (
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-start gap-3">
                        <svg
                            className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clipRule="evenodd"
                            />
                        </svg>

                        <div>
                            <p className="text-sm font-medium text-blue-800">
                                Want to share your experience?
                            </p>

                            <p className="text-xs text-blue-700 mt-1">
                                Login and purchase this product to write a
                                review or rating
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate("/login")}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition whitespace-nowrap"
                    >
                        Login Now
                    </button>
                </div>
            )}

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* LEFT PANEL */}
                <div className="bg-gray-50 border rounded-xl shadow-md p-4 sm:p-6 flex flex-col gap-5">
                    {/* Write Review */}
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
                            placeholder={
                                isAuthenticated
                                    ? "Share your experience..."
                                    : "Login to write a review..."
                            }
                            disabled={!isAuthenticated}
                            className="w-full h-28 p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100"
                        />

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-3">
                            <p className="text-xs text-gray-500">
                                Please avoid sharing personal info.
                            </p>

                            <button
                                onClick={handleSubmitReview}
                                disabled={
                                    submittingReview ||
                                    !newReview.trim() ||
                                    !isAuthenticated
                                }
                                className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white
                                ${
                                    submittingReview ||
                                    !newReview.trim() ||
                                    !isAuthenticated
                                        ? "bg-emerald-400 cursor-not-allowed"
                                        : "bg-emerald-700 hover:bg-emerald-800"
                                }`}
                            >
                                {submittingReview && (
                                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                )}

                                {!isAuthenticated
                                    ? "Login to Submit"
                                    : submittingReview
                                    ? "Submitting..."
                                    : "Submit Review"}
                            </button>
                        </div>
                    </div>

                    {/* Reviews Feed */}
                    <div className="bg-white border rounded-lg shadow-sm p-4 sm:p-5 max-h-80 overflow-y-auto">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-gray-800">
                                What Buyers Say
                            </h3>

                            <span className="text-xs text-gray-500">
                                {reviews.length} review
                                {reviews.length !== 1 && "s"}
                            </span>
                        </div>

                        {reviews.length === 0 && (
                            <p className="text-gray-500 text-sm">
                                No reviews yet.
                            </p>
                        )}

                        {reviews.map((rev) => (
                            <div
                                key={rev.id}
                                className="border-b last:border-none pb-3 mb-3"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-medium text-gray-800">
                                        {rev.username || "Anonymous User"}
                                    </div>

                                    <p className="text-xs text-gray-500">
                                        {new Date(
                                            rev.createdAt
                                        ).toLocaleDateString()}
                                    </p>
                                </div>

                                <p className="text-sm text-gray-700 mt-1">
                                    {rev.review}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="bg-gray-50 border rounded-xl shadow-md p-4 sm:p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Product Ratings Summary
                    </h3>

                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <div className="flex items-end gap-2">
                                <span className="text-3xl font-bold">
                                    {avgRating}
                                </span>

                                <span className="text-yellow-500 text-xl">
                                    ★
                                </span>
                            </div>

                            <p className="text-xs text-gray-600 mt-1">
                                Based on {ratings.length} rating
                                {ratings.length !== 1 && "s"}
                            </p>
                        </div>
                    </div>

                    {/* Rating Input */}
                    <div className="border-t pt-4 mt-4">
                        <label className="block text-gray-700 font-medium mb-2 text-sm">
                            Rate this product
                        </label>

                        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                            <select
                                value={newRating}
                                onChange={(e) =>
                                    setNewRating(Number(e.target.value))
                                }
                                disabled={!isAuthenticated}
                                className="border p-2 rounded-md w-full sm:w-48 text-sm"
                            >
                                <option value="0">
                                    {isAuthenticated
                                        ? "Select rating"
                                        : "Login to rate"}
                                </option>

                                <option value="5">
                                    ⭐⭐⭐⭐⭐ Excellent
                                </option>

                                <option value="4">
                                    ⭐⭐⭐⭐ Very Good
                                </option>

                                <option value="3">⭐⭐⭐ Good</option>

                                <option value="2">⭐⭐ Average</option>

                                <option value="1">⭐ Poor</option>
                            </select>

                            <button
                                onClick={handleRatingSubmit}
                                disabled={
                                    submittingRating ||
                                    newRating <= 0 ||
                                    !isAuthenticated
                                }
                                className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white
                                ${
                                    submittingRating ||
                                    newRating <= 0 ||
                                    !isAuthenticated
                                        ? "bg-emerald-400 cursor-not-allowed"
                                        : "bg-emerald-700 hover:bg-emerald-800"
                                }`}
                            >
                                {submittingRating && (
                                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                )}

                                {!isAuthenticated
                                    ? "Login to Rate"
                                    : submittingRating
                                    ? "Submitting..."
                                    : "Submit Rating"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}