package gtu.codybuilders.shareneat.service;

import org.springframework.stereotype.Service;

import gtu.codybuilders.shareneat.dto.PostRequest;
import gtu.codybuilders.shareneat.mapper.PostMapper;
import gtu.codybuilders.shareneat.model.Post;
import gtu.codybuilders.shareneat.repository.PostRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@AllArgsConstructor
@Slf4j
@Transactional
public class PostService {

    private final PostMapper postMapper;
    private final PostRepository postRepository;

    public void save(PostRequest postRequest) {
        Post createdPost =  postMapper.mapToPost(postRequest);
        postRepository.save(createdPost);
    } 

}
