package com.HKL.Ecomm_App.Controller;

import com.HKL.Ecomm_App.DTO.ProductDTO;
import com.HKL.Ecomm_App.Exception.ProductException;
import com.HKL.Ecomm_App.Request.CreateProductRequest;
import com.HKL.Ecomm_App.Request.UpdateProductRequest;
import com.HKL.Ecomm_App.Service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/products")
public class AdminProductController {

    private final ProductService productService;

    public AdminProductController(ProductService productService) {
        this.productService = productService;
    }

    // CREATE PRODUCT
    @PostMapping("/")
    public ResponseEntity<ProductDTO> createProduct(@RequestBody CreateProductRequest req) {
        ProductDTO dto = productService.createProduct(req);
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    // UPDATE PRODUCT
    @PutMapping("/{productId}/update")
    public ResponseEntity<ProductDTO> updateProduct(
            @RequestBody UpdateProductRequest req,
            @PathVariable Long productId
    ) throws ProductException {

        ProductDTO dto = productService.updateProduct(productId, req);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    // DELETE PRODUCT
    @DeleteMapping("/{productId}/delete")
    public ResponseEntity<String> deleteProduct(@PathVariable Long productId) throws ProductException {
        String msg = productService.deleteProduct(productId);
        return ResponseEntity.ok(msg);
    }
}
