package com.queueease.controller;

import com.queueease.dto.AuthorityQueueResponse;
import com.queueease.dto.CallNextResponse;
import com.queueease.dto.CompleteCurrentResponse;
import com.queueease.service.QueueService;
import org.springframework.web.bind.annotation.PostMapping;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/authority")
@RequiredArgsConstructor
public class AuthorityController {

    private final QueueService queueService;

    @GetMapping("/{authorityId}/queue")
    public ResponseEntity<List<AuthorityQueueResponse>> getAuthorityQueue(
            @PathVariable Long authorityId) {
        List<AuthorityQueueResponse> queue = queueService.getAuthorityQueue(authorityId);
        return ResponseEntity.ok(queue);
    }

    @PostMapping("/{authorityId}/call-next")
    public ResponseEntity<CallNextResponse> callNextStudent(@PathVariable Long authorityId) {
        CallNextResponse response = queueService.callNextStudent(authorityId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{authorityId}/complete-current")
    public ResponseEntity<CompleteCurrentResponse> completeCurrentStudent(@PathVariable Long authorityId) {
        CompleteCurrentResponse response = queueService.completeCurrentStudent(authorityId);
        return ResponseEntity.ok(response);
    }
}
