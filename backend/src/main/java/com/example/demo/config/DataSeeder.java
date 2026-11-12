package com.example.demo.config;

import com.example.demo.entity.IndustrialAsset;
import com.example.demo.entity.SystemUser;
import com.example.demo.repository.IndustrialAssetRepository;
import com.example.demo.repository.SystemUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final SystemUserRepository userRepository;
    private final IndustrialAssetRepository assetRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedSystemUser("manager", "manager@assetarc.com", "password123", SystemUser.Role.ASSET_MANAGER);
        seedSystemUser("technician", "technician@assetarc.com", "password123", SystemUser.Role.MAINTENANCE_TECHNICIAN);
        seedSystemUser("supervisor", "supervisor@assetarc.com", "password123", SystemUser.Role.OPERATIONS_SUPERVISOR);
        seedSystemUser("admin", "admin@assetarc.com", "password123", SystemUser.Role.SYSTEM_ADMIN);

        seedAsset("CNC-001", "Precision CNC Milling Machine", "MANUFACTURING", LocalDate.of(2024, 3, 10), new BigDecimal("125000.00"), 12, IndustrialAsset.AssetStatus.ACTIVE, 95);
        seedAsset("PMP-102", "High-Pressure Cooling Pump", "UTILITIES", LocalDate.of(2025, 1, 20), new BigDecimal("38000.00"), 8, IndustrialAsset.AssetStatus.ACTIVE, 90);
        seedAsset("TRB-501", "Gas Turbine Generator", "POWER", LocalDate.of(2023, 11, 5), new BigDecimal("450000.00"), 20, IndustrialAsset.AssetStatus.ACTIVE, 85);
        seedAsset("ROB-204", "6-Axis Robotic Arm", "AUTOMATION", LocalDate.of(2024, 8, 15), new BigDecimal("95000.00"), 10, IndustrialAsset.AssetStatus.ACTIVE, 100);
    }

    private void seedSystemUser(String username, String email, String rawPassword, SystemUser.Role role) {
        if (userRepository.findByUsername(username).isEmpty()) {
            SystemUser user = SystemUser.builder()
                    .username(username)
                    .email(email)
                    .password(passwordEncoder.encode(rawPassword))
                    .role(role)
                    .build();
            userRepository.save(user);
        }
    }

    private void seedAsset(String assetTag, String name, String category, LocalDate installDate, BigDecimal purchasePrice, Integer lifespan, IndustrialAsset.AssetStatus status, Integer health) {
        if (assetRepository.findByAssetTag(assetTag).isEmpty()) {
            IndustrialAsset asset = IndustrialAsset.builder()
                    .assetTag(assetTag)
                    .name(name)
                    .category(category)
                    .installDate(installDate)
                    .purchasePrice(purchasePrice)
                    .expectedLifespanYears(lifespan)
                    .currentStatus(status)
                    .currentHealth(health)
                    .build();
            assetRepository.save(asset);
        }
    }
}