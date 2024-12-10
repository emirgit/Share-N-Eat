package gtu.codybuilders.shareneat.service.impl;

import gtu.codybuilders.shareneat.dto.CommentDto;
import gtu.codybuilders.shareneat.exception.CommentNotFoundException;
import gtu.codybuilders.shareneat.exception.PostNotFoundException;
import gtu.codybuilders.shareneat.exception.UserNotFoundException;
import gtu.codybuilders.shareneat.mapper.CommentMapper;
import gtu.codybuilders.shareneat.model.Comment;
import gtu.codybuilders.shareneat.model.Post;
import gtu.codybuilders.shareneat.model.User;
import gtu.codybuilders.shareneat.repository.CommentRepository;
import gtu.codybuilders.shareneat.repository.PostRepository;
import gtu.codybuilders.shareneat.repository.UserRepository;
import gtu.codybuilders.shareneat.service.CommentService;
import gtu.codybuilders.shareneat.util.AuthUtil;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CommentServiceImpl implements CommentService {
    
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final CommentMapper commentMapper;

    @Override
    public void save(CommentDto commentsDto) {
        Long userId = AuthUtil.getUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found !"));
        Post post = postRepository.findById(commentsDto.getPostId())
                .orElseThrow(() -> new PostNotFoundException(commentsDto.getPostId().toString()));
        Comment comment = commentMapper.mapToComment(commentsDto, post, user);
        commentRepository.save(comment);
    }

    @Override
    public void delete(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CommentNotFoundException("Comment not found with id: " + commentId));
        commentRepository.delete(comment);
    }

    @Override
    public void update(Long commentId, CommentDto commentDto) {
        Comment existingComment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CommentNotFoundException("Comment not found with id: " + commentId));
        
        existingComment.setText(commentDto.getText()); 
        commentRepository.save(existingComment);
    }

    @Override
    public List<CommentDto> getAllCommentsForPost(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new PostNotFoundException(postId.toString()));
        return commentRepository.findByPost(post)
                                .stream()
                                .map(commentMapper::mapToDto)
                                .toList();
    }

    @Override
    public List<CommentDto> getAllCommentsForUser() {
        Long userId = AuthUtil.getUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found !"));
        return commentRepository.findAllByUser(user)
                                .stream()
                                .map(commentMapper::mapToDto)
                                .toList();
    }

}
