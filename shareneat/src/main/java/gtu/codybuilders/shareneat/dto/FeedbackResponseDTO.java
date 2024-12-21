package gtu.codybuilders.shareneat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FeedbackResponseDTO {
    private Long feedbackId;
    private String feedbackSubject;
    private String feedbackMessage;
    private Instant createdDate;
    private String feedbackStatus;
    private String userName; // User's name
}
