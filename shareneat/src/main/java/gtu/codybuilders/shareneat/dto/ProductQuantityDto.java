package gtu.codybuilders.shareneat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductQuantityDto {
    private Long productId;
    private Double usedQuantity;
}

