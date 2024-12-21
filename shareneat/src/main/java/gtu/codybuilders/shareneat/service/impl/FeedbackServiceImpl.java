package gtu.codybuilders.shareneat.service.impl;

import gtu.codybuilders.shareneat.dto.FeedbackResponseDTO;
import gtu.codybuilders.shareneat.exception.UserNotFoundException;
import gtu.codybuilders.shareneat.model.Feedback;
import gtu.codybuilders.shareneat.model.FeedbackStatus;
import gtu.codybuilders.shareneat.model.User;
import gtu.codybuilders.shareneat.repository.FeedbackRepository;
import gtu.codybuilders.shareneat.repository.UserRepository;
import gtu.codybuilders.shareneat.service.FeedbackService;
import gtu.codybuilders.shareneat.util.AuthUtil;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@AllArgsConstructor
@Transactional
public class FeedbackServiceImpl implements FeedbackService{

    private final UserRepository userRepository;
    private final FeedbackRepository feedbackRepository;

    @Override
    public void save(String feedbackSubject, String feedbackMessage) {
        Long userId = AuthUtil.getUserId();
    
        // Fetch the current user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found!"));
    
        // Create a new Feedback object
        Feedback feedback = new Feedback();
        feedback.setUser(user);
        feedback.setFeedbackSubject(feedbackSubject);
        feedback.setFeedbackMessage(feedbackMessage);
        feedback.setCreatedDate(Instant.now());
        feedback.setFeedbackStatus(FeedbackStatus.OPEN);
    
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
    public void editFeedbackStatus(Long feedbackId, FeedbackStatus newStatus) {
        // Fetch feedback by ID
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new IllegalArgumentException("Feedback not found with ID: " + feedbackId));
        
        // Update the status
        feedback.setFeedbackStatus(newStatus);
        
        // Save the updated feedback
        feedbackRepository.save(feedback);
    }

    public Page<FeedbackResponseDTO> getFeedbackPage(Pageable pageable) {
        return feedbackRepository.findAll(pageable).map(feedback -> {
            String userName = feedback.getUser() != null ? feedback.getUser().getUsername() : null; // Assuming User has a `name` field
            return new FeedbackResponseDTO(
                    feedback.getFeedbackId(),
                    feedback.getFeedbackSubject(),
                    feedback.getFeedbackMessage(),
                    feedback.getCreatedDate(),
                    feedback.getFeedbackStatus().name(), // Enum converted to String
                    userName
            );
        });
    }
    
}
