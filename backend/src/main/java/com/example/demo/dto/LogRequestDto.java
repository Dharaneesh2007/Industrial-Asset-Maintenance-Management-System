package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class LogRequestDto {
    @NotNull(message = "Schedule ID is required")
    private Long scheduleId;

    @NotNull(message = "Technician ID is required")
    private Long technicianId;

    @NotBlank(message = "Work description is required")
    private String workDescription;

    @NotNull(message = "Cost incurred is required")
    private BigDecimal costIncurred;

    public Long getScheduleId() { return scheduleId; }
    public void setScheduleId(Long scheduleId) { this.scheduleId = scheduleId; }

    public Long getTechnicianId() { return technicianId; }
    public void setTechnicianId(Long technicianId) { this.technicianId = technicianId; }

    public String getWorkDescription() { return workDescription; }
    public void setWorkDescription(String workDescription) { this.workDescription = workDescription; }

    public BigDecimal getCostIncurred() { return costIncurred; }
    public void setCostIncurred(BigDecimal costIncurred) { this.costIncurred = costIncurred; }
}