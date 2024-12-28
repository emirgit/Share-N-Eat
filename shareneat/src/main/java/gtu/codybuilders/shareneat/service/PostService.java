package gtu.codybuilders.shareneat.service;

import gtu.codybuilders.shareneat.dto.PostRequest;
import gtu.codybuilders.shareneat.dto.PostResponse;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface PostService {
    void save(PostRequest postRequest, MultipartFile image);
    void delete(Long postId);
    void update(Long postId, PostRequest postRequest);
    Resource getImage(Long postId);
    List<PostResponse> getAllPosts(); 
    PostResponse getPostById(Long postId);   
    List<PostResponse> getAllPostsByUser(String username);  
    List<PostResponse> getPostsForUser();
    Page<PostResponse> searchPosts(String query, Pageable pageable);
    String returnProfilePhoto();

    List<PostResponse> getPostsForCurrentUserInRange(int page);
    List<PostResponse> getPostsByUsernameInRange(String username, int page);

    List<PostResponse> filterPosts(Map<String, String> filters);

    Long getPostsCount();
    Long getDailyPostCount();


}

