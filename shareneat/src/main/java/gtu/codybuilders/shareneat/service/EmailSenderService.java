package gtu.codybuilders.shareneat.service;

public interface EmailSenderService {

    void sendPasswordResetEmail(String toEmail, String resetLink);
}