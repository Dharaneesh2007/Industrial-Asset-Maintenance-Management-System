package com.example.demo.controller;

import com.example.demo.entity.MaintenanceLog;
import com.example.demo.service.MaintenanceService;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Tag(name = "Reports & Analytics", description = "Endpoints for generating and exporting lifecycle maintenance reports")
@SecurityRequirement(name = "bearerAuth")
public class ReportController {

    private final MaintenanceService maintenanceService;

    @Operation(summary = "Export Maintenance Report PDF", description = "Generates and downloads a compiled PDF report of all maintenance logs and summary statistics")
    @GetMapping("/export/pdf")
    @PreAuthorize("hasAnyRole('ASSET_MANAGER', 'OPERATIONS_SUPERVISOR', 'SYSTEM_ADMIN', 'MAINTENANCE_TECHNICIAN')")
    public ResponseEntity<byte[]> exportMaintenanceReportPdf() {
        List<MaintenanceLog> logs = maintenanceService.getAllLogs();

        BigDecimal totalSpend = logs.stream()
                .map(l -> l.getCostIncurred() != null ? l.getCostIncurred() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalInterventions = logs.size();
        BigDecimal avgSpend = totalInterventions > 0
                ? totalSpend.divide(BigDecimal.valueOf(totalInterventions), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 36, 36, 36, 36);

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Colors
            Color primaryColor = new Color(15, 23, 42);     // Slate 900
            Color headerBgColor = new Color(30, 41, 59);    // Slate 800
            Color rowAltBgColor = new Color(248, 250, 252); // Slate 50

            // Title
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, primaryColor);
            Paragraph title = new Paragraph("AssetArc - Maintenance Lifecycle Report", titleFont);
            title.setAlignment(Element.ALIGN_LEFT);
            title.setSpacingAfter(4);
            document.add(title);

            // Subtitle & Date
            Font subFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.GRAY);
            String currentDate = LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE);
            Paragraph subtitle = new Paragraph("Generated on: " + currentDate + " | Historical Interventions & Spend Tracking", subFont);
            subtitle.setSpacingAfter(16);
            document.add(subtitle);

            // Summary Stats Cards Table
            PdfPTable statsTable = new PdfPTable(3);
            statsTable.setWidthPercentage(100);
            statsTable.setSpacingAfter(20);

            Font statLabelFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, Color.GRAY);
            Font statValueFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, primaryColor);

            addStatCell(statsTable, "TOTAL SPEND", "$" + String.format("%.2f", totalSpend), statLabelFont, statValueFont);
            addStatCell(statsTable, "TOTAL INTERVENTIONS", String.valueOf(totalInterventions), statLabelFont, statValueFont);
            addStatCell(statsTable, "AVG SPEND / TASK", "$" + String.format("%.2f", avgSpend), statLabelFont, statValueFont);

            document.add(statsTable);

            // Section Heading: Historical Interventions
            Font sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, primaryColor);
            Paragraph sectionTitle = new Paragraph("Historical Interventions Log", sectionFont);
            sectionTitle.setSpacingAfter(8);
            document.add(sectionTitle);

            // Log Table
            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{2.5f, 2.0f, 2.2f, 4.5f, 2.0f});
            table.setSpacingBefore(4);

            // Table Headers
            Font thFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, Color.WHITE);
            String[] headers = {"Date", "Asset Tag", "Technician", "Work Description", "Cost ($)"};
            for (String h : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(h, thFont));
                cell.setBackgroundColor(headerBgColor);
                cell.setPadding(6);
                cell.setHorizontalAlignment(Element.ALIGN_LEFT);
                table.addCell(cell);
            }

            // Table Rows
            Font tdFont = FontFactory.getFont(FontFactory.HELVETICA, 8, Color.BLACK);
            Font tdMonoFont = FontFactory.getFont(FontFactory.COURIER, 8, Color.BLACK);

            if (logs.isEmpty()) {
                PdfPCell emptyCell = new PdfPCell(new Phrase("No maintenance logs recorded yet.", tdFont));
                emptyCell.setColspan(5);
                emptyCell.setPadding(10);
                emptyCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(emptyCell);
            } else {
                int rowIndex = 0;
                for (MaintenanceLog log : logs) {
                    Color bgColor = (rowIndex % 2 == 1) ? rowAltBgColor : Color.WHITE;

                    String dateStr = log.getCompletionDate() != null
                            ? log.getCompletionDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"))
                            : "N/A";
                    String assetTag = log.getAsset() != null ? log.getAsset().getAssetTag() : "N/A";
                    String techName = log.getTechnician() != null ? log.getTechnician().getUsername() : "N/A";
                    String desc = log.getWorkDescription() != null ? log.getWorkDescription() : "N/A";
                    String cost = log.getCostIncurred() != null ? "$" + log.getCostIncurred().setScale(2, RoundingMode.HALF_UP).toString() : "$0.00";

                    addCell(table, dateStr, tdMonoFont, bgColor);
                    addCell(table, assetTag, tdMonoFont, bgColor);
                    addCell(table, techName, tdFont, bgColor);
                    addCell(table, desc, tdFont, bgColor);
                    addCell(table, cost, tdMonoFont, bgColor);

                    rowIndex++;
                }
            }

            document.add(table);
            document.close();

        } catch (DocumentException e) {
            throw new RuntimeException("Error generating PDF report", e);
        }

        byte[] pdfBytes = out.toByteArray();
        String dateSuffix = LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE);
        String filename = "Maintenance_Report_" + dateSuffix + ".pdf";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    private void addStatCell(PdfPTable table, String label, String value, Font labelFont, Font valFont) {
        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(new Color(241, 245, 249)); // Slate 100
        cell.setPadding(8);
        cell.setBorderColor(new Color(203, 213, 225));
        Paragraph pLabel = new Paragraph(label, labelFont);
        Paragraph pVal = new Paragraph(value, valFont);
        cell.addElement(pLabel);
        cell.addElement(pVal);
        table.addCell(cell);
    }

    private void addCell(PdfPTable table, String text, Font font, Color bgColor) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBackgroundColor(bgColor);
        cell.setPadding(6);
        cell.setBorderColor(new Color(226, 232, 240));
        table.addCell(cell);
    }
}
