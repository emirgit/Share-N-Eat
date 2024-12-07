package gtu.codybuilders.shareneat.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import gtu.codybuilders.shareneat.exception.UserNotFoundException;
import gtu.codybuilders.shareneat.model.Feedback;
import gtu.codybuilders.shareneat.model.User;
import gtu.codybuilders.shareneat.repository.FeedbackRepository;
import gtu.codybuilders.shareneat.repository.UserRepository;
import gtu.codybuilders.shareneat.service.FeedbackService;
import gtu.codybuilders.shareneat.util.AuthUtil;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
@Transactional
public class FeedbackServiceImpl implements FeedbackService{

    private final UserRepository userRepository;
    private final FeedbackRepository feedbackRepository;

    @Override
    public void save(String feedbackMessage) {
        Long userId = AuthUtil.getUserId();
    
        // Fetch the current user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found!"));
    
        // Create a new Feedback object
        Feedback feedback = new Feedback();
        feedback.setUser(user);
        feedback.setFeedbackMessage(feedbackMessage);
    
        // Save the feedback
        feedbackRepository.save(feedback);
    }

    @Override
    public void delete(Long feedbackId) {
        // Fetch feedback by ID
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new IllegalArgumentException("Feedback not found with ID: " + feedbackId));

        // Delete the feedback
        feedbackRepository.delete(feedback);
    }

    @Override
    public Page<Feedback> getFeedbackPage(Pageable pageable) {
        return feedbackRepository.findAll(pageable);
    }
    
}