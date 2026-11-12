package com.example.demo.controller;

import com.example.demo.dto.AssetRequestDto;
import com.example.demo.entity.IndustrialAsset;
import com.example.demo.service.AssetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assets")
@RequiredArgsConstructor
@Tag(name = "Asset Management", description = "Endpoints for managing industrial assets and equipment lifecycle")
@SecurityRequirement(name = "bearerAuth")
public class AssetController {

    private final AssetService assetService;

    @Operation(
        summary = "Get all assets (Paginated)", 
        description = "Retrieves a paginated list of all registered industrial assets. Accessible by authenticated users."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved asset list"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Missing or invalid JWT token", content = @Content)
    })
    @GetMapping
    public ResponseEntity<Page<IndustrialAsset>> getAllAssets(
            @org.springdoc.core.annotations.ParameterObject @org.springframework.data.web.PageableDefault(sort = "id") Pageable pageable) {
        return ResponseEntity.ok(assetService.getAllAssets(pageable));
    }

    @Operation(
        summary = "Get asset by ID", 
        description = "Retrieves specific industrial asset details using its unique database ID."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Asset found and returned"),
        @ApiResponse(responseCode = "404", description = "Asset not found with the given ID", content = @Content),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Missing or invalid JWT token", content = @Content)
    })
    @GetMapping("/{id}")
    public ResponseEntity<IndustrialAsset> getAssetById(
            @Parameter(description = "ID of the asset to fetch", required = true) @PathVariable Long id) {
        return ResponseEntity.ok(assetService.getAssetById(id));
    }

    @Operation(
        summary = "Create a new asset", 
        description = "Registers a new industrial asset in the system. Requires ASSET_MANAGER or SYSTEM_ADMIN role."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Asset created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request payload or duplicate asset tag", content = @Content),
        @ApiResponse(responseCode = "403", description = "Forbidden - User lacks required manager/admin role", content = @Content)
    })
    @PostMapping
    @PreAuthorize("hasAnyRole('ASSET_MANAGER', 'SYSTEM_ADMIN')")
    public ResponseEntity<String> createAsset(@Valid @RequestBody AssetRequestDto dto) {
        assetService.createAsset(dto);
        return new ResponseEntity<>("Asset created successfully.", HttpStatus.CREATED);
    }

    @Operation(
        summary = "Update an existing asset", 
        description = "Updates configuration parameters of an existing asset. Requires ASSET_MANAGER or SYSTEM_ADMIN role."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Asset updated successfully"),
        @ApiResponse(responseCode = "404", description = "Asset not found", content = @Content),
        @ApiResponse(responseCode = "403", description = "Forbidden - User lacks required manager/admin role", content = @Content)
    })
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ASSET_MANAGER', 'SYSTEM_ADMIN')")
    public ResponseEntity<String> updateAsset(
            @Parameter(description = "ID of the asset to update", required = true) @PathVariable Long id, 
            @Valid @RequestBody AssetRequestDto dto) {
        assetService.updateAsset(id, dto);
        return ResponseEntity.ok("Asset updated successfully.");
    }

    @Operation(
        summary = "Decommission an asset", 
        description = "Marks an asset as decommissioned or soft-deletes it. Requires ASSET_MANAGER or SYSTEM_ADMIN role."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Asset decommissioned successfully"),
        @ApiResponse(responseCode = "404", description = "Asset not found", content = @Content),
        @ApiResponse(responseCode = "403", description = "Forbidden - User lacks required manager/admin role", content = @Content)
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ASSET_MANAGER', 'SYSTEM_ADMIN')")
    public ResponseEntity<String> decommissionAsset(
            @Parameter(description = "ID of the asset to decommission", required = true) @PathVariable Long id) {
        assetService.decommissionAsset(id);
        return ResponseEntity.ok("Asset deleted successfully.");
    }
}