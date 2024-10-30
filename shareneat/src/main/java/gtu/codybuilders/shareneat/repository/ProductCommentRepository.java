package gtu.codybuilders.shareneat.repository;

import gtu.codybuilders.shareneat.dto.ProductCommentResponseDTO;
import gtu.codybuilders.shareneat.model.Product;
import gtu.codybuilders.shareneat.model.ProductComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductCommentRepository extends JpaRepository<ProductComment, Long> {

    //idk if this gonna work
    List<ProductCommentResponseDTO> findAllByProduct(Product product);
}
