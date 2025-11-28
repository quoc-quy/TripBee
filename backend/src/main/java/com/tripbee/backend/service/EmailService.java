package com.tripbee.backend.service;

import com.tripbee.backend.model.Booking;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.Builder;
import lombok.Data;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.text.NumberFormat;
import java.time.LocalDate;
import java.util.Locale;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final JavaMailSenderImpl javaMailSenderImpl;
    private final JavaMailSender javaMailSender;

    public EmailService(JavaMailSender mailSender, JavaMailSenderImpl javaMailSenderImpl, JavaMailSender javaMailSender) {
        this.mailSender = mailSender;
        this.javaMailSenderImpl = javaMailSenderImpl;
        this.javaMailSender = javaMailSender;
    }

    @Data
    @Builder
    public static class PaymentSuccessEmailData {
        private String toEmail;
        private String customerName;
        private String bookingId;
        private String tourTitle;
        private LocalDate startDate;
        private int numAdults;
        private int numChildren;
        private Double finalAmount;
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

    @Async
    public void sendPaymentSuccessEmail(PaymentSuccessEmailData data) {
        try {
            MimeMessage message = javaMailSenderImpl.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(data.getToEmail());
            helper.setSubject(String.format("Xác nhận thanh toán thành công - Mã đơn: %s", data.getBookingId()));

            // Format tiền tệ
            NumberFormat currencyFormatter = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));
            String formattedAmount = currencyFormatter.format(data.getFinalAmount());

            // Template HTML
            String htmlTemplate = """
                <h3>Xin chào %s,</h3>
                <p>TripBee xin thông báo giao dịch thanh toán của bạn đã được xác nhận <b>THÀNH CÔNG</b>.</p>
                <div style='background-color: #f0f9ff; padding: 15px; border-radius: 8px; border: 1px solid #bae6fd;'>
                    <h4>📦 Thông tin đơn hàng:</h4>
                    <ul>
                        <li><b>Mã đơn hàng:</b> %s</li>
                        <li><b>Tour du lịch:</b> %s</li>
                        <li><b>Ngày khởi hành:</b> %s</li>
                        <li><b>Số lượng:</b> %d Người lớn, %d Trẻ em</li>
                        <li><b>Tổng thanh toán:</b> <span style='color: #0284c7; font-weight: bold;'>%s</span></li>
                    </ul>
                </div>
                <p>Cảm ơn bạn đã tin tưởng và lựa chọn TripBee. Chúc bạn có một chuyến đi tuyệt vời!</p>
                <p>Trân trọng,<br/>Đội ngũ TripBee 🐝</p>
                """;

            // Fill dữ liệu vào template
            String htmlContent = String.format(htmlTemplate,
                    data.getCustomerName(),
                    data.getBookingId(),
                    data.getTourTitle(),
                    data.getStartDate(),
                    data.getNumAdults(),
                    data.getNumChildren(),
                    formattedAmount
            );

            helper.setText(htmlContent, true); // true để bật chế độ HTML

            javaMailSender.send(message);
            System.out.println("Payment success email sent to: " + data.getToEmail());

        } catch (MessagingException e) {
            System.err.println("Failed to send payment email: " + e.getMessage());
            e.printStackTrace();
        }
    }
}