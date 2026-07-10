package com.queueease.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QueueStatusResponse {

    private String tokenNumber;
    private String studentName;
    private String authorityName;
    private String status;
    private Integer queuePosition;
    private Integer peopleAhead;
    private Integer estimatedWaitingCount;
    private String purposeOfVisit;
}
