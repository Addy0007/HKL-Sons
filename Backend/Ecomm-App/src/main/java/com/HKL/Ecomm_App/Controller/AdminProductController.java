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

    // ==================== UPDATE PRODUCT (PARTIAL) ====================
    @PutMapping("/{productId}/update")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDTO> updateProductPartial(
            @RequestBody UpdateProductRequest req,
            @PathVariable Long productId
    ) throws ProductException {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("\n🔐 UPDATE PRODUCT (PARTIAL) Request:");
        System.out.println("   User: " + auth.getName());
        System.out.println("   Product ID: " + productId);

        ProductDTO dto = productService.updateProduct(productId, req);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    // ==================== UPDATE PRODUCT (FULL) ====================
    @PutMapping("/{productId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDTO> updateProductFull(
            @PathVariable Long productId,
            @Valid @RequestBody CreateProductRequest req
    ) throws ProductException {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("\n🔐 UPDATE PRODUCT (FULL) Request:");
        System.out.println("   User: " + auth.getName());
        System.out.println("   Product ID: " + productId);
        System.out.println("   Featured: " + req.getIsFeatured());
        System.out.println("   Featured Order: " + req.getFeaturedOrder());

        // ✅ FIXED: Call updateProductFull instead of updateProduct
        ProductDTO updatedProduct = productService.updateProductFull(productId, req);

        System.out.println("✅ Product updated successfully");

        return ResponseEntity.ok(updatedProduct);
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