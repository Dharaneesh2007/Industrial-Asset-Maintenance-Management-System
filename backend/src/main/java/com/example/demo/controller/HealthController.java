package com.example.demo.controller;

import com.example.demo.dto.HealthMetricDto;
import com.example.demo.service.ConditionMonitoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
public class HealthController {

    private final ConditionMonitoringService conditionMonitoringService;

    @PostMapping({"", "/record"})
    @PreAuthorize("hasAnyRole('MAINTENANCE_TECHNICIAN', 'ASSET_MANAGER', 'SYSTEM_ADMIN')")
    public ResponseEntity<Void> recordHealthMetric(@RequestBody HealthMetricDto dto) {
        conditionMonitoringService.recordHealthMetric(dto);
        return ResponseEntity.ok().build();
    }
}