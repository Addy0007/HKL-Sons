package com.HKL.Ecomm_App.Config;

import com.HKL.Ecomm_App.Model.Category;
import com.HKL.Ecomm_App.Model.Product;
import com.HKL.Ecomm_App.Model.ProductImage;
import com.HKL.Ecomm_App.Model.Size;
import com.HKL.Ecomm_App.Repository.CategoryRepository;
import com.HKL.Ecomm_App.Repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
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

        // Save product first to get ID
        Product savedProduct = repo.save(p);

        // Create ProductImage entities for all images
        if (additionalImages != null && !additionalImages.isEmpty()) {
            List<ProductImage> productImages = new ArrayList<>();

            // Main image (order 0)
            ProductImage mainImg = new ProductImage();
            mainImg.setImageUrl(mainImage);
            mainImg.setDisplayOrder(0);
            mainImg.setAltText(title);
            mainImg.setProduct(savedProduct);
            productImages.add(mainImg);

            // Additional images (order 1, 2, 3...)
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

    // ------------------- KURTAS -------------------
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
                "Elegant white cotton kurta perfect for festive occasions and weddings. Features intricate embroidery on the collar and cuffs. Made from 100% pure cotton for maximum comfort.",
                "Premium cotton fabric, Intricate embroidery, Comfortable fit, Perfect for festive occasions",
                "100% Cotton",
                "Machine wash cold, Do not bleach, Iron on low heat",
                Set.of(size("M", 10), size("L", 7), size("XL", 5))
        );

        saveProduct(repo, cat,
                "Royal Blue Silk Kurta", "Raymond", "blue",
                4499, 2999, 33,
                "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600",
                List.of(
                        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600",
                        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600",
                        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600"
                ),
                "Luxurious royal blue silk kurta with golden threadwork. Perfect for weddings and special occasions. The rich silk fabric drapes beautifully and adds elegance to your look.",
                "Pure silk fabric, Golden threadwork, Traditional design, Comfortable wear",
                "Pure Silk",
                "Dry clean only, Do not iron directly",
                Set.of(size("S", 3), size("M", 4), size("L", 2))
        );
    }

    // ------------------- SHIRTS -------------------
    private void addShirts(ProductRepository repo, Category cat) {
        saveProduct(repo, cat,
                "Formal White Shirt", "Allen Solly", "white",
                1799, 1299, 28,
                "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600",
                List.of(
                        "https://images.unsplash.com/photo-1602810318304-c62d4d8cb03c?w=600",
                        "https://images.unsplash.com/photo-1602810317536-5d5e7f8965e0?w=600",
                        "https://images.unsplash.com/photo-1602810317816-d086b9c41e6e?w=600"
                ),
                "Classic white formal shirt perfect for office wear. Made from premium cotton blend fabric that stays crisp throughout the day. Features a regular fit design with button-down collar.",
                "Non-iron fabric, Regular fit, Button-down collar, Professional look",
                "60% Cotton 40% Polyester",
                "Machine wash warm, Tumble dry low, Iron if needed",
                Set.of(size("M", 10), size("L", 6), size("XL", 4))
        );

        saveProduct(repo, cat,
                "Blue Striped Shirt", "Louis Philippe", "blue",
                2599, 1999, 23,
                "https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=600",
                List.of(
                        "https://images.unsplash.com/photo-1598032895397-b9c35df0b93c?w=600",
                        "https://images.unsplash.com/photo-1602810318243-98a796af9d98?w=600",
                        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600"
                ),
                "Stylish blue striped formal shirt that adds a touch of sophistication to your wardrobe. Perfect for business meetings and formal events. Slim fit design for a modern look.",
                "Slim fit design, Striped pattern, Premium fabric, Wrinkle-resistant",
                "Cotton Blend",
                "Machine wash cold, Iron on medium heat",
                Set.of(size("M", 11), size("L", 8))
        );
    }

    // ------------------- JEANS -------------------
    private void addJeans(ProductRepository repo, Category cat) {
        saveProduct(repo, cat,
                "Blue Slim Fit Jeans", "Levi's", "blue",
                3499, 2499, 29,
                "https://images.unsplash.com/photo-1542272454315-7f6fabf578a6?w=600",
                List.of(
                        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600",
                        "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600",
                        "https://images.unsplash.com/photo-1541840031508-326b77c9a17e?w=600"
                ),
                "Classic blue slim fit jeans from Levi's. Made from premium denim with just the right amount of stretch for all-day comfort. Features the iconic Levi's red tab and signature stitching.",
                "Stretch denim, Slim fit, Classic 5-pocket design, Durable construction",
                "98% Cotton 2% Elastane",
                "Machine wash cold inside out, Do not bleach, Tumble dry low",
                Set.of(size("30", 8), size("32", 12), size("34", 10))
        );

        saveProduct(repo, cat,
                "Dark Blue Jeans", "Wrangler", "blue",
                2799, 1999, 28,
                "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600",
                List.of(
                        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600",
                        "https://images.unsplash.com/photo-1542272454315-7f6fabf578a6?w=600",
                        "https://images.unsplash.com/photo-1541840031508-326b77c9a17e?w=600"
                ),
                "Dark blue regular fit jeans perfect for casual wear. Features a comfortable mid-rise waist and straight leg design. Made from durable denim that gets better with age.",
                "Regular fit, Mid-rise waist, Straight leg, Durable denim",
                "100% Cotton Denim",
                "Machine wash cold, Do not bleach, Hang dry",
                Set.of(size("32", 7), size("34", 9), size("36", 6))
        );
    }

    // ------------------- SHOES -------------------
    private void addShoes(ProductRepository repo, Category cat) {
        saveProduct(repo, cat,
                "Nike Air Max Running Shoes", "Nike", "black",
                5499, 3899, 29,
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
                List.of(
                        "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=600",
                        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600",
                        "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600"
                ),
                "Premium Nike Air Max running shoes designed for maximum comfort and performance. Features Nike's signature Air cushioning technology for superior shock absorption. Perfect for running, gym, or casual wear.",
                "Air cushioning technology, Breathable mesh upper, Durable rubber outsole, Lightweight design",
                "Synthetic and Mesh",
                "Wipe with damp cloth, Air dry away from direct heat",
                Set.of(size("UK 7", 4), size("UK 8", 5), size("UK 9", 7), size("UK 10", 3))
        );
    }

    // ------------------- SAREES -------------------
    private void addSarees(ProductRepository repo, Category cat) {
        saveProduct(repo, cat,
                "Elegant Silk Saree", "Sabyasachi", "red",
                8999, 6299, 30,
                "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600",
                List.of(
                        "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600",
                        "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600",
                        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&fit=crop&crop=left"
                ),
                "Exquisite red silk saree with traditional golden zari work. Perfect for weddings and festive occasions. The rich silk drapes beautifully and the intricate embroidery adds elegance. Comes with matching blouse piece.",
                "Pure silk fabric, Golden zari work, Traditional design, Includes blouse piece",
                "Pure Silk with Zari",
                "Dry clean only, Store in cool dry place",
                Set.of(size("Free Size", 15))
        );

        saveProduct(repo, cat,
                "Cotton Handloom Saree", "FabIndia", "yellow",
                4499, 3299, 27,
                "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600",
                List.of(
                        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600",
                        "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600",
                        "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&fit=crop"
                ),
                "Beautiful yellow cotton handloom saree with traditional weave patterns. Comfortable for daily wear yet elegant enough for special occasions. Supports local artisans. Comes with unstitched blouse piece.",
                "Handloom cotton, Traditional weave, Comfortable wear, Supports artisans",
                "100% Cotton",
                "Hand wash or gentle machine wash, Dry in shade",
                Set.of(size("Free Size", 10))
        );
    }

    // ------------------- SWEATERS -------------------
    private void addSweaters(ProductRepository repo, Category cat) {
        saveProduct(repo, cat,
                "Woolen Cardigan Sweater", "Zara", "gray",
                3499, 2499, 29,
                "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600",
                List.of(
                        "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600",
                        "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600&fit=crop",
                        "https://images.unsplash.com/photo-1620799139834-6b8f844fbe29?w=600"
                ),
                "Cozy gray woolen cardigan sweater perfect for winter. Features a classic button-front design and ribbed cuffs. Made from soft wool blend that keeps you warm without being bulky.",
                "Soft wool blend, Button-front design, Ribbed cuffs, Warm and comfortable",
                "70% Wool 30% Acrylic",
                "Hand wash in cold water, Dry flat, Do not wring",
                Set.of(size("M", 6), size("L", 8), size("XL", 4))
        );
    }

    // ------------------- LIFESTYLE PRODUCTS -------------------
    private void addArtifacts(ProductRepository repo, Category cat) {
        saveProduct(repo, cat,
                "Handcrafted Wooden Artifact", "Handmade", "brown",
                1599, 999, 38,
                "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600",
                List.of(
                        "https://images.unsplash.com/photo-1505692794403-34cb1c39a4ba?w=600",
                        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&fit=crop",
                        "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600"
                ),
                "Beautiful handcrafted wooden artifact perfect for home decor. Each piece is unique and made by skilled artisans. Adds a touch of elegance to any room. Perfect as a gift or for your own collection.",
                "Handcrafted by artisans, Unique design, Natural wood finish, Perfect for home decor",
                "Natural Wood",
                "Wipe with soft dry cloth, Avoid water and direct sunlight",
                Set.of(size("Standard", 10))
        );
    }

    private void addCandles(ProductRepository repo, Category cat) {
        saveProduct(repo, cat,
                "Lavender Scented Candle", "Aroma", "white",
                999, 699, 30,
                "https://images.unsplash.com/photo-1517685352821-92cf88aee5a5?w=600",
                List.of(
                        "https://images.unsplash.com/photo-1602874801006-926d71e2bfb3?w=600",
                        "https://images.unsplash.com/photo-1517685352821-92cf88aee5a5?w=600&fit=crop",
                        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600"
                ),
                "Relaxing lavender scented candle that creates a calming ambiance. Made from natural soy wax with essential oils. Burns cleanly for up to 30 hours. Perfect for meditation, yoga, or unwinding after a long day.",
                "Natural soy wax, Lavender essential oil, 30 hour burn time, Calming fragrance",
                "Soy Wax with Essential Oils",
                "Trim wick before each use, Keep away from children and pets",
                Set.of(size("Standard", 20))
        );
    }

    private void addBags(ProductRepository repo, Category cat) {
        saveProduct(repo, cat,
                "Leather Backpack", "Wildcraft", "brown",
                2599, 1899, 27,
                "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
                List.of(
                        "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600",
                        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&fit=crop",
                        "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=600"
                ),
                "Stylish brown leather backpack perfect for daily use. Features multiple compartments including a padded laptop sleeve. Made from genuine leather that ages beautifully. Water-resistant and durable.",
                "Genuine leather, Laptop compartment, Multiple pockets, Water-resistant",
                "Genuine Leather",
                "Wipe with damp cloth, Condition leather periodically",
                Set.of(size("Standard", 12))
        );
    }

    private void addHomeDecor(ProductRepository repo, Category cat) {
        saveProduct(repo, cat,
                "Rustic Wooden Wall Art", "ArtHouse", "brown",
                1999, 1499, 25,
                "https://images.unsplash.com/photo-1505692794403-34cb1c39a4ba?w=600",
                List.of(
                        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600",
                        "https://images.unsplash.com/photo-1505692794403-34cb1c39a4ba?w=600&fit=crop",
                        "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600"
                ),
                "Stunning rustic wooden wall art that adds character to any room. Handcrafted from reclaimed wood with natural finish. Easy to hang and makes a bold statement. Perfect for living rooms, bedrooms, or offices.",
                "Reclaimed wood, Handcrafted, Natural finish, Easy to hang",
                "Reclaimed Wood",
                "Dust with soft cloth, Keep away from moisture",
                Set.of(size("Standard", 10))
        );
    }
}