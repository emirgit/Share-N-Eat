package gtu.codybuilders.shareneat.controller;

import gtu.codybuilders.shareneat.dto.FeedbackRequestDTO;
import gtu.codybuilders.shareneat.dto.FeedbackResponseDTO;
import gtu.codybuilders.shareneat.model.FeedbackStatus;
import gtu.codybuilders.shareneat.service.impl.FeedbackServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/feedbacks")
@AllArgsConstructor
public class FeedbackController {

    private final FeedbackServiceImpl feedbackService;

    // Receives new feedback (subject + message) from the front end
    @PostMapping("/sendFeedback")
    public ResponseEntity<Void> sendFeedback(@RequestBody FeedbackRequestDTO feedbackRequest) {
        feedbackService.save(feedbackRequest.getSubject(), feedbackRequest.getMessage());
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    // Deletes a feedback by ID
    @DeleteMapping("/deleteFeedback/{feedbackId}")
    public ResponseEntity<Void> deleteFeedback(@PathVariable Long feedbackId) {
        feedbackService.delete(feedbackId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Updates the status of an existing feedback ticket
    @PutMapping("/editFeedbackStatus/{feedbackId}")
    public ResponseEntity<Void> editFeedbackStatus(
            @PathVariable Long feedbackId,
            @RequestParam FeedbackStatus newStatus) {
        feedbackService.editFeedbackStatus(feedbackId, newStatus);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // Retrieves feedback in a paginated format
    @GetMapping("/getFeedback")
    public ResponseEntity<Page<FeedbackResponseDTO>> getFeedback(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<FeedbackResponseDTO> feedbackPage = feedbackService.getFeedbackPage(pageable);
        return ResponseEntity.ok(feedbackPage);
    }
}
