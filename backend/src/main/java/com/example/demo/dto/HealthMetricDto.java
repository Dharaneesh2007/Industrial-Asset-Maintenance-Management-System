package com.example.demo.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class HealthMetricDto {
    @NotNull(message = "Asset ID is required")
    private Long assetId;
    @NotNull(message = "Health score is required")
    private Integer healthScore;
    private Double vibrationLevel;
    private Double temperatureCelsius;
}