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
  const body = {
    productId,
    review: text
  };

  const { data } = await api.post(`/api/reviews/create`, body);
  return data;
};

export const submitRating = async (productId, rating) => {
  const body = {
    productId,
    rating
  };

  const { data } = await api.post(`/api/ratings/create`, body);
  return data;
};
