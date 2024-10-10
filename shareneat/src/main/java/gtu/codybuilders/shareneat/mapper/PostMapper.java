package gtu.codybuilders.shareneat.mapper;

import gtu.codybuilders.shareneat.dto.PostRequest;
import gtu.codybuilders.shareneat.model.Post;
import gtu.codybuilders.shareneat.model.User;

import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class PostMapper {

    // TODO: this mapping method should take user.
    public Post mapToPost(PostRequest postRequest, User user) {
        return Post.builder()
                .postName(postRequest.getPostName())
                .description(postRequest.getDescription())
                .url(postRequest.getUrl())
                .user(user)  //TODO there must be a user to map it
                .createdDate(Instant.now())  
                .averageRate(0.0)            
                .totalRaters(0)              
                .build();
    }

    public PostRequest mapToDto(Post post) {
        return PostRequest.builder()
                .postId(post.getPostId())
                .postName(post.getPostName())
                .description(post.getDescription())
                .url(post.getUrl())
                .build();
    }
}
