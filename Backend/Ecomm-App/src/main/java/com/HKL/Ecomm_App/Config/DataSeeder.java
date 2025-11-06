package com.HKL.Ecomm_App.Config;

import com.HKL.Ecomm_App.Model.Category;
import com.HKL.Ecomm_App.Model.Product;
import com.HKL.Ecomm_App.Model.Size;
import com.HKL.Ecomm_App.Repository.CategoryRepository;
import com.HKL.Ecomm_App.Repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.Set;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner seedData(CategoryRepository categoryRepo, ProductRepository productRepo) {
        return args -> {

            if (productRepo.count() > 0) {
                System.out.println("✅ Data already exists — Skipping seeding");
                return;
            }

            // ---------------- CATEGORIES ----------------
            Category men = saveCategory(categoryRepo, "men", 1, null);
            Category women = saveCategory(categoryRepo, "women", 1, null);

            Category menClothing = saveCategory(categoryRepo, "clothing", 2, men);
            Category menFootwear = saveCategory(categoryRepo, "footwear", 2, men);

            Category kurtas = saveCategory(categoryRepo, "kurtas", 3, menClothing);
            Category jeans = saveCategory(categoryRepo, "jeans", 3, menClothing);
            Category shoes = saveCategory(categoryRepo, "shoes", 3, menFootwear);

            // ---------------- ADD PRODUCTS ----------------
            addKurtas(productRepo, kurtas);
            addJeans(productRepo, jeans);
            addShoes(productRepo, shoes);

            System.out.println("✅ ✅ ✅ DATA SEEDED SUCCESSFULLY ✅ ✅ ✅");
        };
    }

    private Category saveCategory(CategoryRepository repo, String name, int level, Category parent) {
        Category c = new Category();
        c.setName(name);
        c.setLevel(level);
        c.setParentCategory(parent);
        return repo.save(c);
    }

    private Size size(String name, int qty) {
        return new Size(name, qty);
    }

    private void saveProduct(ProductRepository repo, Category cat,
                             String title, String brand, String color,
                             int price, int discountedPrice, int discount,
                             String image, Set<Size> sizes) {

        Product p = new Product();
        p.setTitle(title);
        p.setBrand(brand);
        p.setColor(color);
        p.setPrice(price);
        p.setDiscountedPrice(discountedPrice);
        p.setDiscountPercent(discount);
        p.setImageUrl(image);
        p.setCategory(cat);
        p.setSizes(sizes);
        p.setQuantity(sizes.stream().mapToInt(Size::getQuantity).sum());
        p.setCreatedAt(LocalDateTime.now());

        repo.save(p);
    }

    // ------------------- KURTAS -------------------
    private void addKurtas(ProductRepository repo, Category cat) {
        saveProduct(repo, cat, "White Cotton Kurta", "Manyavar", "white", 2999, 1999, 33,
                img("white1"), Set.of(size("S", 8), size("M", 10), size("L", 7)));

        saveProduct(repo, cat, "Classic White Kurta", "Fabindia", "white", 3499, 2499, 29,
                img("white2"), Set.of(size("M", 12), size("L", 10)));

        saveProduct(repo, cat, "Navy Blue Festive Kurta", "Peter England", "blue", 2799, 1999, 28,
                img("blue1"), Set.of(size("L", 14), size("XL", 8)));

        saveProduct(repo, cat, "Royal Blue Silk Kurta", "Raymond", "blue", 4499, 3199, 30,
                img("blue2"), Set.of(size("S", 3), size("M", 5), size("L", 4), size("XL", 2)));

        saveProduct(repo, cat, "Black Designer Kurta", "Manyavar", "black", 4999, 3599, 35,
                img("black1"), Set.of(size("M", 7), size("L", 12)));

        saveProduct(repo, cat, "Matte Black Kurta", "Fabindia", "black", 2799, 1999, 29,
                img("black2"), Set.of(size("S", 9), size("M", 11), size("XL", 3)));

        saveProduct(repo, cat, "Red Festival Kurta", "Manyavar", "red", 3999, 2999, 25,
                img("red1"), Set.of(size("M", 10), size("L", 5)));

        saveProduct(repo, cat, "Maroon Kurta", "Raymond", "red", 3299, 2399, 27,
                img("red2"), Set.of(size("L", 15), size("XL", 9)));

        saveProduct(repo, cat, "Green Ethnic Kurta", "Peter England", "green", 3599, 2599, 28,
                img("green1"), Set.of(size("M", 18)));

        saveProduct(repo, cat, "Olive Traditional Kurta", "Fabindia", "green", 2799, 2050, 26,
                img("green2"), Set.of(size("S", 4), size("M", 9), size("XXL", 3)));

        saveProduct(repo, cat, "Classic White Kurta2", "Fabindia", "white", 3491, 2499, 29,
                img("white2"), Set.of(size("M", 12), size("L", 10)));
        saveProduct(repo, cat, "Classic White Kurta", "Fabiewndia", "white", 3499, 2499, 29,
                img("white2"), Set.of(size("M", 12), size("L", 10)));
        saveProduct(repo, cat, "Classic Whiewte Kurta", "Fabindiewewa", "white", 3499, 2499, 29,
                img("white2"), Set.of(size("M", 12), size("L", 10)));
        saveProduct(repo, cat, "Classic Whweeqeqwite Kurta", "Fabindqweqia", "white", 3499, 2499, 29,
                img("white2"), Set.of(size("M", 12), size("L", 10)));
    }

    // ------------------- JEANS -------------------
    private void addJeans(ProductRepository repo, Category cat) {
        saveProduct(repo, cat, "Black Slim Fit Jeans", "Levi's", "black", 3499, 2499, 29,
                jeans("1"), Set.of(size("30", 12), size("32", 10), size("34", 7)));

        saveProduct(repo, cat, "Dark Blue Regular Fit Jeans", "Wrangler", "blue", 2799, 1999, 28,
                jeans("2"), Set.of(size("32", 14), size("36", 9)));

        saveProduct(repo, cat, "Navy Straight Jeans", "Diesel", "blue", 4499, 3299, 30,
                jeans("3"), Set.of(size("30", 8), size("34", 5), size("38", 3)));

        saveProduct(repo, cat, "Black Skinny Fit Jeans", "Lee", "black", 2999, 2399, 20,
                jeans("4"), Set.of(size("28", 7), size("30", 10), size("32", 12)));

        saveProduct(repo, cat, "Blue Tapered Fit Jeans", "Levi's", "blue", 3899, 2899, 25,
                jeans("5"), Set.of(size("32", 15), size("34", 10)));
    }

    // ------------------- SHOES -------------------
    private void addShoes(ProductRepository repo, Category cat) {
        saveProduct(repo, cat, "Nike Running Shoes", "Nike", "black", 5499, 3899, 29,
                shoes("1"), Set.of(size("UK 7", 5), size("UK 8", 12), size("UK 9", 6)));

        saveProduct(repo, cat, "Adidas Sports Shoes", "Adidas", "white", 4999, 3599, 28,
                shoes("2"), Set.of(size("UK 8", 10), size("UK 9", 7)));

        saveProduct(repo, cat, "Puma Street Sneakers", "Puma", "blue", 3999, 2899, 27,
                shoes("3"), Set.of(size("UK 6", 8), size("UK 7", 14), size("UK 9", 4)));

        saveProduct(repo, cat, "Bata Formal Shoes", "Bata", "brown", 2799, 1999, 21,
                shoes("4"), Set.of(size("UK 7", 11), size("UK 8", 5)));
    }

    private String img(String code) {
        return "https://images.unsplash.com/photo-15833917339" + code + "?w=400&h=520&fit=crop";
    }

    private String jeans(String code) {
        return "https://images.unsplash.com/photo-154227245431" + code + "?w=400&h=520&fit=crop";
    }

    private String shoes(String code) {
        return "https://images.unsplash.com/photo-1542291026" + code + "?w=400&h=520&fit=crop";
    }
}
