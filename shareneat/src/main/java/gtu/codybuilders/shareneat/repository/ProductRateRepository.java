package gtu.codybuilders.shareneat.repository;

import gtu.codybuilders.shareneat.model.ProductRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRateRepository extends JpaRepository<ProductRate, Long> {
}
