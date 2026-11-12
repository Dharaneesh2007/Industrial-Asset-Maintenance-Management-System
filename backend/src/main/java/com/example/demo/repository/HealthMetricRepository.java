package com.example.demo.repository;

import com.example.demo.entity.HealthMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface HealthMetricRepository extends JpaRepository<HealthMetric, Long> {
    List<HealthMetric> findByAssetIdOrderByRecordedAtDesc(Long assetId);
    Optional<HealthMetric> findTopByAssetIdOrderByRecordedAtDesc(Long assetId);
}