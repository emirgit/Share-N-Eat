package gtu.codybuilders.shareneat.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import gtu.codybuilders.shareneat.model.Feedback;

public interface FeedbackService {
    void save(String feedbackMessage);
    void delete(Long feedbackId);
    Page<Feedback> getFeedbackPage(Pageable pageable);

    
}