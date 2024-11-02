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
    private String url;            
    private String username;       
    private Instant createdDate;
    private Integer likeCount; 
    private Double averageRateExpert;
    private Double averageRateRegular;   
    private Integer totalRatersExpert;
    private Integer totalRatersRegular;   
}
