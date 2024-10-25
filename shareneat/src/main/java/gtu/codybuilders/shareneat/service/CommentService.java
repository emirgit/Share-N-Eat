package gtu.codybuilders.shareneat.service;

import java.util.List;
import gtu.codybuilders.shareneat.dto.CommentDto;

public interface CommentService {
    void save(CommentDto commentDto);
    void delete(Long commentId);
    void update(Long commentId, CommentDto commentDto);
    List<CommentDto> getAllCommentsForPost(Long postId);
    List<CommentDto> getAllCommentsForUser(String userName);
}
