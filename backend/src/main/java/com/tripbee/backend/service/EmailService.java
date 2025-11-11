package com.tripbee.backend.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }
    @Async
    public void sendRegistrationSuccessEmail(String toEmail, String userName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();

            message.setTo(toEmail);
            message.setSubject("Chào mừng bạn đến với TripBee - Du lịch Việt Nam!");

            String body = String.format(
                    "Xin chào %s,\n\n" +
                            "Cảm ơn bạn đã đăng ký tài khoản tại TripBee!\n" +
                            "Bạn đã sẵn sàng khám phá những chuyến du lịch tuyệt vời tại Việt Nam.\n\n" +
                            "Thông tin tài khoản:\n" +
                            "Tên đăng nhập (Email): %s\n\n" +
                            "Hãy đăng nhập ngay để bắt đầu đặt tour và nhận các ưu đãi hấp dẫn.\n\n" +
                            "Trân trọng,\n" +
                            "Đội ngũ TripBee",
                    userName, toEmail);

            message.setText(body);

            mailSender.send(message);
            System.out.println("Registration success email sent to: " + toEmail);

        } catch (Exception e) {
            System.err.println("Error sending registration email to " + toEmail + ": " + e.getMessage());
        }
    }
}