package gtu.codybuilders.shareneat.dto;

import gtu.codybuilders.shareneat.model.ProductComment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductResponseDTO {

    private Long id;
    private String name;
    private String brand;
    private String category;
    private String imageUrl;
    private String content;

    private Double calories;
    private Double proteinGrams;
    private Double carbonhydrateGrams;
    private Double fatGrams;
    private Double sugarGrams;

    private Double rating;
    private Integer ratingCount;
    private Integer numberOfComments;
    private Instant created;
    private List<ProductComment> comments;

    private Double averageRateExpert;
    private Double averageRateRegular;

}