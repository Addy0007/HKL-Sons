import React from "react"

export default function ProductReviewSection() {
    return (
        <section className="w-full lg:max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-8">


            {/* Section Title */}
            <h2 className="text-xl sm:text-2xl font-semibold text-emerald-800 border-b-2 border-emerald-700 pb-2 mb-6 text-center sm:text-left">
                Product Ratings & Reviews
            </h2>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* LEFT SIDE — Write + View Reviews */}
                <div className="bg-gray-50 border rounded-xl shadow-md p-4 sm:p-6 flex flex-col gap-5">
                    {/* Write a Review */}
                    <div className="bg-white border rounded-lg shadow-sm p-4 sm:p-5">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Write a Review</h3>
                        <textarea
                            placeholder="Share your experience..."
                            className="w-full h-28 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-none bg-gray-50"
                        ></textarea>
                        <button className="mt-3 bg-emerald-700 text-white text-sm font-medium py-2 px-4 rounded-md hover:bg-emerald-800 transition w-full sm:w-auto">
                            Submit Review
                        </button>
                    </div>

                    {/* View Other Reviews */}
                    <div className="bg-white border rounded-lg shadow-sm p-4 sm:p-5 max-h-80 overflow-y-auto">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">What Buyers Say</h3>

                        {/* Review Card */}
                        {[
                            {
                                name: "John D.",
                                stars: 5,
                                text: "Great quality and fits perfectly. The color stayed vibrant even after washing!",
                            },
                            {
                                name: "Priya S.",
                                stars: 4,
                                text: "Material feels nice, but delivery took a bit longer than expected.",
                            },
                            {
                                name: "Aarav M.",
                                stars: 5,
                                text: "The tees are soft and breathable. Great purchase overall!",
                            },
                        ].map((review, idx) => (
                            <div key={idx} className="border-b border-gray-200 pb-3 mb-3 last:mb-0 last:border-none">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    {[...Array(review.stars)].map((_, i) => (
                                        <svg
                                            key={i}
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="gold"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className="w-4 h-4"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M11.48 3.499a.562.562 0 011.04 0l2.204 4.464 4.93.717a.562.562 0 01.312.959l-3.574 3.482.843 4.911a.562.562 0 01-.815.592L12 17.347l-4.42 2.277a.562.562 0 01-.815-.592l.843-4.911-3.574-3.482a.562.562 0 01.312-.959l4.93-.717 2.204-4.464z"
                                            />
                                        </svg>
                                    ))}
                                    <span className="text-sm text-gray-700 font-medium">{review.name}</span>
                                </div>
                                <p className="text-sm text-gray-700">{review.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT SIDE — Rating Summary */}
                <div className="bg-gray-50 border rounded-xl shadow-md p-4 sm:p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center sm:text-left">
                        Product Ratings Summary
                    </h3>

                    {/* Stars */}
                    <div className="flex items-center gap-2 mb-4 justify-center sm:justify-start">
                        {[...Array(5)].map((_, i) => (
                            <svg
                                key={i}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="gold"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M11.48 3.499a.562.562 0 011.04 0l2.204 4.464 4.93.717a.562.562 0 01.312.959l-3.574 3.482.843 4.911a.562.562 0 01-.815.592L12 17.347l-4.42 2.277a.562.562 0 01-.815-.592l.843-4.911-3.574-3.482a.562.562 0 01.312-.959l4.93-.717 2.204-4.464z"
                                />
                            </svg>
                        ))}
                        <span className="text-sm text-gray-700 font-medium">4.5 out of 5</span>
                    </div>

                    {/* Rating Bars */}
                    {[
                        { label: "Excellent", color: "bg-green-600", width: "w-[80%]", count: 120 },
                        { label: "Very Good", color: "bg-green-400", width: "w-[60%]", count: 80 },
                        { label: "Good", color: "bg-yellow-400", width: "w-[40%]", count: 45 },
                        { label: "Average", color: "bg-yellow-500", width: "w-[25%]", count: 25 },
                        { label: "Poor", color: "bg-red-500", width: "w-[10%]", count: 10 },
                    ].map((r, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm mb-2">
                            <span className="w-24 text-gray-800">{r.label}</span>
                            <div className="flex-1 bg-gray-200 h-3 rounded-full overflow-hidden">
                                <div className={`${r.color} h-3 ${r.width}`}></div>
                            </div>
                            <span className="w-10 text-gray-700 text-right">{r.count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
