package gtu.codybuilders.shareneat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminProductRequestRequestDTO {

    private String name;
    private String brand = "some hardcoded brand";
    private String description = "some hardcoded description";
    private Double calories;
    private Double proteinGrams;
    private Double carbonhydrateGrams;
    private Double fatGrams;
    private Double sugarGrams = 0.0;
    private String category = "seafood";
    private Double quantity;
}
