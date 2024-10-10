package gtu.codybuilders.shareneat.service.impl;

import java.util.List;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import gtu.codybuilders.shareneat.dto.CommentDto;
import gtu.codybuilders.shareneat.exceptions.PostNotFoundException;
import gtu.codybuilders.shareneat.mapper.CommentMapper;
import gtu.codybuilders.shareneat.model.Comment;
import gtu.codybuilders.shareneat.model.Post;
import gtu.codybuilders.shareneat.model.User;
import gtu.codybuilders.shareneat.repository.CommentRepository;
import gtu.codybuilders.shareneat.repository.PostRepository;
import gtu.codybuilders.shareneat.repository.UserRepository;
import gtu.codybuilders.shareneat.service.CommentService;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class CommentServiceImpl implements CommentService{
    
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final DummyAuthServiceImpl authService;
    private final CommentMapper commentMapper;

    public void save(CommentDto commentsDto) {
        Post post = postRepository.findById(commentsDto.getPostId())
                .orElseThrow(() -> new PostNotFoundException(commentsDto.getPostId().toString()));
        //TODO: Current user is called from authService.
        Comment comment = commentMapper.mapToComment(commentsDto, post, authService.getCurrentUser());
        commentRepository.save(comment);
    }

    public List<CommentDto> getAllCommentsForPost(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new PostNotFoundException(postId.toString()));
        return commentRepository.findByPost(post)
                                .stream()
                                .map(commentMapper::mapToDto).toList();
    }

    public List<CommentDto> getAllCommentsForUser(String userName) {
        User user = userRepository.findByUsername(userName)
                .orElseThrow(() -> new UsernameNotFoundException(userName));
        return commentRepository.findAllByUser(user)
                                .stream()
                                .map(commentMapper::mapToDto)
                                .toList();
    }
}
