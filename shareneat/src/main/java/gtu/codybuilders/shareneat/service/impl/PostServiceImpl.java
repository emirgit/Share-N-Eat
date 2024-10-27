package gtu.codybuilders.shareneat.service.impl;

import java.util.List;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import gtu.codybuilders.shareneat.dto.PostRequest;
import gtu.codybuilders.shareneat.dto.PostResponse;
import gtu.codybuilders.shareneat.exception.PostNotFoundException;
import gtu.codybuilders.shareneat.mapper.PostMapper;
import gtu.codybuilders.shareneat.model.Post;
import gtu.codybuilders.shareneat.model.User;
import gtu.codybuilders.shareneat.repository.PostRepository;
import gtu.codybuilders.shareneat.repository.UserRepository;
import gtu.codybuilders.shareneat.service.PostService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
@Transactional
public class PostServiceImpl implements PostService{

    private final PostMapper postMapper;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final DummyAuthServiceImpl authService;

    @Override
    public void save(PostRequest postRequest) {
        //TODO: for the post, we need to know the user, it will come from authenticationService
        Post createdPost =  postMapper.mapToPost(postRequest, authService.getCurrentUser());  
        postRepository.save(createdPost);
    } 

    @Override
    public void delete(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException("Post not found with id: " + postId));
        postRepository.delete(post);
    }

    @Override
    public void update(Long postId, PostRequest postRequest) {
        Post existingPost = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException("Post not found with id: " + postId));

        existingPost.setPostName(postRequest.getPostName());
        existingPost.setDescription(postRequest.getDescription());
        existingPost.setUrl(postRequest.getUrl());

        postRepository.save(existingPost);
    }

    @Override
    public List<PostResponse> getAllPosts() {
        return postRepository.findAll()
                             .stream()
                             .map(postMapper::mapToPostResponse)
                             .toList();
    }

    @Override
    public PostResponse getPostById(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException(postId.toString()));
        return postMapper.mapToPostResponse(post);
    }

    @Override
    public List<PostResponse> getAllPostsByUser(String userName) {
        User user = userRepository.findByUsername(userName)
                .orElseThrow(() -> new UsernameNotFoundException(userName));
        return postRepository.findAllByUser(user)
                             .stream()
                             .map(postMapper::mapToPostResponse)
                             .toList();
    }

}
