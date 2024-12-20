package gtu.codybuilders.shareneat.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductRequestDTO {

    @NotBlank(message = "Name cannot be null")
    private String name;
    private String brand;
    private String category;
    private String imageUrl;
    private String content;

    private Double quantity;

    private Double calories;
    private Double proteinGrams;
    private Double carbonhydrateGrams;
    private Double fatGrams;
    private Double sugarGrams;

    private Double rating;
    private Integer ratingCount;
    private Integer numberOfComments;

}
