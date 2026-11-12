package com.example.demo.dto;

import com.example.demo.entity.MaintenanceSchedule;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleRequestDto {
    private Long assetId;
    private LocalDate plannedDate;
    private MaintenanceSchedule.MaintenanceType maintenanceType;
    private MaintenanceSchedule.Priority priority;
}