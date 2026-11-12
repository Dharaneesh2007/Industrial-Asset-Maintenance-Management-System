package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "maintenance_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenanceLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "asset_id", nullable = false)
    private IndustrialAsset asset;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "schedule_id", unique = true)
    private MaintenanceSchedule schedule;

    @Column(name = "completion_date", nullable = false)
    private LocalDateTime completionDate;

    @ManyToOne
    @JoinColumn(name = "technician_id", nullable = false)
    private SystemUser technician;

    @Column(name = "work_description", nullable = false, columnDefinition = "TEXT")
    private String workDescription;

    @Column(name = "cost_incurred", nullable = false)
    private BigDecimal costIncurred;
}