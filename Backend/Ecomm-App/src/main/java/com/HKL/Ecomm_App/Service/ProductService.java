package com.HKL.Ecomm_App.Service;

import com.HKL.Ecomm_App.Exception.ProductException;
import com.HKL.Ecomm_App.Model.Product;
import com.HKL.Ecomm_App.Request.CreateProductRequest;
import com.HKL.Ecomm_App.Request.UpdateProductRequest;
import org.springframework.data.domain.Page;

import java.util.List;


public interface ProductService {
    public Product createProduct(CreateProductRequest req);

    public String deleteProduct(Long productId) throws ProductException;

    public Product updateProduct(Long productId, UpdateProductRequest req) throws ProductException;

    public Product findProductById(Long id) throws ProductException;

    public List<Product> findProductByCategory(String category);
    public Page<Product> getAllProducts(String category, List<String> colours, List<String> sizes, Integer minPrice, Integer maxPrice,
                                        Integer minDiscount, String sort, String stock, Integer pageNumber, Integer pageSize);


}