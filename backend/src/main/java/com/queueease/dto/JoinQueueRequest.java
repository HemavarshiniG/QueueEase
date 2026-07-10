package com.queueease.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
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
public class JoinQueueRequest {

    @NotBlank(message = "Student name cannot be blank")
    private String studentName;

    @NotBlank(message = "Register number cannot be blank")
    private String registerNumber;

    @NotBlank(message = "Department cannot be blank")
    private String department;

    @NotNull(message = "Year is required")
    @Min(value = 1, message = "Year must be at least 1")
    @Max(value = 5, message = "Year must be at most 5")
    private Integer year;

    private String email;

    private String phoneNumber;

    @NotNull(message = "Authority ID is required")
    private Long authorityId;

    @NotBlank(message = "Purpose of visit cannot be blank")
    private String purposeOfVisit;
}
