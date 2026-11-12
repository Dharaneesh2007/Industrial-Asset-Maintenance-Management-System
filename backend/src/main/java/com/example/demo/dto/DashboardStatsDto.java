package com.example.demo.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
public class DashboardStatsDto {
    private long totalAssets;
    private long activeMaintenanceCount;
    private double averageHealthScore;
    private BigDecimal totalFleetValue;
    private Map<String, Long> statusDistribution;
}