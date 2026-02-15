package com.HKL.Ecomm_App.Service;

import com.HKL.Ecomm_App.DTO.ProductDTO;
import com.HKL.Ecomm_App.Exception.ProductException;
import com.HKL.Ecomm_App.Mapper.ProductMapper;
import com.HKL.Ecomm_App.Model.*;
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
import java.util.stream.Collectors;

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

    // ========================= NORMALIZATION ========================= //

    private String normalize(String name) {
        if (name == null) return null;
        return name.trim().toLowerCase();
    }

    private Category findOrCreateCategory(String name, Category parent, int level) {

        String normalized = normalize(name);

        return categoryRepository
                .findByNameIgnoreCaseAndParentCategory(normalized, parent)
                .orElseGet(() -> {
                    Category category = new Category();
                    category.setName(normalized);
                    category.setParentCategory(parent);
                    category.setLevel(level);
                    return categoryRepository.save(category);
                });
    }

    // ========================= CREATE PRODUCT ========================= //

    @Override
    @Transactional
    public ProductDTO createProduct(CreateProductRequest req) {

        System.out.println("📦 Creating product: " + req.getTitle());

        // -------- SAFE CATEGORY CREATION --------
        Category topLevel = findOrCreateCategory(
                req.getTopLevelCategory(), null, 1);

        Category secondLevel = findOrCreateCategory(
                req.getSecondLevelCategory(), topLevel, 2);

        Category thirdLevel = findOrCreateCategory(
                req.getThirdLevelCategory(), secondLevel, 3);

        // -------- CREATE PRODUCT --------
        Product product = new Product();

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

        product.setImageUrl(req.getImageUrl());
        product.setHighlights(req.getHighlights());
        product.setMaterial(req.getMaterial());
        product.setCareInstructions(req.getCareInstructions());
        product.setCountryOfOrigin(req.getCountryOfOrigin());
        product.setManufacturer(req.getManufacturer());
        product.setSizes(req.getSize());

        Product savedProduct = productRepository.save(product);

        // -------- HANDLE IMAGES --------
        if (req.getAdditionalImages() != null && !req.getAdditionalImages().isEmpty()) {

            List<ProductImage> productImages = new ArrayList<>();

            if (req.getImageUrl() != null && !req.getImageUrl().isEmpty()) {
                ProductImage mainImage = new ProductImage();
                mainImage.setImageUrl(req.getImageUrl());
                mainImage.setDisplayOrder(0);
                mainImage.setAltText(product.getTitle());
                mainImage.setProduct(savedProduct);
                productImages.add(mainImage);
            }

            for (int i = 0; i < req.getAdditionalImages().size(); i++) {
                String imageUrl = req.getAdditionalImages().get(i);
                if (imageUrl != null && !imageUrl.trim().isEmpty()) {
                    ProductImage additionalImage = new ProductImage();
                    additionalImage.setImageUrl(imageUrl);
                    additionalImage.setDisplayOrder(i + 1);
                    additionalImage.setAltText(product.getTitle() + " - View " + (i + 2));
                    additionalImage.setProduct(savedProduct);
                    productImages.add(additionalImage);
                }
            }

            savedProduct.setImages(productImages);
            savedProduct = productRepository.save(savedProduct);
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

        if (req.getTitle() != null && !req.getTitle().isBlank())
            product.setTitle(req.getTitle());

        if (req.getDescription() != null && !req.getDescription().isBlank())
            product.setDescription(req.getDescription());

        if (req.getPrice() != null && req.getPrice() > 0)
            product.setPrice(req.getPrice());

        if (req.getDiscountedPrice() != null && req.getDiscountedPrice() > 0)
            product.setDiscountedPrice(req.getDiscountedPrice());

        if (req.getDiscountPercent() != null && req.getDiscountPercent() >= 0)
            product.setDiscountPercent(req.getDiscountPercent());

        if (req.getQuantity() != null && req.getQuantity() >= 0)
            product.setQuantity(req.getQuantity());

        if (req.getBrand() != null && !req.getBrand().isBlank())
            product.setBrand(req.getBrand());

        if (req.getColor() != null && !req.getColor().isBlank())
            product.setColor(req.getColor());

        if (req.getImageUrl() != null && !req.getImageUrl().isBlank())
            product.setImageUrl(req.getImageUrl());

        return ProductMapper.toDTO(productRepository.save(product));
    }

    // ========================= FIND BY ID ========================= //

    @Override
    public ProductDTO findProductById(Long id) throws ProductException {
        return ProductMapper.toDTO(findProductEntity(id));
    }

    @Override
    public List<ProductDTO> findProductByCategory(String category) {
        return productRepository.findByCategory_NameIgnoreCase(normalize(category))
                .stream()
                .map(ProductMapper::toDTO)
                .toList();
    }

    private Product findProductEntity(Long id) throws ProductException {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductException("Product not found"));
    }

    // ========================= FILTER + PAGINATION ========================= //

    @Override
    public Page<ProductDTO> getAllProducts(String category,
                                           List<String> colors,
                                           List<String> sizes,
                                           Integer minPrice,
                                           Integer maxPrice,
                                           Integer minDiscount,
                                           String sort,
                                           String stock,
                                           Integer pageNumber,
                                           Integer pageSize) {

        Sort sortBy = switch (sort == null ? "" : sort) {
            case "price_high" -> Sort.by(Sort.Direction.DESC, "discountedPrice");
            case "price_low" -> Sort.by(Sort.Direction.ASC, "discountedPrice");
            case "discount" -> Sort.by(Sort.Direction.DESC, "discountPercent");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };

        Pageable pageable = PageRequest.of(0, Integer.MAX_VALUE, sortBy);

        Page<Product> result = productRepository.filterProducts(
                (category == null || category.isBlank()) ? null : normalize(category),
                minPrice, maxPrice, minDiscount, pageable
        );

        List<Product> allProducts = result.getContent();

        List<Product> filtered = allProducts.stream()
                .filter(p -> colors.isEmpty() ||
                        (p.getColor() != null &&
                                colors.contains(p.getColor().toLowerCase())))
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
                .stream()
                .map(ProductMapper::toDTO)
                .toList();

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
        return findProductEntity(id);
    }

    @Override
    public List<ProductDTO> findByHierarchy(String first, String second, String third) {

        return productRepository
                .findByFullHierarchy(
                        normalize(first),
                        normalize(second),
                        normalize(third)
                )
                .stream()
                .map(ProductMapper::toDTO)
                .toList();
    }
    @Override
    public List<ProductDTO> searchProducts(String query) {
        String q = query.toLowerCase();

        // Search by title OR brand OR category name, limit to 8 results
        return productRepository
                .searchByKeyword(q)   // we define this query below
                .stream()
                .limit(8)
                .map(ProductMapper::toDTO)   // use your existing mapper method
                .collect(Collectors.toList());
    }

}
