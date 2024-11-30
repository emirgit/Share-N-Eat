package gtu.codybuilders.shareneat.service;

import java.util.List;

import gtu.codybuilders.shareneat.dto.PostResponse;

public interface LikeService {
    void save(Long postId);
    void delete(Long postId);
    List<PostResponse> getAllLikesCurrentUser();
    List<PostResponse> getAllLikesByUserId(Long userId);
}
