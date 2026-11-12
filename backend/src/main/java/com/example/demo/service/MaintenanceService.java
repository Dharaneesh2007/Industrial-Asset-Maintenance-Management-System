package com.example.demo.service;

import com.example.demo.dto.LogRequestDto;
import com.example.demo.dto.ScheduleRequestDto;
import com.example.demo.entity.IndustrialAsset;
import com.example.demo.entity.MaintenanceLog;
import com.example.demo.entity.MaintenanceSchedule;
import com.example.demo.entity.SystemUser;
import com.example.demo.exception.BusinessValidationException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.IndustrialAssetRepository;
import com.example.demo.repository.MaintenanceLogRepository;
import com.example.demo.repository.MaintenanceScheduleRepository;
import com.example.demo.repository.SystemUserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class MaintenanceService {

    private final MaintenanceScheduleRepository scheduleRepository;
    private final MaintenanceLogRepository logRepository;
    private final IndustrialAssetRepository assetRepository;
    private final SystemUserRepository userRepository;

    public MaintenanceService(
            MaintenanceScheduleRepository scheduleRepository,
            MaintenanceLogRepository logRepository,
            IndustrialAssetRepository assetRepository,
            SystemUserRepository userRepository) {

        this.scheduleRepository = scheduleRepository;
        this.logRepository = logRepository;
        this.assetRepository = assetRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public MaintenanceSchedule createSchedule(ScheduleRequestDto dto) {
        IndustrialAsset asset = assetRepository.findById(dto.getAssetId())
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found"));

        MaintenanceSchedule schedule = MaintenanceSchedule.builder()
                .asset(asset)
                .plannedDate(dto.getPlannedDate() != null ? dto.getPlannedDate() : LocalDate.now())
                .maintenanceType(dto.getMaintenanceType() != null ? dto.getMaintenanceType() : MaintenanceSchedule.MaintenanceType.ROUTINE)
                .priority(dto.getPriority() != null ? dto.getPriority() : MaintenanceSchedule.Priority.MEDIUM)
                .status(MaintenanceSchedule.ScheduleStatus.PENDING)
                .build();

        if (schedule.getPriority() == MaintenanceSchedule.Priority.HIGH || schedule.getPriority() == MaintenanceSchedule.Priority.CRITICAL) {
            asset.setCurrentStatus(IndustrialAsset.AssetStatus.UNDER_MAINTENANCE);
            assetRepository.save(asset);
        }

        return scheduleRepository.save(schedule);
    }

    public List<MaintenanceSchedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }

    public List<MaintenanceLog> getAllLogs() {
        return logRepository.findAll();
    }

    @Transactional(rollbackFor = Exception.class)
    public MaintenanceLog completeMaintenanceTask(LogRequestDto dto) {

        MaintenanceSchedule schedule = scheduleRepository.findById(dto.getScheduleId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Schedule not found"));

        if (schedule.getStatus() != MaintenanceSchedule.ScheduleStatus.PENDING) {
            throw new BusinessValidationException("Task is already processed or cancelled");
        }

        SystemUser technician = userRepository.findById(dto.getTechnicianId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Technician not found"));

        schedule.setStatus(MaintenanceSchedule.ScheduleStatus.COMPLETED);

        scheduleRepository.save(schedule);

        IndustrialAsset asset = schedule.getAsset();

        if (asset != null) {
            asset.setCurrentStatus(IndustrialAsset.AssetStatus.ACTIVE);
            asset.setCurrentHealth(100);

            assetRepository.save(asset);
        }

        MaintenanceLog log = MaintenanceLog.builder()
                .asset(asset)
                .schedule(schedule)
                .completionDate(LocalDateTime.now())
                .technician(technician)
                .workDescription(dto.getWorkDescription())
                .costIncurred(dto.getCostIncurred())
                .build();

        return logRepository.save(log);
    }

    @Transactional
    public void deleteLog(Long id) {
        logRepository.deleteById(id);
    }
}