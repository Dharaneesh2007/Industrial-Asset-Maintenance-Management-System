package com.example.demo.repository;

import com.example.demo.entity.MaintenanceLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.List;

public interface MaintenanceLogRepository extends JpaRepository<MaintenanceLog, Long> {
    List<MaintenanceLog> findByAssetId(Long assetId);

    @Query("SELECT SUM(l.costIncurred) FROM MaintenanceLog l WHERE l.asset.id = :assetId")
    BigDecimal sumCostByAssetId(@Param("assetId") Long assetId);
}