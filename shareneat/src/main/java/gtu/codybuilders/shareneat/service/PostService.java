package gtu.codybuilders.shareneat.service;

import gtu.codybuilders.shareneat.dto.PostRequest;
import gtu.codybuilders.shareneat.dto.PostResponse;

import java.util.List;

public interface PostService {
    void save(PostRequest postRequest);
    void delete(Long postId);
    void update(Long postId, PostRequest postRequest);
    List<PostResponse> getAllPosts(); 
    PostResponse getPostById(Long postId);   
    List<PostResponse> getAllPostsByUser(String username);  
    List<PostResponse> getPostsForUser();
    List<PostResponse> searchPosts(String query);
    String returnProfilePhoto();

    List<PostResponse> getPostsForCurrentUserInRange(int start, int end);
}

