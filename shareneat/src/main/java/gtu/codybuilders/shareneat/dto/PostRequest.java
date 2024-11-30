package gtu.codybuilders.shareneat.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PostRequest {
    
    @NotBlank(message = "Post Name cannot be empty or null")
    @Size(max = 100, message = "Post Name cannot exceed 100 characters")
    private String postName;

    @Size(max = 255, message = "Description cannot exceed 255 characters")
    private String description;

    @PositiveOrZero(message = "Fat must be zero or a positive number")
    private Integer fat;

    @PositiveOrZero(message = "Carbs must be zero or a positive number")
    private Integer carbs;

    @PositiveOrZero(message = "Protein must be zero or a positive number")
    private Integer protein;

    @PositiveOrZero(message = "Calories must be zero or a positive number")
    private Integer calories;
}
