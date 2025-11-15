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

    // GET filtered products
    @GetMapping("/products")
    public ResponseEntity<Page<Product>> findProductByCategoryHandler(
            @RequestParam(required = false, defaultValue = "") String category,
            @RequestParam(required = false, name = "color") List<String> colors,
            @RequestParam(required = false, name = "size") List<String> sizes,
            @RequestParam(required = false) Integer minPrice,
            @RequestParam(required = false) Integer maxPrice,
            @RequestParam(required = false) Integer minDiscount,
            @RequestParam(defaultValue = "price_low") String sort,
            @RequestParam(required = false) String stock,
            @RequestParam(defaultValue = "0") Integer pageNumber,
            @RequestParam(defaultValue = "12") Integer pageSize
    ) {

        // ⭐ Normalize null lists
        if (colors == null) colors = List.of();
        if (sizes == null) sizes = List.of();

        // ⭐ Remove empty values ("")
        colors = colors.stream()
                .filter(c -> c != null && !c.isBlank())
                .toList();

        sizes = sizes.stream()
                .filter(s -> s != null && !s.isBlank())
                .toList();

        Page<Product> res = productService.getAllProducts(
                category, colors, sizes, minPrice, maxPrice,
                minDiscount, sort, stock, pageNumber, pageSize
        );

        return ResponseEntity.ok(res);
    }

    // GET product by ID
    @GetMapping("/products/{productId}")
    public ResponseEntity<Product> findProductByIdHandler(@PathVariable Long productId)
            throws ProductException {
        return ResponseEntity.ok(productService.findProductById(productId));
    }
}
