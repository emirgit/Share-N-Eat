package gtu.codybuilders.shareneat.controller;

import gtu.codybuilders.shareneat.dto.CommentDto;
import gtu.codybuilders.shareneat.service.impl.CommentServiceImpl;
import lombok.AllArgsConstructor;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comments")
@AllArgsConstructor
public class CommentController {
    private final CommentServiceImpl commentService;

    @PostMapping
    public ResponseEntity<Void> createComment(@RequestBody CommentDto commentsDto) {
        commentService.save(commentsDto);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        commentService.delete(commentId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<Void> updateComment(@PathVariable Long commentId, @RequestBody CommentDto commentDto) {
        commentService.update(commentId, commentDto);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping(params = "postId")
    public ResponseEntity<List<CommentDto>> getAllCommentsForPost(@RequestParam Long postId) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(commentService.getAllCommentsForPost(postId));
    }

    @GetMapping(params = "userName")
    public ResponseEntity<List<CommentDto>> getAllCommentsForUser(@RequestParam String userName){
        return ResponseEntity.status(HttpStatus.OK)
                .body(commentService.getAllCommentsForUser(userName));
    }

}
