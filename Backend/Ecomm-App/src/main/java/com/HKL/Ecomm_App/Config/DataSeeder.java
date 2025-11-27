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
                System.out.println("✔ Data already exists — Skipping seeding");
                return;
            }

            // ---------------- CATEGORIES ----------------
            Category men = saveCategory(categoryRepo, "men", 1, null);
            Category women = saveCategory(categoryRepo, "women", 1, null);
            Category lifestyle = saveCategory(categoryRepo, "lifestyle", 1, null);

            // Level 2
            Category menClothing = saveCategory(categoryRepo, "clothing", 2, men);
            Category menFootwear = saveCategory(categoryRepo, "footwear", 2, men);

            Category womenClothing = saveCategory(categoryRepo, "clothing", 2, women);

            Category decor = saveCategory(categoryRepo, "decor", 2, lifestyle);

            // Level 3
            Category kurtas = saveCategory(categoryRepo, "kurtas", 3, menClothing);
            Category shirts = saveCategory(categoryRepo, "shirts", 3, menClothing);
            Category jeans = saveCategory(categoryRepo, "jeans", 3, menClothing);
            Category shoes = saveCategory(categoryRepo, "shoes", 3, menFootwear);

            Category sarees = saveCategory(categoryRepo, "sarees", 3, womenClothing);
            Category sweaters = saveCategory(categoryRepo, "sweaters", 3, womenClothing);

            Category artifacts = saveCategory(categoryRepo, "artifacts", 3, decor);
            Category candles = saveCategory(categoryRepo, "candles", 3, decor);
            Category bags = saveCategory(categoryRepo, "bags", 3, decor);
            Category homeDecor = saveCategory(categoryRepo, "home-decor", 3, decor);

            // ---------------- ADD PRODUCTS ----------------
            addKurtas(productRepo, kurtas);
            addShirts(productRepo, shirts);
            addJeans(productRepo, jeans);
            addShoes(productRepo, shoes);

            addSarees(productRepo, sarees);
            addSweaters(productRepo, sweaters);

            addArtifacts(productRepo, artifacts);
            addCandles(productRepo, candles);
            addBags(productRepo, bags);
            addHomeDecor(productRepo, homeDecor);

            System.out.println("✔✔✔ DATA SEEDED SUCCESSFULLY ✔✔✔");
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

    // ------------------- REAL IMAGE URLS BELOW -------------------

    private void addKurtas(ProductRepository repo, Category cat) {
        saveProduct(repo, cat, "White Kurta", "Manyavar", "white", 2999, 1999, 33,
                "https://images.unsplash.com/photo-1602810318243-98a796af9d98?w=400",
                Set.of(size("M", 10), size("L", 7)));

        saveProduct(repo, cat, "Cotton Kurta", "Fabindia", "white", 2799, 1999, 28,
                "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400",
                Set.of(size("M", 8), size("L", 5)));

        saveProduct(repo, cat, "Blue Festive Kurta", "Peter England", "blue", 3499, 2499, 20,
                "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400",
                Set.of(size("L", 12)));

        saveProduct(repo, cat, "Royal Blue Silk Kurta", "Raymond", "blue", 4499, 2999, 25,
                "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400",
                Set.of(size("S", 3), size("M", 4), size("L", 2)));
    }

    private void addShirts(ProductRepository repo, Category cat) {
        saveProduct(repo, cat, "Formal Shirt", "Allen Solly", "white", 1799, 1299, 20,
                "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400",
                Set.of(size("M", 10), size("L", 6)));

        saveProduct(repo, cat, "Striped Shirt", "Louis Philippe", "blue", 2599, 1999, 23,
                "https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=400",
                Set.of(size("M", 11)));
    }

    private void addJeans(ProductRepository repo, Category cat) {
        saveProduct(repo, cat, "Blue Slim Fit", "Levi's", "blue", 3499, 2499, 29,
                "https://images.unsplash.com/photo-1542272454315-7f6fabf578a6?w=400",
                Set.of(size("32", 12), size("34", 10)));

        saveProduct(repo, cat, "Dark Blue Fit", "Wrangler", "blue", 2799, 1999, 28,
                "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=400",
                Set.of(size("34", 9)));
    }

    private void addShoes(ProductRepository repo, Category cat) {
        saveProduct(repo, cat, "Nike Running Shoes", "Nike", "black", 5499, 3899, 29,
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
                Set.of(size("UK 8", 5), size("UK 9", 7)));
    }

    private void addSarees(ProductRepository repo, Category cat) {
        saveProduct(repo, cat, "Silk Saree", "Sabyasachi", "red", 8999, 6299, 30,
                "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400",
                Set.of(size("Free", 15)));

        saveProduct(repo, cat, "Cotton Saree", "FabIndia", "yellow", 4499, 3299, 25,
                "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400",
                Set.of(size("Free", 10)));
    }

    private void addSweaters(ProductRepository repo, Category cat) {
        saveProduct(repo, cat, "Woolen Sweater", "Zara", "gray", 3499, 2499, 29,
                "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=400",
                Set.of(size("M", 6)));

        saveProduct(repo, cat, "Casual Sweater", "H&M", "cream", 2999, 2199, 26,
                "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400",
                Set.of(size("L", 9)));
    }

    private void addArtifacts(ProductRepository repo, Category cat) {
        saveProduct(repo, cat, "Decor Artifact", "Handmade", "multi", 1599, 999, 20,
                "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400",
                Set.of(size("Std", 10)));
    }

    private void addCandles(ProductRepository repo, Category cat) {
        saveProduct(repo, cat, "Scented Candle", "Aroma", "white", 999, 699, 25,
                "https://images.unsplash.com/photo-1517685352821-92cf88aee5a5?w=400",
                Set.of(size("Std", 20)));
    }

    private void addBags(ProductRepository repo, Category cat) {
        saveProduct(repo, cat, "Leather Bag", "Wildcraft", "brown", 2599, 1899, 20,
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
                Set.of(size("Std", 12)));
    }

    private void addHomeDecor(ProductRepository repo, Category cat) {
        saveProduct(repo, cat, "Wooden Home Decor", "ArtHouse", "brown", 1999, 1499, 18,
                "https://images.unsplash.com/photo-1505692794403-34cb1c39a4ba?w=400",
                Set.of(size("Std", 10)));
    }
}
