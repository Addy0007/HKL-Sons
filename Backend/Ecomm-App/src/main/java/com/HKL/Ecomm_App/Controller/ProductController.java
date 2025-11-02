package com.HKL.Ecomm_App.Controller;


import com.HKL.Ecomm_App.Exception.ProductException;
import com.HKL.Ecomm_App.Model.Product;
import com.HKL.Ecomm_App.Service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/products")
    public ResponseEntity<Page<Product >> findProductByCategoryHandler(@RequestParam String category,
                                                                       @RequestParam List<String> colour,
                                                                       @RequestParam List<String> size,
                                                                       @RequestParam Integer minPrice,
                                                                       @RequestParam Integer maxPrice,
                                                                       @RequestParam Integer minDiscount,
                                                                       @RequestParam String sort,
                                                                       @RequestParam String stock,
                                                                       @RequestParam Integer pageNumber,
                                                                       @RequestParam Integer pageSize){
        Page<Product> res=productService.getAllProduct(category,colour,size,minPrice,maxPrice,minDiscount,sort,stock,pageNumber,pageSize);
        System.out.println("Complete Products");
        return new ResponseEntity<>(res, HttpStatus.ACCEPTED);
}
        @GetMapping("/products/{productId}")
        public ResponseEntity<Product> findProductByIdHandler(@PathVariable Long productId) throws ProductException {
            Product res = productService.findProductById(productId);
            return ResponseEntity.ok(res);
        }

    }
