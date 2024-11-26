package gtu.codybuilders.shareneat.service;

import gtu.codybuilders.shareneat.dto.PostRequest;
import gtu.codybuilders.shareneat.dto.PostResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface PostService {
    public void save(PostRequest postRequest, MultipartFile image);
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

