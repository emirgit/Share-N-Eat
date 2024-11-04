package gtu.codybuilders.shareneat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductCommentRequestDTO {

    private String text;
    private Long productId;
    private Instant createdDate;
}
