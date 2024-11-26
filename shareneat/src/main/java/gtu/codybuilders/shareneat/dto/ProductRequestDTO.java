package gtu.codybuilders.shareneat.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductRequestDTO {

    @NotBlank(message = "product Name cannot be empty or null")
    @Size(max = 100, message = "Post Name cannot exceed 100 characters")
    private String name;
    private String brand;
    private String imageUrl;

    private Double calories;
    private Double proteinGrams;
    private Double carbohydrateGrams;
    private Double fatGrams;
    private Double sugarGrams;

    private Double rating;
    private Integer ratingCount;
    private Integer numberOfComments;

}
