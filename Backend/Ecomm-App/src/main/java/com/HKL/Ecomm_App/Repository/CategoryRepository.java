    package com.HKL.Ecomm_App.Repository;

    import com.HKL.Ecomm_App.Model.Category;
    import org.springframework.data.jpa.repository.JpaRepository;
    import org.springframework.data.jpa.repository.Query;
    import org.springframework.data.repository.query.Param;

    import java.util.List;
    import java.util.Optional;

    public interface CategoryRepository extends JpaRepository<Category, Long> {


        Optional<Category> findByNameIgnoreCaseAndParentCategory(String name, Category parent);
        List<Category> findByLevel(int level);
        List<Category> findByParentCategory(Category parent);
        List<Category> findByParentCategoryIsNull();


    }
