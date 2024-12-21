package gtu.codybuilders.shareneat.service;

import gtu.codybuilders.shareneat.dto.FeedbackResponseDTO;
import gtu.codybuilders.shareneat.model.FeedbackStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface FeedbackService {
    void save(String feedbackSubject, String feedbackMessage);
    void delete(Long feedbackId);
    void editFeedbackStatus(Long feedbackId, FeedbackStatus newStatus);
    Page<FeedbackResponseDTO> getFeedbackPage(Pageable pageable);
}