package com.HKL.Ecomm_App.Config;

import com.HKL.Ecomm_App.Model.Category;
import com.HKL.Ecomm_App.Model.Product;
import com.HKL.Ecomm_App.Model.Size;
import com.HKL.Ecomm_App.Repository.CategoryRepository;
import com.HKL.Ecomm_App.Repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Set;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner commandLineRunner(CategoryRepository categoryRepository, ProductRepository productRepository) {
        return args -> {

            if (categoryRepository.count() == 0) {

                // Parent Category
                Category men = new Category();
                men.setName("Men");
                men.setLevel(1);
                men = categoryRepository.save(men);

                Category menClothing = new Category();
                menClothing.setName("Clothing");
                menClothing.setLevel(2);
                menClothing.setParentCategory(men);
                menClothing = categoryRepository.save(menClothing);

                Category menShirts = new Category();
                menShirts.setName("Shirts");
                menShirts.setLevel(3);
                menShirts.setParentCategory(menClothing);
                menShirts = categoryRepository.save(menShirts);

                // Another Category Example
                Category women = new Category();
                women.setName("Women");
                women.setLevel(1);
                women = categoryRepository.save(women);

                Category womenSarees = new Category();
                womenSarees.setName("Sarees");
                womenSarees.setLevel(2);
                womenSarees.setParentCategory(women);
                womenSarees = categoryRepository.save(womenSarees);

                System.out.println("✅ Categories Seeded");
            }

            if (productRepository.count() == 0) {

                // Create product with sizes
                Product p1 = new Product();
                p1.setTitle("Men Casual Shirt");
                p1.setDescription("Soft cotton regular fit shirt");
                p1.setBrand("Raymond");
                p1.setColor("Blue");
                p1.setPrice(1499);
                p1.setDiscountedPrice(999);
                p1.setDiscountPercent(33);
                p1.setImageUrl("https://assets.ajio.com/medias/sys_master/root/20220902/4Ery/6311f622f997dd1f8dde46b2/-473Wx593H-469306644-blue-MODEL.jpg");

                p1.setSizes(Set.of(
                        new Size("S", 10),
                        new Size("M", 20),
                        new Size("L", 15)
                ));

                // Assign category (Men → Clothing → Shirts)
                Category cat = categoryRepository.findByName("Shirts");
                p1.setCategory(cat);

                productRepository.save(p1);

                System.out.println("✅ Products Seeded");
            }
        };
    }
}
