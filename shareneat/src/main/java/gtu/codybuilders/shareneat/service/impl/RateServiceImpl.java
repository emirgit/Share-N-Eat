package gtu.codybuilders.shareneat.service.impl;

import java.util.Optional;
import org.springframework.stereotype.Service;
import gtu.codybuilders.shareneat.dto.RateDto;
import gtu.codybuilders.shareneat.exceptions.PostNotFoundException;
import gtu.codybuilders.shareneat.model.Post;
import gtu.codybuilders.shareneat.model.Rate;
import gtu.codybuilders.shareneat.repository.PostRepository;
import gtu.codybuilders.shareneat.repository.RateRepository;
import gtu.codybuilders.shareneat.service.RateService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class RateServiceImpl implements RateService{

    private final RateRepository rateRepository;
    private final PostRepository postRepository;
    private final DummyAuthServiceImpl authService;

    @Transactional
    public void rate(RateDto rateDto) {
        Post post = postRepository.findById(rateDto.getPostId())
                .orElseThrow(() -> new PostNotFoundException("Post Not Found with ID - " + rateDto.getPostId()));
        //TODO: Current user is wanted form authService
        Optional<Rate> existingRate = rateRepository.findTopByPostAndUserOrderByRateIdDesc(post, authService.getCurrentUser());

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
        return Rate.builder()
                .rating(rateDto.getRating())
                .post(post)
                .user(authService.getCurrentUser()) //TODO: CurrentUser is wanted from authService
                .build();
    }
    
}
