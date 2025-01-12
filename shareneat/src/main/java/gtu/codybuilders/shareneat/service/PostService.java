package gtu.codybuilders.shareneat.service;

import gtu.codybuilders.shareneat.dto.NutritionFilterDto;
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
    void update(Long postId, PostRequest postRequest, MultipartFile image);
    Resource getImage(Long postId);
    List<PostResponse> getAllPosts(); 
    PostResponse getPostById(Long postId);   
    List<PostResponse> getAllPostsByUser(String username);  
    Page<PostResponse> getPostsForUserTrendings(Pageable pageable);
    Page<PostResponse> getPostsForUserFollowings(Pageable pageable);
    Page<PostResponse> searchPosts(String query, Pageable pageable);
    String returnProfilePhoto();

    Page<PostResponse> findYourMeal(NutritionFilterDto nutritionFilterDto, Pageable pageable);

    List<PostResponse> getPostsForCurrentUserInRange(int page, int size);

    List<PostResponse> getPostsByUsernameInRange(String username, int page, int size);


    List<PostResponse> filterPosts(Map<String, String> filters);

    Long getPostsCount();
    Long getDailyPostCount();


}

