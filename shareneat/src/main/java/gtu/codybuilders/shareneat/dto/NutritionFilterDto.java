package gtu.codybuilders.shareneat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NutritionFilterDto {
    private Integer minCarbs;
    private Integer maxCarbs;
    private Integer minFat;
    private Integer maxFat;
    private Integer minProtein;
    private Integer maxProtein;
    private Integer minCalories;
    private Integer maxCalories;
}
