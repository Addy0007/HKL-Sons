package com.HKL.Ecomm_App.Service;

import com.HKL.Ecomm_App.DTO.RatingDTO;
import com.HKL.Ecomm_App.Exception.ProductException;
import com.HKL.Ecomm_App.Mapper.RatingMapper;
import com.HKL.Ecomm_App.Model.OrderStatus;
import com.HKL.Ecomm_App.Model.Product;
import com.HKL.Ecomm_App.Model.Rating;
import com.HKL.Ecomm_App.Model.User;
import com.HKL.Ecomm_App.Repository.OrderRepository;
import com.HKL.Ecomm_App.Repository.RatingRepository;
import com.HKL.Ecomm_App.Request.RatingRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RatingServiceImpl implements RatingService {

    private final RatingRepository ratingRepository;
    private final ProductService productService;
    private final OrderRepository orderRepository;
    public RatingServiceImpl(RatingRepository ratingRepository, ProductService productService , OrderRepository orderRepository) {
        this.ratingRepository = ratingRepository;
        this.productService = productService;
        this.orderRepository=orderRepository;
    }

    @Override
    public RatingDTO createRating(RatingRequest req, User user) throws ProductException {

        // MUST fetch entity, NOT DTO
        Product product = productService.findProductEntityById(req.getProductId());

        Rating rating = new Rating();
        rating.setProduct(product);
        rating.setUser(user);
        rating.setRating(req.getRating());
        rating.setCreatedAt(LocalDateTime.now());

        Rating saved = ratingRepository.save(rating);

        return RatingMapper.toDTO(saved);
    }

    @Override
    public List<RatingDTO> getProductRating(Long productId) {
        return ratingRepository.findAllByProductId(productId)
                .stream()
                .map(RatingMapper::toDTO)
                .toList();
    }
    @Override
    public boolean hasUserPurchasedProduct(User user, Long productId) {
        return orderRepository.existsByUserAndProductAndStatus(
                user, productId, OrderStatus.DELIVERED);
    }
}
