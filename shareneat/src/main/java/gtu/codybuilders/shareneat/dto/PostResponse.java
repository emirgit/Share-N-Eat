package gtu.codybuilders.shareneat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PostResponse {
    private Long postId;           
    private String postName;       
    private String description;
    private String imageUrl; // Relative URL or file path for the associated image
    private String username;
    // Nutritional Information
    private Integer carbs;   // Carbohydrates in grams
    private Integer protein; // Protein in grams
    private Integer fat;     // Fat in grams
    private Integer calories; // Total calories
    private Instant createdDate;
    private Integer likeCount; 
    private Double averageRateExpert;
    private Double averageRateRegular;   
    private Integer totalRatersExpert;
    private Integer totalRatersRegular;   
}
