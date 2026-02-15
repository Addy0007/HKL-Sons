package com.HKL.Ecomm_App.Controller;

import com.HKL.Ecomm_App.DTO.ProductDTO;
import com.HKL.Ecomm_App.Exception.ProductException;
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
    public ResponseEntity<Page<ProductDTO>> findProductByCategoryHandler(
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

        if (colors == null) colors = List.of();
        if (sizes == null) sizes = List.of();

        colors = colors.stream().filter(c -> c != null && !c.isBlank()).toList();
        sizes = sizes.stream().filter(s -> s != null && !s.isBlank()).toList();

        Page<ProductDTO> res = productService.getAllProducts(
                category, colors, sizes, minPrice, maxPrice,
                minDiscount, sort, stock, pageNumber, pageSize
        );

        return ResponseEntity.ok(res);
    }

    // GET product by ID
    @GetMapping("/products/{productId}")
    public ResponseEntity<ProductDTO> findProductByIdHandler(@PathVariable Long productId)
            throws ProductException {
        return ResponseEntity.ok(productService.findProductById(productId));
    }

    @GetMapping("/products/{first}/{second}/{third}")
    public ResponseEntity<List<ProductDTO>> getByHierarchy(
            @PathVariable String first,
            @PathVariable String second,
            @PathVariable String third
    ) {
        List<ProductDTO> products =
                productService.findByHierarchy(first, second, third);

        return ResponseEntity.ok(products);
    }
    @GetMapping("/products/search")
    public ResponseEntity<List<ProductDTO>> searchProducts(
            @RequestParam(name = "q", defaultValue = "") String query
    ) {
        if (query.isBlank()) return ResponseEntity.ok(List.of());
        List<ProductDTO> results = productService.searchProducts(query.trim());
        return ResponseEntity.ok(results);
    }

}
