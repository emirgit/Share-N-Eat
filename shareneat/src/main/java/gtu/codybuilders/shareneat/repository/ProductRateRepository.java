package gtu.codybuilders.shareneat.repository;

import gtu.codybuilders.shareneat.model.Product;
import gtu.codybuilders.shareneat.model.ProductRate;
import gtu.codybuilders.shareneat.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRateRepository extends JpaRepository<ProductRate, Long> {

    Optional<ProductRate> findByProductAndUser(Product product, User user);

}
