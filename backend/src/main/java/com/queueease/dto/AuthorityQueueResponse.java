package com.queueease.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthorityQueueResponse {

    private String tokenNumber;
    private String studentName;
    private String registerNumber;
    private String purposeOfVisit;
    private Integer queuePosition;
    private String status;
}
