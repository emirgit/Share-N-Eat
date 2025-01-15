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

    private Double rating = 0.0;
    private Integer ratingCount = 0;
    private Integer numberOfComments = 0;
    private Instant created;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductComment> comments;

    private Double averageRateExpert = 0.0;
    private Double averageRateRegular = 0.0;
    private Integer totalRatersExpert = 0;
    private Integer totalRatersRegular = 0;

}