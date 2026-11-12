package com.example.demo.service;

import com.example.demo.dto.DashboardStatsDto;
import com.example.demo.entity.IndustrialAsset;
import com.example.demo.repository.IndustrialAssetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final IndustrialAssetRepository assetRepository;

    @Transactional(readOnly = true)
    public DashboardStatsDto getGlobalStats() {
        long totalAssets = assetRepository.count();
        long activeMaintenance = assetRepository.countByCurrentStatus(IndustrialAsset.AssetStatus.UNDER_MAINTENANCE);

        List<IndustrialAsset> assets = assetRepository.findAll();

        BigDecimal totalValue = assets.stream()
                .map(IndustrialAsset::getPurchasePrice)
                .filter(java.util.Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        double averageHealth = assets.isEmpty() ? 0.0 : assets.stream()
                .filter(a -> a.getCurrentHealth() != null)
                .mapToInt(IndustrialAsset::getCurrentHealth)
                .average()
                .orElse(0.0);

        Map<String, Long> statusDistribution = assets.stream()
                .filter(a -> a.getCurrentStatus() != null)
                .collect(Collectors.groupingBy(a -> a.getCurrentStatus().name(), Collectors.counting()));

        return DashboardStatsDto.builder()
                .totalAssets(totalAssets)
                .activeMaintenanceCount(activeMaintenance)
                .averageHealthScore(averageHealth)
                .totalFleetValue(totalValue)
                .statusDistribution(statusDistribution)
                .build();
    }
}