package gtu.codybuilders.shareneat.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import gtu.codybuilders.shareneat.dto.PostResponse;
import gtu.codybuilders.shareneat.exception.PostNotFoundException;
import gtu.codybuilders.shareneat.exception.ShareDoneBeforeException;
import gtu.codybuilders.shareneat.exception.ShareNotFoundException;
import gtu.codybuilders.shareneat.exception.UserNotFoundException;
import gtu.codybuilders.shareneat.mapper.PostMapper;
import gtu.codybuilders.shareneat.model.Post;
import gtu.codybuilders.shareneat.model.Share;
import gtu.codybuilders.shareneat.model.User;
import gtu.codybuilders.shareneat.repository.PostRepository;
import gtu.codybuilders.shareneat.repository.ShareRepository;
import gtu.codybuilders.shareneat.repository.UserRepository;
import gtu.codybuilders.shareneat.service.ShareService;
import gtu.codybuilders.shareneat.util.AuthUtil;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
@Transactional
public class ShareServiceImpl implements ShareService {

    private final ShareRepository shareRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final PostMapper postMapper; 

    @Override
    public void save(Long postId) {
        Long userId = AuthUtil.getUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found!"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException("Post not found with id: " + postId));

        if (shareRepository.existsBySharedUserAndSharedPost(user, post)) {
            throw new ShareDoneBeforeException("Post already shared by this user.");
        }

        Share share = Share.builder()
                .sharedUser(user)
                .sharedPost(post)
                .build();

        shareRepository.save(share);
    }

    @Override
    public void delete(Long postId) {
        Long userId = AuthUtil.getUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found!"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException("Post not found with id: " + postId));

        Share share = shareRepository.findBySharedUserAndSharedPost(user, post)
                .orElseThrow(() -> new ShareNotFoundException("Share not found for this user and post."));

        shareRepository.delete(share);
    }

    @Override
    public List<PostResponse> getAllSharesCurrentUser() {
        Long userId = AuthUtil.getUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found!"));

        List<Share> shares = shareRepository.findAllBySharedUser(user);

        return shares.stream()
                .map(share -> postMapper.mapToPostResponse(share.getSharedPost()))
                .toList();
    }

    @Override
    public List<PostResponse> getAllSharesByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

        List<Share> shares = shareRepository.findAllBySharedUser(user);

        return shares.stream()
                .map(share -> postMapper.mapToPostResponse(share.getSharedPost()))
                .toList();
    }
}


