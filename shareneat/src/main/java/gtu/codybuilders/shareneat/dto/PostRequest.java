package gtu.codybuilders.shareneat.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

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

    private List<ProductQuantityDto> productQuantities;
}
