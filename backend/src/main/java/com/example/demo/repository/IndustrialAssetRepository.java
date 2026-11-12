package com.example.demo.repository;

import com.example.demo.entity.IndustrialAsset;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface IndustrialAssetRepository extends JpaRepository<IndustrialAsset, Long> {
    Optional<IndustrialAsset> findByAssetTag(String assetTag);
    long countByCurrentStatus(IndustrialAsset.AssetStatus status);
}