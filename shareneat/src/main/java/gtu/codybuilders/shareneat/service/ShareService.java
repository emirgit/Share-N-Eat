package gtu.codybuilders.shareneat.service;

import java.util.List;

import gtu.codybuilders.shareneat.dto.PostResponse;

public interface ShareService {
    void save(Long postId);
    void delete(Long postId);
    List<PostResponse> getAllSharesCurrentUser();
    List<PostResponse> getAllSharesByUserId(Long userId);

}
