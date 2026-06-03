package com.tripbee.backend.config;

import com.tripbee.backend.model.CancellationPolicy;
import com.tripbee.backend.repository.CancellationPolicyRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final CancellationPolicyRepository policyRepository;

    public DataInitializer(CancellationPolicyRepository policyRepository) {
        this.policyRepository = policyRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        policyRepository.deleteAll(); // Xóa sạch để cập nhật chính sách mới
        policyRepository.save(new CancellationPolicy(10, 0.0));   // Hủy trước >= 10 ngày phạt 0% (Hoàn 100%)
        policyRepository.save(new CancellationPolicy(5, 50.0));   // Hủy trước từ 5 - 9 ngày phạt 50% (Hoàn 50%)
        policyRepository.save(new CancellationPolicy(0, 100.0));  // Hủy trước < 5 ngày phạt 100% (Hoàn 0%)
        System.out.println("Default cancellation policies seeded successfully.");
    }
}
