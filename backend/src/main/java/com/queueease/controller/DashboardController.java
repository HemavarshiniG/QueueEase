package com.queueease.controller;

import com.queueease.dto.DashboardStatisticsResponse;
import com.queueease.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/statistics")
    public ResponseEntity<DashboardStatisticsResponse> getDashboardStatistics() {
        DashboardStatisticsResponse statistics = dashboardService.getDashboardStatistics();
        return ResponseEntity.ok(statistics);
    }
}
