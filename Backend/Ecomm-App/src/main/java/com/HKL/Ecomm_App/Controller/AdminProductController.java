package com.HKL.Ecomm_App.Controller;

import com.HKL.Ecomm_App.DTO.ProductDTO;
import com.HKL.Ecomm_App.Exception.ProductException;
import com.HKL.Ecomm_App.Request.CreateProductRequest;
import com.HKL.Ecomm_App.Request.UpdateProductRequest;
import com.HKL.Ecomm_App.Service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/products")
public class AdminProductController {

    private final ProductService productService;

    public AdminProductController(ProductService productService) {
        this.productService = productService;
    }

    // ==================== CREATE PRODUCT ====================
    @PostMapping("/")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDTO> createProduct(
            @Valid @RequestBody CreateProductRequest req
    ) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("\n🔐 CREATE PRODUCT Request:");
        System.out.println("   User: " + auth.getName());
        System.out.println("   Authorities: " + auth.getAuthorities());
        System.out.println("   Product Title: " + req.getTitle());

        ProductDTO dto = productService.createProduct(req);

        System.out.println("✅ Product created successfully with ID: " + dto.getId());

        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    // ==================== UPDATE PRODUCT ====================
    @PutMapping("/{productId}/update")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDTO> updateProduct(
            @RequestBody UpdateProductRequest req,
            @PathVariable Long productId
    ) throws ProductException {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("\n🔐 UPDATE PRODUCT Request:");
        System.out.println("   User: " + auth.getName());
        System.out.println("   Product ID: " + productId);

        ProductDTO dto = productService.updateProduct(productId, req);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    // ==================== DELETE PRODUCT ====================
    @DeleteMapping("/{productId}/delete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteProduct(
            @PathVariable Long productId
    ) throws ProductException {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("\n🔐 DELETE PRODUCT Request:");
        System.out.println("   User: " + auth.getName());
        System.out.println("   Deleting Product ID: " + productId);

        String msg = productService.deleteProduct(productId);

        System.out.println("✅ Product deleted successfully");

        return ResponseEntity.ok(msg);
    }
}
