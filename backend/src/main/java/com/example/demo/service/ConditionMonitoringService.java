package com.example.demo.service;

import com.example.demo.dto.HealthMetricDto;
import com.example.demo.entity.HealthMetric;
import com.example.demo.entity.IndustrialAsset;
import com.example.demo.entity.MaintenanceSchedule;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.HealthMetricRepository;
import com.example.demo.repository.IndustrialAssetRepository;
import com.example.demo.repository.MaintenanceScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ConditionMonitoringService {

    private final HealthMetricRepository healthMetricRepository;
    private final IndustrialAssetRepository assetRepository;
    private final MaintenanceScheduleRepository scheduleRepository;

    @Transactional
    public void recordHealthMetric(HealthMetricDto dto) {
        IndustrialAsset asset = assetRepository.findById(dto.getAssetId())
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found"));

        HealthMetric metric = HealthMetric.builder()
                .asset(asset)
                .recordedAt(LocalDateTime.now())
                .healthScore(dto.getHealthScore())
                .vibrationLevel(dto.getVibrationLevel())
                .temperatureCelsius(dto.getTemperatureCelsius())
                .build();
        healthMetricRepository.save(metric);

        asset.setCurrentHealth(dto.getHealthScore());

        if (dto.getHealthScore() <= 40) {
            MaintenanceSchedule emergencySchedule = MaintenanceSchedule.builder()
                    .asset(asset)
                    .plannedDate(LocalDate.now())
                    .maintenanceType(MaintenanceSchedule.MaintenanceType.REPAIR)
                    .priority(MaintenanceSchedule.Priority.CRITICAL)
                    .status(MaintenanceSchedule.ScheduleStatus.PENDING)
                    .build();
            scheduleRepository.save(emergencySchedule);

            asset.setCurrentStatus(IndustrialAsset.AssetStatus.UNDER_MAINTENANCE);
        }
        assetRepository.save(asset);
    }
}