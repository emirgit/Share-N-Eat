package gtu.codybuilders.shareneat.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import gtu.codybuilders.shareneat.model.Feedback;
import gtu.codybuilders.shareneat.model.FeedbackStatus;
import gtu.codybuilders.shareneat.service.impl.FeedbackServiceImpl;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("api/feedbacks")
@AllArgsConstructor
public class FeedbackController {

    private final FeedbackServiceImpl feedbackService;

    @PostMapping("/sendFeedback")
    public ResponseEntity<Void> sendFeedback(@RequestBody String feedbackSubject, String feedbackMessage) {
        feedbackService.save(feedbackSubject, feedbackMessage);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @DeleteMapping("/deleteFeedback/{feedbackId}")
    public ResponseEntity<Void> deleteFeedback(@PathVariable Long feedbackId) {
        feedbackService.delete(feedbackId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    @PutMapping("/editFeedbackStatus/{feedbackId}")
    public ResponseEntity<Void> editFeedbackStatus(
            @PathVariable Long feedbackId,
            @RequestParam FeedbackStatus newStatus) {
        feedbackService.editFeedbackStatus(feedbackId, newStatus);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/getFeedback")
    public ResponseEntity<Page<Feedback>> getFeedback(
            @RequestParam(defaultValue = "0") int page, 
            @RequestParam(defaultValue = "10") int size) {
        Page<Feedback> feedbackPage = feedbackService.getFeedbackPage(PageRequest.of(page, size));
        return new ResponseEntity<>(feedbackPage, HttpStatus.OK);
    }
}
