package com.queueease.controller;

import com.queueease.dto.JoinQueueRequest;
import com.queueease.dto.JoinQueueResponse;
import com.queueease.dto.QueueStatusResponse;
import com.queueease.service.QueueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/queue")
@RequiredArgsConstructor
public class QueueController {

    private final QueueService queueService;

    @PostMapping("/join")
    public ResponseEntity<JoinQueueResponse> joinQueue(@Valid @RequestBody JoinQueueRequest request) {
        JoinQueueResponse response = queueService.joinQueue(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/status/{token}")
    public ResponseEntity<QueueStatusResponse> getQueueStatus(@PathVariable("token") String token) {
        QueueStatusResponse response = queueService.getQueueStatus(token);
        return ResponseEntity.ok(response);
    }
}
