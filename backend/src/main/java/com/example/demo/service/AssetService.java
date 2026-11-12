package com.example.demo.service;

import com.example.demo.dto.AssetRequestDto;
import com.example.demo.entity.IndustrialAsset;
import com.example.demo.entity.MaintenanceSchedule;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.IndustrialAssetRepository;
import com.example.demo.repository.MaintenanceScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AssetService {

    private final IndustrialAssetRepository repository;
    private final MaintenanceScheduleRepository scheduleRepository;

    public Page<IndustrialAsset> getAllAssets(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public IndustrialAsset getAssetById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found"));
    }

    @Transactional
    public IndustrialAsset createAsset(AssetRequestDto dto) {
        IndustrialAsset asset = IndustrialAsset.builder()
                .assetTag(dto.getAssetTag())
                .name(dto.getName())
                .category(dto.getCategory())
                .installDate(dto.getInstallDate())
                .purchasePrice(dto.getPurchasePrice())
                .expectedLifespanYears(dto.getExpectedLifespanYears())
                .currentStatus(IndustrialAsset.AssetStatus.ACTIVE)
                .currentHealth(100)
                .build();
        return repository.save(asset);
    }

    @Transactional
    public IndustrialAsset updateAsset(Long id, AssetRequestDto dto) {
        IndustrialAsset asset = getAssetById(id);
        asset.setAssetTag(dto.getAssetTag());
        asset.setName(dto.getName());
        asset.setCategory(dto.getCategory());
        asset.setInstallDate(dto.getInstallDate());
        asset.setPurchasePrice(dto.getPurchasePrice());
        asset.setExpectedLifespanYears(dto.getExpectedLifespanYears());
        return repository.save(asset);
    }

    @Transactional
    public void decommissionAsset(Long id) {
        IndustrialAsset asset = getAssetById(id);
        asset.setCurrentStatus(IndustrialAsset.AssetStatus.DECOMMISSIONED);
        repository.save(asset);

        List<MaintenanceSchedule> pendingSchedules = scheduleRepository
                .findByAssetIdAndStatus(id, MaintenanceSchedule.ScheduleStatus.PENDING);
        
        pendingSchedules.forEach(schedule -> schedule.setStatus(MaintenanceSchedule.ScheduleStatus.CANCELLED));
        scheduleRepository.saveAll(pendingSchedules);
    }
}