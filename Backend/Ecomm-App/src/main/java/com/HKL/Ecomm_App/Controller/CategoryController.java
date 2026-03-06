package com.HKL.Ecomm_App.Controller;

import com.HKL.Ecomm_App.DTO.CategoryTreeDTO;
import com.HKL.Ecomm_App.Model.Category;
import com.HKL.Ecomm_App.Repository.CategoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.LinkedHashMap;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    // ── GET /api/categories/tree ───────────────────────────────────
    @GetMapping("/tree")
    public List<CategoryTreeDTO> getCategoryTree() {
        List<Category> all = categoryRepository.findAll();

        Map<Long, CategoryTreeDTO> dtoMap = new LinkedHashMap<>();
        for (Category c : all) {
            dtoMap.put(c.getId(), new CategoryTreeDTO(c.getId(), c.getName(), c.getLevel()));
        }

        List<CategoryTreeDTO> roots = new ArrayList<>();
        for (Category c : all) {
            if (c.getParentCategory() == null) {
                roots.add(dtoMap.get(c.getId()));
            } else {
                CategoryTreeDTO parent = dtoMap.get(c.getParentCategory().getId());
                if (parent != null) parent.addChild(dtoMap.get(c.getId()));
            }
        }
        return roots;
    }


    // ── GET /api/categories/path/{categoryId} ──────────────────────
    @GetMapping("/path/{categoryId}")
    public ResponseEntity<List<String>> getCategoryPath(@PathVariable Long categoryId) {
        List<String> path = new ArrayList<>();

        Optional<Category> current = categoryRepository.findById(categoryId);

        while (current.isPresent()) {
            path.add(0, current.get().getName());
            Category parent = current.get().getParentCategory();
            current = (parent != null)
                    ? categoryRepository.findById(parent.getId())
                    : Optional.empty();
        }

        if (path.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(path);
    }

    // ── POST /api/categories ───────────────────────────────────────
    // Body: { "name": "jacket", "level": 3, "parentCategoryId": 55 }
    @PostMapping
    public ResponseEntity<?> createCategory(@RequestBody CreateCategoryRequest request) {
        // Prevent duplicate slugs at the same level under the same parent
        if (request.getParentCategoryId() != null) {
            Optional<Category> parent = categoryRepository.findById(request.getParentCategoryId());
            if (parent.isEmpty()) {
                return ResponseEntity.badRequest().body("Parent category not found");
            }

            List<Category> siblings = categoryRepository.findByParentCategory(parent.get());
            boolean alreadyExists = siblings.stream()
                    .anyMatch(c -> c.getName().equalsIgnoreCase(request.getName()));
            if (alreadyExists) {
                return ResponseEntity.badRequest().body("Category already exists under this parent");
            }

            Category newCategory = new Category();
            newCategory.setName(request.getName().toLowerCase().replace(" ", "-"));
            newCategory.setLevel(request.getLevel());
            newCategory.setParentCategory(parent.get());
            Category saved = categoryRepository.save(newCategory);
            return ResponseEntity.ok(saved);

        } else {
            // Top-level category — check for duplicates at level 1
            boolean alreadyExists = categoryRepository.findByParentCategoryIsNull().stream()
                    .anyMatch(c -> c.getName().equalsIgnoreCase(request.getName()));
            if (alreadyExists) {
                return ResponseEntity.badRequest().body("Top-level category already exists");
            }

            Category newCategory = new Category();
            newCategory.setName(request.getName().toLowerCase().replace(" ", "-"));
            newCategory.setLevel(request.getLevel());
            newCategory.setParentCategory(null);
            Category saved = categoryRepository.save(newCategory);
            return ResponseEntity.ok(saved);
        }
    }

    // ── Inner request DTO ──────────────────────────────────────────
    public static class CreateCategoryRequest {
        private String name;
        private int level;
        private Long parentCategoryId;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public int getLevel() { return level; }
        public void setLevel(int level) { this.level = level; }
        public Long getParentCategoryId() { return parentCategoryId; }
        public void setParentCategoryId(Long parentCategoryId) { this.parentCategoryId = parentCategoryId; }
    }
}