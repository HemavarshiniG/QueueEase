package com.queueease.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatisticsResponse {

    private Long totalStudents;
    private Long totalAuthorities;
    private Long totalQueueEntries;
    private Long waitingCount;
    private Long servingCount;
    private Long completedCount;
    private Long cancelledCount;
    private Long todayQueueEntries;
}
