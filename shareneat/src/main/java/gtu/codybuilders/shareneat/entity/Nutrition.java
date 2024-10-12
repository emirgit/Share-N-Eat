package gtu.codybuilders.shareneat.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Nutrition {

    private Double proteinGrams;
    private Double carbohydrateGrams;
    private Double fatGrams;

}
