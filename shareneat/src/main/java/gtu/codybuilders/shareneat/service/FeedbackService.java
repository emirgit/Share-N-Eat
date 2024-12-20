package gtu.codybuilders.shareneat.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import gtu.codybuilders.shareneat.model.Feedback;
import gtu.codybuilders.shareneat.model.FeedbackStatus;

public interface FeedbackService {
    void save(String feedbackSubject, String feedbackMessage);
    void delete(Long feedbackId);
    void editFeedbackStatus(Long feedbackId, FeedbackStatus newStatus);
    Page<Feedback> getFeedbackPage(Pageable pageable);
}