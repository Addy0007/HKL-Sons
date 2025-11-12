package com.HKL.Ecomm_App.Service;

import com.HKL.Ecomm_App.Exception.ProductException;
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

    @Override
    @Transactional
    public Product createProduct(CreateProductRequest req) {
        Category topLevel = categoryRepository.findByName(req.getTopLevelCategory());
        if (topLevel == null) {
            Category topLevelCategory = new Category();
            topLevelCategory.setName(req.getTopLevelCategory());
            topLevelCategory.setLevel(1);
            topLevel = categoryRepository.save(topLevelCategory);
        }

        Category secondLevel = categoryRepository.findByNameAndParent(req.getSecondLevelCategory(), topLevel.getName());
        if (secondLevel == null) {
            Category secondLevelCategory = new Category();
            secondLevelCategory.setName(req.getSecondLevelCategory());
            secondLevelCategory.setLevel(2);
            secondLevelCategory.setParentCategory(topLevel);
            secondLevel = categoryRepository.save(secondLevelCategory);
        }

        Category thirdLevel = categoryRepository.findByNameAndParent(req.getThirdLevelCategory(), secondLevel.getName());
        if (thirdLevel == null) {
            Category thirdLevelCategory = new Category();
            thirdLevelCategory.setName(req.getThirdLevelCategory());
            thirdLevelCategory.setLevel(3);
            thirdLevelCategory.setParentCategory(secondLevel);
            thirdLevel = categoryRepository.save(thirdLevelCategory);
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

        return productRepository.save(product);
    }

    @Override
    @Transactional
    public String deleteProduct(Long productId) throws ProductException {
        Product product = findProductById(productId);
        product.getSizes().clear();
        productRepository.delete(product);
        return "Product deleted successfully";
    }

    @Transactional
    public Product updateProduct(Long productId, UpdateProductRequest req) throws ProductException {
        Product product = findProductById(productId);

        if (req.getTitle() != null && !req.getTitle().isBlank()) {
            product.setTitle(req.getTitle());
        }
        if (req.getDescription() != null && !req.getDescription().isBlank()) {
            product.setDescription(req.getDescription());
        }
        if (req.getPrice() != null && req.getPrice() > 0) {
            product.setPrice(req.getPrice());
        }
        if (req.getDiscountedPrice() != null && req.getDiscountedPrice() > 0) {
            product.setDiscountedPrice(req.getDiscountedPrice());
        }
        if (req.getDiscountPercent() != null && req.getDiscountPercent() >= 0) {
            product.setDiscountPercent(req.getDiscountPercent());
        }
        if (req.getQuantity() != null && req.getQuantity() >= 0) {
            product.setQuantity(req.getQuantity());
        }
        if (req.getBrand() != null && !req.getBrand().isBlank()) {
            product.setBrand(req.getBrand());
        }
        if (req.getColor() != null && !req.getColor().isBlank()) {
            product.setColor(req.getColor());
        }
        if (req.getImageUrl() != null && !req.getImageUrl().isBlank()) {
            product.setImageUrl(req.getImageUrl());
        }

        return productRepository.save(product);
    }

    @Override
    public Product findProductById(Long id) throws ProductException {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductException("Product not found"));
    }

    @Override
    public List<Product> findProductByCategory(String category) {
        return productRepository.findByCategory_Name(category);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public Page<Product> getAllProducts(String category, List<String> colors, List<String> sizes,
                                        Integer minPrice, Integer maxPrice, Integer minDiscount,
                                        String sort, String stock, Integer pageNumber, Integer pageSize) {

        System.out.println("========== FILTER DEBUG ==========");
        System.out.println("Category: " + category);
        System.out.println("Colors: " + colors);
        System.out.println("Sizes: " + sizes);
        System.out.println("Price Range: " + minPrice + " - " + maxPrice);
        System.out.println("Min Discount: " + minDiscount);
        System.out.println("Sort: " + sort);
        System.out.println("Stock: " + stock);
        System.out.println("Page: " + pageNumber + ", Size: " + pageSize);

        // Sorting setup
        Sort sortBy = switch (sort == null ? "" : sort) {
            case "price_high" -> Sort.by(Sort.Direction.DESC, "discountedPrice");
            case "price_low"  -> Sort.by(Sort.Direction.ASC, "discountedPrice");
            case "discount"   -> Sort.by(Sort.Direction.DESC, "discountPercent");
            default           -> Sort.by(Sort.Direction.DESC, "createdAt");
        };

        // ✅ Fetch all products from database with basic filters
        List<Product> allProducts = productRepository.filterProductsPage(
                (category == null || category.isBlank()) ? null : category.toLowerCase(),
                minPrice,
                maxPrice,
                minDiscount,
                sortBy
        );

        System.out.println("✅ Products fetched from DB: " + allProducts.size());

        // Normalize filters - handle null/empty cases properly
        List<String> normalizedColors = (colors == null || colors.isEmpty())
                ? List.of()
                : colors.stream()
                .filter(c -> c != null && !c.isBlank())
                .map(String::toLowerCase)
                .toList();

        List<String> normalizedSizes = (sizes == null || sizes.isEmpty())
                ? List.of()
                : sizes.stream()
                .filter(sz -> sz != null && !sz.isBlank())
                .map(String::toLowerCase)
                .toList();

        System.out.println("Normalized Colors: " + normalizedColors);
        System.out.println("Normalized Sizes: " + normalizedSizes);

        // ✅ Apply filtering in Java
        List<Product> filtered = allProducts.stream()
                // Color filter
                .filter(p -> {
                    if (normalizedColors.isEmpty()) return true;
                    if (p.getColor() == null) return false;
                    boolean matches = normalizedColors.contains(p.getColor().toLowerCase());
                    if (!matches) {
                        System.out.println("Filtered out " + p.getTitle() + " - color: " + p.getColor());
                    }
                    return matches;
                })
                // Size filter
                .filter(p -> {
                    if (normalizedSizes.isEmpty()) return true;
                    if (p.getSizes() == null || p.getSizes().isEmpty()) return false;

                    boolean hasMatchingSize = p.getSizes().stream().anyMatch(sz -> {
                        if (sz.getName() == null) return false;
                        String sizeName = sz.getName().toLowerCase();
                        return normalizedSizes.contains(sizeName) && sz.getQuantity() > 0;
                    });

                    if (!hasMatchingSize) {
                        System.out.println("Filtered out " + p.getTitle() + " - sizes: " +
                                p.getSizes().stream().map(Size::getName).toList());
                    }
                    return hasMatchingSize;
                })
                // Stock filter
                .filter(p -> {
                    if (stock == null || stock.isBlank()) return true;

                    boolean productHasStock = p.getQuantity() > 0 ||
                            (p.getSizes() != null && p.getSizes().stream().anyMatch(sz -> sz.getQuantity() > 0));

                    boolean shouldInclude = stock.equalsIgnoreCase("in_stock") ? productHasStock : !productHasStock;

                    if (!shouldInclude) {
                        System.out.println("Filtered out " + p.getTitle() + " - stock filter");
                    }
                    return shouldInclude;
                })
                .sorted((a, b) -> switch (sort == null ? "" : sort) {
                    case "price_low" -> Integer.compare(a.getDiscountedPrice(), b.getDiscountedPrice());
                    case "price_high" -> Integer.compare(b.getDiscountedPrice(), a.getDiscountedPrice());
                    case "discount" -> Integer.compare(b.getDiscountPercent(), a.getDiscountPercent());
                    default -> b.getCreatedAt().compareTo(a.getCreatedAt());
                })
                .toList();

        System.out.println("✅ After filtering: " + filtered.size());

        // ✅ Manual Pagination
        int start = pageNumber * pageSize;
        int end = Math.min(start + pageSize, filtered.size());

        // Ensure start index doesn't exceed list size
        start = Math.min(start, filtered.size());

        List<Product> paginated = filtered.subList(start, end);

        System.out.println("✅ Page " + (pageNumber + 1) + ": showing " + paginated.size() + " products");
        System.out.println("===================================");

        return new PageImpl<>(paginated, PageRequest.of(pageNumber, pageSize, sortBy), filtered.size());
    }

    // ✅ Reduce stock after successful order (COD or online)
    @Transactional
    public void reduceStockAfterPurchase(List<OrderItem> orderItems) {
        for (OrderItem item : orderItems) {
            Product product = item.getProduct();
            if (product == null) continue;

            int newQty = Math.max(0, product.getQuantity() - item.getQuantity());
            product.setQuantity(newQty);

            productRepository.save(product);
            System.out.println("🧾 Updated stock for product: " + product.getTitle() + " → " + newQty);
        }
    }

}