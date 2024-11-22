package gtu.codybuilders.shareneat.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.Instant;
import java.util.List;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long postId;

    @NotBlank(message = "The post name cannot be empty or NULL.")
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

    private String imageUrl; // Relative URL or file path for the associated image

    // Nutritional Information
    private Integer carbs;   // Carbohydrates in grams
    private Integer protein; // Protein in grams
    private Integer fat;     // Fat in grams
    private Integer calories; // Total calories

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Rate> rates;
}
