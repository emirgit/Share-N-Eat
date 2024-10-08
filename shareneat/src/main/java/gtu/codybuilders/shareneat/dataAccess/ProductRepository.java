package gtu.codybuilders.shareneat.dataAccess;

import gtu.codybuilders.shareneat.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product,Long> {
}
