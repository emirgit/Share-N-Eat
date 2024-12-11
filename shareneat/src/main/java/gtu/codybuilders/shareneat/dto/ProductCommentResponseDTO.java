package gtu.codybuilders.shareneat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductCommentResponseDTO {

    private Long id;
    private String text;
    private Long productId;
    private String userName;
    private Instant createdDate;

}
