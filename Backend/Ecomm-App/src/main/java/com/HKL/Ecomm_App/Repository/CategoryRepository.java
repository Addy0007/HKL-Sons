package com.HKL.Ecomm_App.Repository;

import com.HKL.Ecomm_App.Model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    Category findByName(String name);

    @Query("""
    SELECT c FROM Category c 
    WHERE c.name = :name 
    AND (:parentCategoryName IS NULL AND c.parentCategory IS NULL 
         OR c.parentCategory.name = :parentCategoryName)
""")
    Category findByNameAndParent(
            @Param("name") String name,
            @Param("parentCategoryName") String parentCategoryName
    );
}
