package com.HKL.Ecomm_App.Controller;

import com.HKL.Ecomm_App.Exception.ProductException;
import com.HKL.Ecomm_App.Model.Product;
import com.HKL.Ecomm_App.Service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // ✅ Fixed: Match frontend parameter names exactly (color, not colour)
    @GetMapping("/products")
    public ResponseEntity<Page<Product>> findProductByCategoryHandler(
            @RequestParam(required = false, defaultValue = "") String category,
            @RequestParam(required = false, name = "color") List<String> colors,  // ✅ Changed from "colour" to "color"
            @RequestParam(required = false, name = "size") List<String> sizes,
            @RequestParam(required = false) Integer minPrice,
            @RequestParam(required = false) Integer maxPrice,
            @RequestParam(required = false) Integer minDiscount,
            @RequestParam(defaultValue = "price_low") String sort,
            @RequestParam(required = false) String stock,
            @RequestParam(defaultValue = "0") Integer pageNumber,
            @RequestParam(defaultValue = "12") Integer pageSize) {

        // ✅ Handle null lists
        if (colors == null) colors = List.of();
        if (sizes == null) sizes = List.of();

        System.out.println("📥 API Request:");
        System.out.println("  Category: " + category);
        System.out.println("  Colors: " + colors);
        System.out.println("  Sizes: " + sizes);
        System.out.println("  Price: " + minPrice + " - " + maxPrice);
        System.out.println("  MinDiscount: " + minDiscount);
        System.out.println("  Sort: " + sort);
        System.out.println("  Page: " + pageNumber + ", Size: " + pageSize);

        Page<Product> res = productService.getAllProducts(
                category, colors, sizes, minPrice, maxPrice,
                minDiscount, sort, stock, pageNumber, pageSize
        );

        System.out.println("📤 API Response: " + res.getTotalElements() + " products found");

        return ResponseEntity.ok(res);
    }

    @GetMapping("/products/{productId}")
    public ResponseEntity<Product> findProductByIdHandler(@PathVariable Long productId) throws ProductException {
        Product res = productService.findProductById(productId);
        return ResponseEntity.ok(res);
    }
}