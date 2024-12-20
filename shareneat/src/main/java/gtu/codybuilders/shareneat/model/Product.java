package gtu.codybuilders.shareneat.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

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
    private Instant created;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductComment> comments;

    private Double averageRateExpert;
    private Double averageRateRegular;
    private Integer totalRatersExpert;
    private Integer totalRatersRegular;

}
