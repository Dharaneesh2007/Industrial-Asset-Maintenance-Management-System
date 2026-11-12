package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class AssetRequestDto {
    @NotBlank(message = "Asset tag is required")
    private String assetTag;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Install date is required")
    @JsonFormat(pattern = "[yyyy-MM-dd][dd-MM-yyyy]")
    private LocalDate installDate;

    @NotNull(message = "Purchase price is required")
    private BigDecimal purchasePrice;

    @NotNull(message = "Expected lifespan is required")
    @JsonAlias({"lifespanYears", "expectedLifespan", "lifespan"})
    private Integer expectedLifespanYears;

    public void setLifespanYears(Integer lifespanYears) {
        if (this.expectedLifespanYears == null) {
            this.expectedLifespanYears = lifespanYears;
        }
    }

    public Integer getLifespanYears() {
        return this.expectedLifespanYears;
    }
}