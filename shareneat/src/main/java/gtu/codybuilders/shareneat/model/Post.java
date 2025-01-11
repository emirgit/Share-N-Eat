package gtu.codybuilders.shareneat.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long postId;
    @NotBlank(message = "The postname cannot be empty or NULL.")
    private String postName;
    @Lob
    private String description;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", referencedColumnName = "userId")
    private User user;
    private Instant createdDate;
    private Integer likeCount;
    private Double averageRateExpert;
    private Double averageRateRegular;
    private Integer totalRatersExpert;
    private Integer totalRatersRegular;

    private String imageUrl;

    // Nutritional Information
    private Integer carbs;   // Carbohydrates in grams
    private Integer protein; // Protein in grams
    private Integer fat;     // Fat in grams
    private Integer calories; // Total calories

    @ElementCollection
    @CollectionTable(name = "post_product_quantities", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "used_quantity")
    @MapKeyJoinColumn(name = "product_id")
    private Map<Product, Double> productQuantities = new HashMap<>();

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments;

    @OneToMany(mappedBy = "likedPost", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Like> likes;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Rate> rates;
}
