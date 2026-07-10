package com.queueease.controller;

import com.queueease.dto.StudentHistoryResponse;
import com.queueease.service.QueueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentController {

    private final QueueService queueService;

    @GetMapping("/{studentId}/history")
    public ResponseEntity<List<StudentHistoryResponse>> getStudentHistory(
            @PathVariable Long studentId) {
        List<StudentHistoryResponse> history = queueService.getStudentHistory(studentId);
        return ResponseEntity.ok(history);
    }
}
