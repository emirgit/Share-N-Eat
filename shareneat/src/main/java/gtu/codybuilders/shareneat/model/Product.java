package gtu.codybuilders.shareneat.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String brand;
    private String name;

    private Double calories;
    private Double proteinGrams;
    private Double carbohydrateGrams;
    private Double fatGrams;

}
