package gtu.codybuilders.shareneat.repository;

import gtu.codybuilders.shareneat.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product,Long> {
}
