package gtu.codybuilders.shareneat.dto;

import gtu.codybuilders.shareneat.model.Nutrition;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductDeleteDTO {

    private Long id;
    private String name;
    private String brand;
    private Nutrition nutrition;

}
