package com.HKL.Ecomm_App.Service;

import com.HKL.Ecomm_App.DTO.ReviewDTO;
import com.HKL.Ecomm_App.Mapper.ReviewMapper;
import com.HKL.Ecomm_App.Exception.ProductException;
import com.HKL.Ecomm_App.Model.Product;
import com.HKL.Ecomm_App.Model.Review;
import com.HKL.Ecomm_App.Model.User;
import com.HKL.Ecomm_App.Repository.ReviewRepository;
import com.HKL.Ecomm_App.Request.ReviewRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductService productService;

    public ReviewServiceImpl(ReviewRepository reviewRepository, ProductService productService) {
        this.reviewRepository = reviewRepository;
        this.productService = productService;
    }

    @Override
    public ReviewDTO createReview(ReviewRequest req, User user) throws ProductException {

        Product product = productService.findProductEntityById(req.getProductId()); // must return Product entity

        Review review = new Review();
        review.setUser(user);
        review.setProduct(product);
        review.setReview(req.getReview());
        review.setCreatedAt(LocalDateTime.now());

        // save entity first
        Review saved = reviewRepository.save(review);

        // convert to DTO
        return ReviewMapper.toDTO(saved);
    }

    @Override
    public List<ReviewDTO> getAllReview(Long productId) {
        return reviewRepository.findAllByProductId(productId)
                .stream()
                .map(ReviewMapper::toDTO)
                .toList();
    }
}
