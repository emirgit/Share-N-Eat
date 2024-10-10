package gtu.codybuilders.shareneat.service.impl;

import org.springframework.stereotype.Service;

import gtu.codybuilders.shareneat.dto.PostRequest;
import gtu.codybuilders.shareneat.mapper.PostMapper;
import gtu.codybuilders.shareneat.model.Post;
import gtu.codybuilders.shareneat.repository.PostRepository;
import gtu.codybuilders.shareneat.service.PostService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
@Transactional
public class PostServiceImpl implements PostService{

    private final PostMapper postMapper;
    private final PostRepository postRepository;
    private final DummyAuthServiceImpl authService;

    public void save(PostRequest postRequest) {
        //TODO: for the post, we need to know the user, it will come from authenticationService
        Post createdPost =  postMapper.mapToPost(postRequest, authService.getCurrentUser());  
        postRepository.save(createdPost);
    } 

}
