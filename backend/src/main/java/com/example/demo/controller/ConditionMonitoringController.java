package com.example.demo.controller;

import com.example.demo.dto.HealthMetricDto;
import com.example.demo.service.ConditionMonitoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/monitoring")
@RequiredArgsConstructor
public class ConditionMonitoringController {

    private final ConditionMonitoringService conditionMonitoringService;

    @PostMapping({"", "/metrics"})
    public ResponseEntity<Void> recordHealthMetric(@RequestBody HealthMetricDto dto) {
        conditionMonitoringService.recordHealthMetric(dto);
        return ResponseEntity.ok().build();
    }
}