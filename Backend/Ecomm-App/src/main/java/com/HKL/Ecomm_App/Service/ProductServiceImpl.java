package com.HKL.Ecomm_App.Service;

import com.HKL.Ecomm_App.DTO.ProductDTO;
import com.HKL.Ecomm_App.Exception.ProductException;
import com.HKL.Ecomm_App.Mapper.ProductMapper;
import com.HKL.Ecomm_App.Model.Category;
import com.HKL.Ecomm_App.Model.OrderItem;
import com.HKL.Ecomm_App.Model.Product;
import com.HKL.Ecomm_App.Model.Size;
import com.HKL.Ecomm_App.Model.ProductImage;
import com.HKL.Ecomm_App.Repository.CategoryRepository;
import com.HKL.Ecomm_App.Repository.ProductRepository;
import com.HKL.Ecomm_App.Request.CreateProductRequest;
import com.HKL.Ecomm_App.Request.UpdateProductRequest;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
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
        System.out.println("📦 Creating product: " + req.getTitle());

        // ==================== CATEGORY CREATION ====================
        Category topLevel = categoryRepository.findByName(req.getTopLevelCategory());
        if (topLevel == null) {
            topLevel = new Category();
            topLevel.setName(req.getTopLevelCategory());
            topLevel.setLevel(1);
            topLevel = categoryRepository.save(topLevel);
            System.out.println("✅ Created top-level category: " + topLevel.getName());
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
            System.out.println("✅ Created second-level category: " + secondLevel.getName());
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
            System.out.println("✅ Created third-level category: " + thirdLevel.getName());
        }

        // ==================== CREATE PRODUCT ====================
        Product product = new Product();

        // Basic info
        product.setTitle(req.getTitle());
        product.setColor(req.getColor());
        product.setDiscountPercent(req.getDiscountPercent());
        product.setDiscountedPrice(req.getDiscountedPrice());
        product.setDescription(req.getDescription());
        product.setPrice(req.getPrice());
        product.setBrand(req.getBrand());
        product.setQuantity(req.getQuantity());
        product.setCategory(thirdLevel);
        product.setCreatedAt(LocalDateTime.now());

        // ✅ IMAGES
        product.setImageUrl(req.getImageUrl()); // Main image (backward compatible)

        // ✅ ENHANCED DETAILS
        product.setHighlights(req.getHighlights());
        product.setMaterial(req.getMaterial());
        product.setCareInstructions(req.getCareInstructions());
        product.setCountryOfOrigin(req.getCountryOfOrigin());
        product.setManufacturer(req.getManufacturer());

        // Sizes
        product.setSizes(req.getSize());

        System.out.println("💾 Saving product to database...");

        // ✅ Save product first to get ID
        Product savedProduct = productRepository.save(product);

        System.out.println("✅ Product saved with ID: " + savedProduct.getId());

        // ==================== CREATE PRODUCT IMAGES ====================
        if (req.getAdditionalImages() != null && !req.getAdditionalImages().isEmpty()) {
            System.out.println("📸 Processing " + req.getAdditionalImages().size() + " additional images...");

            List<ProductImage> productImages = new ArrayList<>();

            // Add main image as first image (displayOrder = 0)
            if (req.getImageUrl() != null && !req.getImageUrl().isEmpty()) {
                ProductImage mainImage = new ProductImage();
                mainImage.setImageUrl(req.getImageUrl());
                mainImage.setDisplayOrder(0);
                mainImage.setAltText(product.getTitle());
                mainImage.setProduct(savedProduct);
                productImages.add(mainImage);
                System.out.println("   ✓ Added main image (order: 0)");
            }

            // Add additional images (displayOrder = 1, 2, 3, ...)
            for (int i = 0; i < req.getAdditionalImages().size(); i++) {
                String imageUrl = req.getAdditionalImages().get(i);
                if (imageUrl != null && !imageUrl.trim().isEmpty()) {
                    ProductImage additionalImage = new ProductImage();
                    additionalImage.setImageUrl(imageUrl);
                    additionalImage.setDisplayOrder(i + 1);
                    additionalImage.setAltText(product.getTitle() + " - View " + (i + 2));
                    additionalImage.setProduct(savedProduct);
                    productImages.add(additionalImage);
                    System.out.println("   ✓ Added additional image " + (i + 1) + " (order: " + (i + 1) + ")");
                }
            }

            savedProduct.setImages(productImages);
            savedProduct = productRepository.save(savedProduct);

            System.out.println("✅ Saved product with " + productImages.size() + " images");
        } else {
            System.out.println("ℹ️ No additional images provided");
        }

        System.out.println("🎉 Product creation complete!");

        return ProductMapper.toDTO(savedProduct);
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
