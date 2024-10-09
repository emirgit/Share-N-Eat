package gtu.codybuilders.shareneat.model;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Product {
    private Long productId;
    private String name;
    private Double grams;
    private Double calories;      
    private Double protein;       
    private Double carbohydrates; 
    private Double fats;          
    private Double fiber;         
    private Double sugar;         
}
