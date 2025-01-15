package gtu.codybuilders.shareneat.mapper;

import gtu.codybuilders.shareneat.dto.PostNutritiveValuesDto;
import gtu.codybuilders.shareneat.dto.PostRequest;
import gtu.codybuilders.shareneat.dto.PostResponse;
import gtu.codybuilders.shareneat.dto.ProductForPostDto;
import gtu.codybuilders.shareneat.model.Post;
import gtu.codybuilders.shareneat.model.Product;
import gtu.codybuilders.shareneat.model.User;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class PostMapper {

    public Post mapToPost(PostRequest postRequest, PostNutritiveValuesDto postNutritiveValues, User user, String imageUrl) {
        return Post.builder()
                .postName(postRequest.getPostName())
                .description(postRequest.getDescription())
                .user(user)
                .createdDate(Instant.now())
                .imageUrl(imageUrl) // Associate the uploaded image's URL
                .likeCount(0) // Default like count
                .averageRateExpert(0.0) // Default to 0.0 as Double
                .averageRateRegular(0.0) // Default to 0.0 as Double
                .totalRatersExpert(0) // Default to 0 as no expert raters initially
                .totalRatersRegular(0) // Default to 0 as no regular raters initially
                .carbs(postNutritiveValues.getCarbs() != null ? postNutritiveValues.getCarbs() : 0)
                .protein(postNutritiveValues.getProtein() != null ? postNutritiveValues.getProtein() : 0)
                .fat(postNutritiveValues.getFat() != null ? postNutritiveValues.getFat() : 0) // Default to 0 if null
                .calories(postNutritiveValues.getCalories() != null ? postNutritiveValues.getCalories() : 0)
                .build();
    }


    public PostResponse mapToPostResponse(Post post) {
        return PostResponse.builder()
                .postId(post.getPostId())
                .postName(post.getPostName())
                .description(post.getDescription())
                .username(post.getUser().getUsername())
                .createdDate(post.getCreatedDate())
                .likeCount(post.getLikeCount())
                .averageRateExpert(post.getAverageRateExpert())
                .averageRateRegular(post.getAverageRateRegular())
                .totalRatersExpert(post.getTotalRatersExpert())
                .totalRatersRegular(post.getTotalRatersRegular())
                .imageUrl(post.getImageUrl()) // Include image URL
                .carbs(post.getCarbs())
                .protein(post.getProtein())
                .fat(post.getFat())
                .calories(post.getCalories())
                // Map Product to ProductForPostDto for productQuantities
                .productQuantities(post.getProductQuantities().entrySet().stream()
                        .collect(Collectors.toMap(
                                entry -> mapToProductForPostDto(entry.getKey()), // Map Product to ProductForPostDto
                                Map.Entry::getValue
                        )))
                .build();
    }

    // Mapper method for Product -> ProductForPostDto
    private ProductForPostDto mapToProductForPostDto(Product product) {
        return new ProductForPostDto(
                product.getId(),
                product.getName(),
                product.getBrand(),
                product.getImageUrl()
        );
    }
}