package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "industrial_assets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IndustrialAsset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "asset_tag", unique = true, nullable = false)
    private String assetTag;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;

    @Column(name = "install_date", nullable = false)
    private LocalDate installDate;

    @Column(name = "purchase_price", nullable = false)
    private BigDecimal purchasePrice;

    @Column(name = "expected_lifespan_years", nullable = false)
    private Integer expectedLifespanYears;

    @Enumerated(EnumType.STRING)
    @Column(name = "current_status", nullable = false)
    private AssetStatus currentStatus;

    @Column(name = "current_health")
    private Integer currentHealth;

    public enum AssetStatus {
        ACTIVE,
        UNDER_MAINTENANCE,
        DECOMMISSIONED
    }
}