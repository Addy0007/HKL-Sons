package com.HKL.Ecomm_App.Controller;

import com.HKL.Ecomm_App.DTO.CategoryTreeDTO;
import com.HKL.Ecomm_App.Model.Category;
import com.HKL.Ecomm_App.Repository.CategoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    // ── existing endpoint ──────────────────────────────────────────
    @GetMapping("/tree")
    public List<CategoryTreeDTO> getCategoryTree() {
        List<Category> topCategories = categoryRepository.findByParentCategoryIsNull();
        return topCategories.stream()
                .map(this::buildTree)
                .toList();
    }

    private CategoryTreeDTO buildTree(Category category) {
        CategoryTreeDTO dto = new CategoryTreeDTO(category.getName());
        List<Category> children = categoryRepository.findByParentCategory(category);
        for (Category child : children) {
            dto.addChild(buildTree(child));
        }
        return dto;
    }

    // ── NEW endpoint ───────────────────────────────────────────────
    // GET /api/categories/path/203
    // → ["women", "footwear", "heels"]
    // Frontend uses this to build /women/footwear/heels
    @GetMapping("/path/{categoryId}")
    public ResponseEntity<List<String>> getCategoryPath(@PathVariable Long categoryId) {
        List<String> path = new ArrayList<>();

        Optional<Category> current = categoryRepository.findById(categoryId);

        while (current.isPresent()) {
            path.add(0, current.get().getName()); // prepend → top-down order
            Category parent = current.get().getParentCategory();
            current = (parent != null)
                    ? categoryRepository.findById(parent.getId())
                    : Optional.empty();
        }

        // path is empty means category not found
        if (path.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(path);
    }
}