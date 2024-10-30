package gtu.codybuilders.shareneat.dto;

import gtu.codybuilders.shareneat.model.Product;
import gtu.codybuilders.shareneat.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductCommentRequestDTO {

    private String text;
    private Product product;
    private User user;
    private Instant createdDate;
}
