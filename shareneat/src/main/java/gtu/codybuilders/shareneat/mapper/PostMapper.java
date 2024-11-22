package gtu.codybuilders.shareneat.mapper;

import gtu.codybuilders.shareneat.dto.PostRequest;
import gtu.codybuilders.shareneat.dto.PostResponse;
import gtu.codybuilders.shareneat.model.Post;
import gtu.codybuilders.shareneat.model.User;

import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class PostMapper {

    public Post mapToPost(PostRequest postRequest, User user, String imageUrl) {
        return Post.builder()
                .postName(postRequest.getPostName())
                .description(postRequest.getDescription())
                .fat(postRequest.getFat() != null ? postRequest.getFat() : 0) // Default to 0 if null
                .carbs(postRequest.getCarbs() != null ? postRequest.getCarbs() : 0)
                .protein(postRequest.getProtein() != null ? postRequest.getProtein() : 0)
                .calories(postRequest.getCalories() != null ? postRequest.getCalories() : 0)
                .user(user)
                .createdDate(Instant.now())
                .imageUrl(imageUrl) // Associate the uploaded image's URL
                .likeCount(0) // Default like count
                .averageRateExpert(0.0) // Default to 0.0 as Double
                .averageRateRegular(0.0) // Default to 0.0 as Double
                .totalRatersExpert(0) // Default to 0 as no expert raters initially
                .totalRatersRegular(0) // Default to 0 as no regular raters initially
                .build();
    }


    public PostRequest mapToDto(Post post) {
        return PostRequest.builder()
                .postName(post.getPostName())
                .description(post.getDescription())
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
                .build();
    }
}
