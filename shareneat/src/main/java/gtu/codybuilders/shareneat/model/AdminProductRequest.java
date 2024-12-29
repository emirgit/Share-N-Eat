package gtu.codybuilders.shareneat.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class AdminProductRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", referencedColumnName = "userId")
    private User user;

    private Instant requestTime;

    private String name;
    private String brand;
    private String description;
    private Double calories;
    private Double proteinGrams;
    private Double carbonhydrateGrams;
    private Double fatGrams;
    private Double sugarGrams;
    private String category;
    private Double quantity;



}
