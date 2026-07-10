package com.queueease.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CallNextResponse {

    private String tokenNumber;
    private String studentName;
    private String registerNumber;
    private String purposeOfVisit;
    private Integer queuePosition;
    private String status;
}
