package com.HKL.Ecomm_App.DTO;

import java.util.ArrayList;
import java.util.List;

public class CategoryTreeDTO {

    private Long id;       // ← ADD THIS
    private String name;
    private String slug;
    private int level;     // ← ADD THIS
    private List<CategoryTreeDTO> children = new ArrayList<>();

    public CategoryTreeDTO() {}

    public CategoryTreeDTO(Long id, String name, int level) {  // ← updated constructor
        this.id = id;
        this.name = name;
        this.slug = name;
        this.level = level;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getSlug() { return slug; }
    public int getLevel() { return level; }
    public List<CategoryTreeDTO> getChildren() { return children; }
    public void addChild(CategoryTreeDTO child) { this.children.add(child); }
}