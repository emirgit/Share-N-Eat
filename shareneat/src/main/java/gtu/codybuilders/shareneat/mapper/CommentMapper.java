package gtu.codybuilders.shareneat.mapper;

import org.springframework.stereotype.Component;

import gtu.codybuilders.shareneat.dto.CommentDto;
import gtu.codybuilders.shareneat.model.Comment;
import gtu.codybuilders.shareneat.model.Post;
import gtu.codybuilders.shareneat.model.User;

@Component
public class CommentMapper {
    
    public Comment mapToComment(CommentDto commentDto, Post post, User user) {
        return Comment.builder()
                .id(commentDto.getId())
                .text(commentDto.getText())
                .post(post)  
                .user(user)  
                .createdDate(commentDto.getCreatedDate())  
                .build();
    }

    public CommentDto mapToDto(Comment comment) {
        return CommentDto.builder()
                .id(comment.getId())
                .postId(comment.getPost().getPostId())  
                .createdDate(comment.getCreatedDate())
                .text(comment.getText())
                .userName(comment.getUser().getUsername())  
                .build();
    }
}
