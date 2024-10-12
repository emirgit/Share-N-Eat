package gtu.codybuilders.shareneat.DTO.request;

import gtu.codybuilders.shareneat.entity.Nutrition;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductUpdateDTO {

    private Long id;
    private String name;
    private String brand;
    private Nutrition nutrition;
}
