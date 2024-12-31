package gtu.codybuilders.shareneat.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NutritionInfo {
    // Fields holding nutritional values
    private Double calories;
    private Double proteinGrams;
    private Double carbonhydrateGrams;
    private Double fatGrams;

    // Field holding ingredient information
    private String content;

}
