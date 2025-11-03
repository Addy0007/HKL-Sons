package com.HKL.Ecomm_App.Controller;

import com.HKL.Ecomm_App.Exception.ProductException;
import com.HKL.Ecomm_App.Model.Product;
import com.HKL.Ecomm_App.Request.CreateProductRequest;
import com.HKL.Ecomm_App.Request.UpdateProductRequest;
import com.HKL.Ecomm_App.Service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
public class AdminProductController {
    private final ProductService productService;
    public AdminProductController(ProductService productService) {
        this.productService = productService;
    }
    @GetMapping("/")
    public ResponseEntity<Product> createProduct(@RequestBody CreateProductRequest req) {
        Product product=productService.createProduct(req);
        return new ResponseEntity<>(product, HttpStatus.CREATED);
    }
//    @DeleteMapping("/{productId}/delete")
//    public ResponseEntity<ApiResponse> deleteProduct(@PathVariable Long productId) throws ProductException {
//        productService.deleteProduct(productId);
//        ApiResponse res = new ApiResponse();
//        res.setMessage("Product deleted Successfully");
//        res.setStatus(true);
//        return new ResponseEntity<>("Product deleted successfully", HttpStatus.OK);
//    }

//    @GetMapping("/all")
//    public ResponseEntity<List<Product>> getAllProducts() {
//        List<Product> products = productService.findAllProducts();
//        return ResponseEntity.ok(products);
//    }
    @PutMapping("/{productId}/update")
    public ResponseEntity<Product> updateProduct(@RequestBody UpdateProductRequest req, @PathVariable Long productId)throws ProductException {
        Product product=productService.updateProduct(productId,req);
        return new ResponseEntity<>(product, HttpStatus.OK);
    }

//    @PostMapping("/creates")
//    public ResponseEntity<Product> createMultipleProduct(@RequestBody CreateProductRequest[] req) {
//    for(CreateProductRequest product:req){
//        productService.createProduct(product);
//    }
//    ApiResponse res =new ApiResponse();
//    res.setMessage("Products created Successfully");
//    res.setStatus(true);
//    return new ResponseEntity<>(res, HttpStatus.OK);
//    }
}
