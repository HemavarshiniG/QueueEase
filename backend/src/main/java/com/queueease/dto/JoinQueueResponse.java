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
public class JoinQueueResponse {

    private String tokenNumber;
    private Integer queuePosition;
    private String authorityName;
    private Integer estimatedWaitingCount;
    private String status;
    private String message;
}
