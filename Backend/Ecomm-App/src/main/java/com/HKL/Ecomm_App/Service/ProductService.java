package com.HKL.Ecomm_App.Service;

import com.HKL.Ecomm_App.DTO.ProductDTO;
import com.HKL.Ecomm_App.Exception.ProductException;
import com.HKL.Ecomm_App.Model.OrderItem;
import com.HKL.Ecomm_App.Model.Product;
import com.HKL.Ecomm_App.Request.CreateProductRequest;
import com.HKL.Ecomm_App.Request.UpdateProductRequest;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ProductService {

    ProductDTO createProduct(CreateProductRequest req);

    String deleteProduct(Long productId) throws ProductException;

    ProductDTO updateProduct(Long productId, UpdateProductRequest req) throws ProductException;

    ProductDTO findProductById(Long id) throws ProductException;

    List<ProductDTO> findProductByCategory(String category);

    Page<ProductDTO> getAllProducts(
            String category,
            List<String> colours,
            List<String> sizes,
            Integer minPrice,
            Integer maxPrice,
            Integer minDiscount,
            String sort,
            String stock,
            Integer pageNumber,
            Integer pageSize
    );

    void reduceStockAfterPurchase(List<OrderItem> orderItems);
    Product findProductEntityById(Long id) throws ProductException;
    List<ProductDTO> findByHierarchy(String first, String second, String third);
    List<ProductDTO> searchProducts(String query);

    List<ProductDTO> getFeaturedProducts();

    ProductDTO updateProductFull(Long productId, CreateProductRequest req) throws ProductException;
}
