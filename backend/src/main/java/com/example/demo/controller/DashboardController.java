package com.example.demo.controller;

import com.example.demo.dto.DashboardStatsDto;
import com.example.demo.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping({"", "/stats"})
    @PreAuthorize("hasAnyRole('ASSET_MANAGER', 'OPERATIONS_SUPERVISOR', 'SYSTEM_ADMIN', 'MAINTENANCE_TECHNICIAN')")
    public ResponseEntity<DashboardStatsDto> getGlobalStats() {
        return ResponseEntity.ok(dashboardService.getGlobalStats());
    }
}