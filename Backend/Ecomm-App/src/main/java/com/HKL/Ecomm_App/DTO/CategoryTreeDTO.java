package com.HKL.Ecomm_App.DTO;

import java.util.ArrayList;
import java.util.List;

public class CategoryTreeDTO {

    private String name;
    private String slug; // same as name but safe for URLs
    private List<CategoryTreeDTO> children = new ArrayList<>();

    public CategoryTreeDTO() {}

    public CategoryTreeDTO(String name) {
        this.name = name;
        this.slug = name;
    }

    public String getName() {
        return name;
    }

    public String getSlug() {
        return slug;
    }

    public List<CategoryTreeDTO> getChildren() {
        return children;
    }

    public void addChild(CategoryTreeDTO child) {
        this.children.add(child);
    }
}
