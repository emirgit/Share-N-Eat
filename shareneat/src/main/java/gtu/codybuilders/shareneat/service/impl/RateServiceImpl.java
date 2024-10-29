package gtu.codybuilders.shareneat.service.impl;

import gtu.codybuilders.shareneat.dto.RateDto;
import gtu.codybuilders.shareneat.exception.PostNotFoundException;
import gtu.codybuilders.shareneat.exception.UserNotFoundException;
import gtu.codybuilders.shareneat.model.Post;
import gtu.codybuilders.shareneat.model.Rate;
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
        //TODO: Current user is wanted form authService
        Optional<Rate> existingRate = rateRepository.findTopByPostAndUserOrderByRateIdDesc(post, user);

        if (existingRate.isPresent()) {
            Rate rate = existingRate.get();
            double oldRating = rate.getRating(); 
            rate.setRating(rateDto.getRating()); 
            rateRepository.save(rate);

            post.setAverageRate(calculateUpdatedAverage(post.getAverageRate(), post.getTotalRaters(), oldRating, rateDto.getRating()));
        } else {
            Rate newRate = mapToRate(rateDto, post);
            rateRepository.save(newRate);
            
            post.setTotalRaters(post.getTotalRaters() + 1);
            post.setAverageRate(calculateNewAverage(post.getAverageRate(), post.getTotalRaters(), rateDto.getRating()));
        }

        postRepository.save(post);
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

    private Rate mapToRate(RateDto rateDto, Post post) {
        Long userId = AuthUtil.getUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found !"));

        return Rate.builder()
                .rating(rateDto.getRating())
                .post(post)
                .user(user) //TODO: CurrentUser is wanted from authService
                .build();
    }
    
}
