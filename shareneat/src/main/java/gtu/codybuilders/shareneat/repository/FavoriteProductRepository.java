package gtu.codybuilders.shareneat.repository;

import gtu.codybuilders.shareneat.model.FavoriteProduct;
import gtu.codybuilders.shareneat.model.Product;
import gtu.codybuilders.shareneat.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteProductRepository extends JpaRepository<FavoriteProduct, Long> {

    Optional<List<FavoriteProduct>> findByUser(User user);
    Optional<List<FavoriteProduct>> findByProduct(Product product);

    //buraya query gerekebilir. calismazsa findbyuser ve findbyproducti kullanarak service katmaninda yapabilirsin.
    Optional<FavoriteProduct> findByUserAndProduct(User user, Product product);
}
