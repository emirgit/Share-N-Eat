package gtu.codybuilders.shareneat.service.impl;

import gtu.codybuilders.shareneat.dto.RateDto;
import gtu.codybuilders.shareneat.exception.PostNotFoundException;
import gtu.codybuilders.shareneat.exception.UserNotFoundException;
import gtu.codybuilders.shareneat.model.Post;
import gtu.codybuilders.shareneat.model.Rate;
import gtu.codybuilders.shareneat.model.Role;
import gtu.codybuilders.shareneat.model.User;
import gtu.codybuilders.shareneat.repository.PostRepository;
import gtu.codybuilders.shareneat.repository.RateRepository;
import gtu.codybuilders.shareneat.repository.UserRepository;
import gtu.codybuilders.shareneat.service.RateService;
import gtu.codybuilders.shareneat.util.AuthUtil;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class RateServiceImpl implements RateService{

    private final RateRepository rateRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Transactional
    public void rate(RateDto rateDto) {
        Long userId = AuthUtil.getUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found !"));

        Post post = postRepository.findById(rateDto.getPostId())
                .orElseThrow(() -> new PostNotFoundException("Post Not Found with ID - " + rateDto.getPostId()));
        Optional<Rate> existingRate = rateRepository.findTopByPostAndUserOrderByRateIdDesc(post, user);

        if (existingRate.isPresent()) {
            Rate rate = existingRate.get();
            double oldRating = rate.getRating(); 
            rate.setRating(rateDto.getRating()); 
            rateRepository.save(rate);

            if(user.getRole() == Role.ROLE_USER){
                post.setAverageRateRegular(calculateUpdatedAverage(post.getAverageRateRegular(), post.getTotalRatersRegular(), oldRating, rateDto.getRating()));
            }else{
                post.setAverageRateExpert(calculateUpdatedAverage(post.getAverageRateExpert(), post.getTotalRatersExpert(), oldRating, rateDto.getRating()));
            }
        } else {
            Rate newRate = mapToRate(rateDto, post);
            rateRepository.save(newRate);
            
            if(user.getRole() == Role.ROLE_USER){
                post.setTotalRatersRegular(post.getTotalRatersRegular() + 1);
                post.setAverageRateRegular(calculateNewAverage(post.getAverageRateRegular(), post.getTotalRatersRegular(), rateDto.getRating()));
            }else{
                post.setTotalRatersExpert(post.getTotalRatersExpert() + 1);
                post.setAverageRateExpert(calculateNewAverage(post.getAverageRateExpert(), post.getTotalRatersExpert(), rateDto.getRating()));
            }
        }

        postRepository.save(post);
    }

    @Transactional
    public void unrate(Long postId) {
        Long userId = AuthUtil.getUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found!"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException("Post Not Found with ID - " + postId));

        Optional<Rate> existingRate = rateRepository.findTopByPostAndUserOrderByRateIdDesc(post, user);

        if (existingRate.isPresent()) {
            Rate rate = existingRate.get();
            double oldRating = rate.getRating();
            
            rateRepository.delete(rate); // Delete the rating

            // Update the average rating and total raters count based on user role
            if (user.getRole() == Role.ROLE_USER) {
                post.setTotalRatersRegular(post.getTotalRatersRegular() - 1);
                post.setAverageRateRegular(calculateUpdatedAverageOnUnrate(post.getAverageRateRegular(), post.getTotalRatersRegular(), oldRating));
            } else {
                post.setTotalRatersExpert(post.getTotalRatersExpert() - 1);
                post.setAverageRateExpert(calculateUpdatedAverageOnUnrate(post.getAverageRateExpert(), post.getTotalRatersExpert(), oldRating));
            }

            postRepository.save(post);
        } else {
            throw new IllegalArgumentException("No rating found for the user on this post.");
        }
    }

    private double calculateUpdatedAverageOnUnrate(Double currentAverage, Integer totalRaters, double oldRating) {
        if (totalRaters == 0) {
            return 0.0; // Reset to 0 if no raters left
        }

        return ((currentAverage * (totalRaters + 1)) - oldRating) / totalRaters;
    }

    private double calculateNewAverage(Double currentAverage, Integer totalRaters, double newRating) {
        if (totalRaters == 1) {
            return newRating;
        }

        double newAverage = ((currentAverage * (totalRaters - 1)) + newRating) / totalRaters;
        return newAverage;
    }

    private double calculateUpdatedAverage(Double currentAverage, Integer totalRaters, double oldRating, double newRating) {
        double updatedAverage = ((currentAverage * totalRaters) - oldRating + newRating) / totalRaters;
        return updatedAverage;
    }

    @Override
    @Transactional
    public Double getCurrentUserRate(Long postId) {
        Long userId = AuthUtil.getUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found!"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException("Post not found with ID - " + postId));

        Optional<Rate> existingRate = rateRepository.findTopByPostAndUserOrderByRateIdDesc(post, user);

        if (existingRate.isPresent()) {
            return existingRate.get().getRating();
        } else {
            return 0.0; // Return 0.0 if no rating exists
        }
    }

    private Rate mapToRate(RateDto rateDto, Post post) {
        Long userId = AuthUtil.getUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found !"));

        return Rate.builder()
                .rating(rateDto.getRating())
                .post(post)
                .user(user)
                .build();
    }
    
}
