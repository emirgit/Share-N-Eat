package gtu.codybuilders.shareneat.service.impl;

import gtu.codybuilders.shareneat.dto.PostRequest;
import gtu.codybuilders.shareneat.dto.PostResponse;
import gtu.codybuilders.shareneat.exception.PostNotFoundException;
import gtu.codybuilders.shareneat.exception.UserNotFoundException;
import gtu.codybuilders.shareneat.mapper.PostMapper;
import gtu.codybuilders.shareneat.model.Post;
import gtu.codybuilders.shareneat.model.User;
import gtu.codybuilders.shareneat.repository.PostRepository;
import gtu.codybuilders.shareneat.repository.UserRepository;
import gtu.codybuilders.shareneat.service.PostService;
import gtu.codybuilders.shareneat.util.AuthUtil;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
@Transactional
public class PostServiceImpl implements PostService{

    private final PostMapper postMapper;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Override
    public void save(PostRequest postRequest) {
        Long userId = AuthUtil.getUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found !"));
        Post createdPost =  postMapper.mapToPost(postRequest, user);
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
