package gtu.codybuilders.shareneat.mapper;

import gtu.codybuilders.shareneat.dto.PostRequest;
import gtu.codybuilders.shareneat.model.Post;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class PostMapper {

    // Method to map PostRequest to Post entity
    public Post mapToPost(PostRequest postRequest) {
        return Post.builder()
                .postName(postRequest.getPostName())
                .description(postRequest.getDescription())
                .url(postRequest.getUrl())
                .createdDate(Instant.now())  // Set current time as the creation date
                .averageRate(0.0)            // Initialize average rate to 0
                .totalRaters(0)              // Initialize total raters to 0
                .build();
    }

    // Method to map Post entity back to PostRequest (if needed)
    public PostRequest mapToDto(Post post) {
        return PostRequest.builder()
                .postId(post.getPostId())
                .postName(post.getPostName())
                .description(post.getDescription())
                .url(post.getUrl())
                .build();
    }
}
