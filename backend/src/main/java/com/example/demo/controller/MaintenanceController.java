package com.example.demo.controller;

import com.example.demo.dto.LogRequestDto;
import com.example.demo.dto.ScheduleRequestDto;
import com.example.demo.entity.MaintenanceLog;
import com.example.demo.entity.MaintenanceSchedule;
import com.example.demo.service.MaintenanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
@RequiredArgsConstructor
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    @PostMapping({"/schedule", "/schedules"})
    @PreAuthorize("hasAnyRole('ASSET_MANAGER', 'OPERATIONS_SUPERVISOR', 'SYSTEM_ADMIN', 'MAINTENANCE_TECHNICIAN')")
    public ResponseEntity<MaintenanceSchedule> createSchedule(@RequestBody ScheduleRequestDto dto) {
        return new ResponseEntity<>(maintenanceService.createSchedule(dto), HttpStatus.CREATED);
    }

    @GetMapping({"/schedules", "/schedule"})
    @PreAuthorize("hasAnyRole('ASSET_MANAGER', 'MAINTENANCE_TECHNICIAN', 'OPERATIONS_SUPERVISOR', 'SYSTEM_ADMIN')")
    public ResponseEntity<List<MaintenanceSchedule>> getAllSchedules() {
        return ResponseEntity.ok(maintenanceService.getAllSchedules());
    }

    @GetMapping("/logs")
    @PreAuthorize("hasAnyRole('ASSET_MANAGER', 'MAINTENANCE_TECHNICIAN', 'OPERATIONS_SUPERVISOR', 'SYSTEM_ADMIN')")
    public ResponseEntity<List<MaintenanceLog>> getAllLogs() {
        return ResponseEntity.ok(maintenanceService.getAllLogs());
    }

    @PostMapping("/complete")
    @PreAuthorize("hasRole('MAINTENANCE_TECHNICIAN')")
    public ResponseEntity<MaintenanceLog> completeMaintenanceTask(@Valid @RequestBody LogRequestDto dto) {
        MaintenanceLog log = maintenanceService.completeMaintenanceTask(dto);
        return ResponseEntity.ok(log);
    }

    @DeleteMapping("/logs/{id}")
    @PreAuthorize("hasAnyRole('ASSET_MANAGER', 'SYSTEM_ADMIN')")
    public ResponseEntity<String> deleteLog(@PathVariable Long id) {
        maintenanceService.deleteLog(id);
        return ResponseEntity.ok("MaintenanceLog deleted successfully.");
    }
}