package com.HKL.Ecomm_App.Service;

import com.HKL.Ecomm_App.DTO.ProductDTO;
import com.HKL.Ecomm_App.Exception.ProductException;
import com.HKL.Ecomm_App.Mapper.ProductMapper;
import com.HKL.Ecomm_App.Model.Category;
import com.HKL.Ecomm_App.Model.OrderItem;
import com.HKL.Ecomm_App.Model.Product;
import com.HKL.Ecomm_App.Model.Size;
import com.HKL.Ecomm_App.Repository.CategoryRepository;
import com.HKL.Ecomm_App.Repository.ProductRepository;
import com.HKL.Ecomm_App.Request.CreateProductRequest;
import com.HKL.Ecomm_App.Request.UpdateProductRequest;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserService userService;

    public ProductServiceImpl(ProductRepository productRepository,
                              CategoryRepository categoryRepository,
                              UserService userService) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.userService = userService;
    }


    // ========================= CREATE PRODUCT ========================= //
    @Override
    @Transactional
    public ProductDTO createProduct(CreateProductRequest req) {
        Category topLevel = categoryRepository.findByName(req.getTopLevelCategory());
        if (topLevel == null) {
            topLevel = new Category();
            topLevel.setName(req.getTopLevelCategory());
            topLevel.setLevel(1);
            topLevel = categoryRepository.save(topLevel);
        }

        Category secondLevel = categoryRepository.findByNameAndParent(
                req.getSecondLevelCategory(), topLevel.getName()
        );
        if (secondLevel == null) {
            secondLevel = new Category();
            secondLevel.setName(req.getSecondLevelCategory());
            secondLevel.setLevel(2);
            secondLevel.setParentCategory(topLevel);
            secondLevel = categoryRepository.save(secondLevel);
        }

        Category thirdLevel = categoryRepository.findByNameAndParent(
                req.getThirdLevelCategory(), secondLevel.getName()
        );
        if (thirdLevel == null) {
            thirdLevel = new Category();
            thirdLevel.setName(req.getThirdLevelCategory());
            thirdLevel.setLevel(3);
            thirdLevel.setParentCategory(secondLevel);
            thirdLevel = categoryRepository.save(thirdLevel);
        }

        Product product = new Product();
        product.setTitle(req.getTitle());
        product.setColor(req.getColor());
        product.setDiscountPercent(req.getDiscountPercent());
        product.setDiscountedPrice(req.getDiscountedPrice());
        product.setDescription(req.getDescription());
        product.setPrice(req.getPrice());
        product.setImageUrl(req.getImageUrl());
        product.setBrand(req.getBrand());
        product.setSizes(req.getSize());
        product.setQuantity(req.getQuantity());
        product.setCategory(thirdLevel);
        product.setCreatedAt(LocalDateTime.now());

        return ProductMapper.toDTO(productRepository.save(product));
    }


    // ========================= DELETE PRODUCT ========================= //
    @Override
    @Transactional
    public String deleteProduct(Long productId) throws ProductException {
        Product product = findProductEntity(productId);
        product.getSizes().clear();
        productRepository.delete(product);
        return "Product deleted successfully";
    }


    // ========================= UPDATE PRODUCT ========================= //
    @Transactional
    public ProductDTO updateProduct(Long productId, UpdateProductRequest req) throws ProductException {
        Product product = findProductEntity(productId);

        if (req.getTitle() != null && !req.getTitle().isBlank()) product.setTitle(req.getTitle());
        if (req.getDescription() != null && !req.getDescription().isBlank()) product.setDescription(req.getDescription());
        if (req.getPrice() != null && req.getPrice() > 0) product.setPrice(req.getPrice());
        if (req.getDiscountedPrice() != null && req.getDiscountedPrice() > 0) product.setDiscountedPrice(req.getDiscountedPrice());
        if (req.getDiscountPercent() != null && req.getDiscountPercent() >= 0) product.setDiscountPercent(req.getDiscountPercent());
        if (req.getQuantity() != null && req.getQuantity() >= 0) product.setQuantity(req.getQuantity());
        if (req.getBrand() != null && !req.getBrand().isBlank()) product.setBrand(req.getBrand());
        if (req.getColor() != null && !req.getColor().isBlank()) product.setColor(req.getColor());
        if (req.getImageUrl() != null && !req.getImageUrl().isBlank()) product.setImageUrl(req.getImageUrl());

        return ProductMapper.toDTO(productRepository.save(product));
    }


    // ========================= FIND PRODUCT BY ID (DTO) ========================= //
    @Override
    public ProductDTO findProductById(Long id) throws ProductException {
        Product p = findProductEntity(id);
        return ProductMapper.toDTO(p);
    }

    @Override
    public List<ProductDTO> findProductByCategory(String category) {
        return productRepository.findByCategory_Name(category)
                .stream()
                .map(ProductMapper::toDTO)
                .toList();
    }


    // Internal helper (entity fetch)
    private Product findProductEntity(Long id) throws ProductException {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductException("Product not found"));
    }


    // ========================= FILTER + PAGINATION ========================= //
    @Override
    public Page<ProductDTO> getAllProducts(String category, List<String> colors, List<String> sizes,
                                           Integer minPrice, Integer maxPrice, Integer minDiscount,
                                           String sort, String stock, Integer pageNumber, Integer pageSize) {

        Sort sortBy = switch (sort == null ? "" : sort) {
            case "price_high" -> Sort.by(Sort.Direction.DESC, "discountedPrice");
            case "price_low" -> Sort.by(Sort.Direction.ASC, "discountedPrice");
            case "discount" -> Sort.by(Sort.Direction.DESC, "discountPercent");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };

        Pageable pageable = PageRequest.of(0, Integer.MAX_VALUE, sortBy);

        Page<Product> result = productRepository.filterProducts(
                (category == null || category.isBlank()) ? null : category.toLowerCase(),
                minPrice, maxPrice, minDiscount, pageable
        );

        List<Product> allProducts = result.getContent();

        List<Product> filtered = allProducts.stream()
                .filter(p -> colors.isEmpty() ||
                        (p.getColor() != null && colors.contains(p.getColor().toLowerCase())))
                .filter(p -> sizes.isEmpty() ||
                        p.getSizes().stream().anyMatch(sz ->
                                sz.getName() != null &&
                                        sizes.contains(sz.getName().toLowerCase()) &&
                                        sz.getQuantity() > 0))
                .filter(p -> {
                    if (stock == null) return true;
                    boolean hasStock = p.getQuantity() > 0 ||
                            p.getSizes().stream().anyMatch(sz -> sz.getQuantity() > 0);
                    return stock.equalsIgnoreCase("in_stock") ? hasStock : !hasStock;
                })
                .toList();

        int start = pageNumber * pageSize;
        int end = Math.min(start + pageSize, filtered.size());
        start = Math.min(start, filtered.size());

        List<ProductDTO> finalPage = filtered.subList(start, end)
                .stream().map(ProductMapper::toDTO).toList();

        return new PageImpl<>(finalPage,
                PageRequest.of(pageNumber, pageSize, sortBy),
                filtered.size());
    }


    // ========================= REDUCE STOCK ========================= //
    @Transactional
    public void reduceStockAfterPurchase(List<OrderItem> orderItems) {
        for (OrderItem item : orderItems) {
            Product product = item.getProduct();
            if (product == null) continue;

            int newQty = Math.max(0, product.getQuantity() - item.getQuantity());
            product.setQuantity(newQty);

            productRepository.save(product);
        }
    }
    @Override
    public Product findProductEntityById(Long id) throws ProductException {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductException("Product not found"));
    }


}
