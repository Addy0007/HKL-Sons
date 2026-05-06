import { api } from "../../../Config/apiConfig";

export const fetchReviews = async (productId) => {
  const { data } = await api.get(`/api/reviews/product/${productId}`);
  return data;
};

export const fetchRatings = async (productId) => {
  const { data } = await api.get(`/api/ratings/product/${productId}`);
  return data;
};
export const submitReview = async (productId, text) => {
  try {
    const { data } = await api.post(`/api/reviews/create`, { productId, review: text });
    return data;
  } catch (err) {
    if (err.response?.status === 403) {
      throw new Error("Only customers who have received this product can write a review.");
    }
    throw err;
  }
};

export const submitRating = async (productId, rating) => {
  try {
    const { data } = await api.post(`/api/ratings/create`, { productId, rating });
    return data;
  } catch (err) {
    if (err.response?.status === 403) {
      throw new Error("Only customers who have received this product can rate it.");
    }
    throw err;
  }
};