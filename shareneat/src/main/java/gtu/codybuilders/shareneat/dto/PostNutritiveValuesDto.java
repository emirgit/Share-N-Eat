package gtu.codybuilders.shareneat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PostNutritiveValuesDto {
    private Integer carbs;
    private Integer protein;
    private Integer fat;
    private Integer calories;
}
