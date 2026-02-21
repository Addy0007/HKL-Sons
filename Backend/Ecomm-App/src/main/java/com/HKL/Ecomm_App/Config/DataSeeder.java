package com.HKL.Ecomm_App.Config;

import com.HKL.Ecomm_App.Model.Category;
import com.HKL.Ecomm_App.Model.Product;
import com.HKL.Ecomm_App.Model.ProductImage;
import com.HKL.Ecomm_App.Model.Size;
import com.HKL.Ecomm_App.Repository.CategoryRepository;
import com.HKL.Ecomm_App.Repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class DataSeeder {

    // ⚠️ @Bean removed — seeder disabled for production
    // Uncomment @Bean below only for local dev testing
    // @Bean
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

            Category menClothing = saveCategory(categoryRepo, "clothing", 2, men);
            Category menFootwear = saveCategory(categoryRepo, "footwear", 2, men);
            Category womenClothing = saveCategory(categoryRepo, "clothing", 2, women);
            Category decor = saveCategory(categoryRepo, "decor", 2, lifestyle);

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
                             String mainImage,
                             List<String> additionalImages,
                             String description,
                             String highlights,
                             String material,
                             String careInstructions,
                             Set<Size> sizes) {

        Product p = new Product();
        p.setTitle(title);
        p.setBrand(brand);
        p.setColor(color);
        p.setPrice(price);
        p.setDiscountedPrice(discountedPrice);
        p.setDiscountPercent(discount);
        p.setImageUrl(mainImage);
        p.setDescription(description);
        p.setHighlights(highlights);
        p.setMaterial(material);
        p.setCareInstructions(careInstructions);
        p.setCountryOfOrigin("India");
        p.setManufacturer(brand);
        p.setCategory(cat);
        p.setSizes(sizes);
        p.setQuantity(sizes.stream().mapToInt(Size::getQuantity).sum());
        p.setCreatedAt(LocalDateTime.now());

        Product savedProduct = repo.save(p);

        if (additionalImages != null && !additionalImages.isEmpty()) {
            List<ProductImage> productImages = new ArrayList<>();

            ProductImage mainImg = new ProductImage();
            mainImg.setImageUrl(mainImage);
            mainImg.setDisplayOrder(0);
            mainImg.setAltText(title);
            mainImg.setProduct(savedProduct);
            productImages.add(mainImg);

            for (int i = 0; i < additionalImages.size(); i++) {
                ProductImage img = new ProductImage();
                img.setImageUrl(additionalImages.get(i));
                img.setDisplayOrder(i + 1);
                img.setAltText(title + " - View " + (i + 2));
                img.setProduct(savedProduct);
                productImages.add(img);
            }

            savedProduct.setImages(productImages);
            repo.save(savedProduct);
        }
    }

    private void addKurtas(ProductRepository repo, Category cat) {
        saveProduct(repo, cat,
                "White Cotton Kurta", "Manyavar", "white",
                2999, 1999, 33,
                "https://images.unsplash.com/photo-1602810318243-98a796af9d98?w=600",
                List.of(
                        "https://images.unsplash.com/photo-1602810318243-98a796af9d98?w=600&fit=crop&crop=right",
                        "https://images.unsplash.com/photo-1602810318243-98a796af9d98?w=600&fit=crop&crop=left",
                        "https://images.unsplash.com/photo-1602810318243-98a796af9d98?w=600&fit=crop&crop=top"
                ),
                "Elegant white cotton kurta perfect for festive occasions.",
                "Premium cotton fabric, Intricate embroidery, Comfortable fit",
                "100% Cotton", "Machine wash cold, Do not bleach",
                Set.of(size("M", 10), size("L", 7), size("XL", 5))
        );
    }

    private void addShirts(ProductRepository repo, Category cat) {
        saveProduct(repo, cat,
                "Formal White Shirt", "Allen Solly", "white",
                1799, 1299, 28,
                "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600",
                List.of(),
                "Classic white formal shirt.",
                "Non-iron fabric, Regular fit",
                "60% Cotton 40% Polyester", "Machine wash warm",
                Set.of(size("M", 10), size("L", 6), size("XL", 4))
        );
    }

    private void addJeans(ProductRepository repo, Category cat) {
        saveProduct(repo, cat,
                "Blue Slim Fit Jeans", "Levi's", "blue",
                3499, 2499, 29,
                "https://images.unsplash.com/photo-1542272454315-7f6fabf578a6?w=600",
                List.of(),
                "Classic blue slim fit jeans.",
                "Stretch denim, Slim fit",
                "98% Cotton 2% Elastane", "Machine wash cold inside out",
                Set.of(size("30", 8), size("32", 12), size("34", 10))
        );
    }

    private void addShoes(ProductRepository repo, Category cat) {
        saveProduct(repo, cat,
                "Nike Air Max Running Shoes", "Nike", "black",
                5499, 3899, 29,
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
                List.of(),
                "Premium Nike Air Max running shoes.",
                "Air cushioning, Breathable mesh",
                "Synthetic and Mesh", "Wipe with damp cloth",
                Set.of(size("UK 7", 4), size("UK 8", 5), size("UK 9", 7))
        );
    }

    private void addSarees(ProductRepository repo, Category cat) {
        saveProduct(repo, cat,
                "Elegant Silk Saree", "Sabyasachi", "red",
                8999, 6299, 30,
                "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600",
                List.of(),
                "Exquisite red silk saree.",
                "Pure silk fabric, Golden zari work",
                "Pure Silk with Zari", "Dry clean only",
                Set.of(size("Free Size", 15))
        );
    }

    private void addSweaters(ProductRepository repo, Category cat) {
        saveProduct(repo, cat,
                "Woolen Cardigan Sweater", "Zara", "gray",
                3499, 2499, 29,
                "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600",
                List.of(),
                "Cozy gray woolen cardigan sweater.",
                "Soft wool blend, Button-front design",
                "70% Wool 30% Acrylic", "Hand wash in cold water",
                Set.of(size("M", 6), size("L", 8), size("XL", 4))
        );
    }

    private void addArtifacts(ProductRepository repo, Category cat) {
        saveProduct(repo, cat,
                "Handcrafted Wooden Artifact", "Handmade", "brown",
                1599, 999, 38,
                "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600",
                List.of(),
                "Beautiful handcrafted wooden artifact.",
                "Handcrafted, Natural wood finish",
                "Natural Wood", "Wipe with soft dry cloth",
                Set.of(size("Standard", 10))
        );
    }

    private void addCandles(ProductRepository repo, Category cat) {
        saveProduct(repo, cat,
                "Lavender Scented Candle", "Aroma", "white",
                999, 699, 30,
                "https://images.unsplash.com/photo-1517685352821-92cf88aee5a5?w=600",
                List.of(),
                "Relaxing lavender scented candle.",
                "Natural soy wax, 30 hour burn time",
                "Soy Wax with Essential Oils", "Trim wick before each use",
                Set.of(size("Standard", 20))
        );
    }

    private void addBags(ProductRepository repo, Category cat) {
        saveProduct(repo, cat,
                "Leather Backpack", "Wildcraft", "brown",
                2599, 1899, 27,
                "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
                List.of(),
                "Stylish brown leather backpack.",
                "Genuine leather, Laptop compartment",
                "Genuine Leather", "Wipe with damp cloth",
                Set.of(size("Standard", 12))
        );
    }

    private void addHomeDecor(ProductRepository repo, Category cat) {
        saveProduct(repo, cat,
                "Rustic Wooden Wall Art", "ArtHouse", "brown",
                1999, 1499, 25,
                "https://images.unsplash.com/photo-1505692794403-34cb1c39a4ba?w=600",
                List.of(),
                "Stunning rustic wooden wall art.",
                "Reclaimed wood, Handcrafted",
                "Reclaimed Wood", "Dust with soft cloth",
                Set.of(size("Standard", 10))
        );
    }
}