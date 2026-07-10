package com.queueease.service;

import com.queueease.dto.JoinQueueRequest;
import com.queueease.dto.JoinQueueResponse;
import com.queueease.dto.QueueStatusResponse;
import com.queueease.dto.AuthorityQueueResponse;
import com.queueease.dto.CallNextResponse;
import com.queueease.dto.CompleteCurrentResponse;
import com.queueease.dto.StudentHistoryResponse;
import java.util.List;
import java.time.LocalDateTime;
import com.queueease.entity.Authority;
import com.queueease.entity.Student;
import com.queueease.entity.QueueEntry;
import com.queueease.entity.QueueStatus;
import com.queueease.exception.ResourceNotFoundException;
import com.queueease.repository.AuthorityRepository;
import com.queueease.repository.StudentRepository;
import com.queueease.repository.QueueEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class QueueService {

    private final QueueEntryRepository queueEntryRepository;
    private final StudentRepository studentRepository;
    private final AuthorityRepository authorityRepository;

    @Transactional
    public JoinQueueResponse joinQueue(JoinQueueRequest request) {
        // 1. Validate that the Authority exists
        Authority authority = authorityRepository.findById(request.getAuthorityId())
                .orElseThrow(() -> new ResourceNotFoundException("Authority not found."));

        // 2-4. Search Student and find or create
        Student student = findOrCreateStudent(request);

        // 5. Calculate queue position
        int queuePosition = calculateQueuePosition(authority.getId());

        // 6. Generate Token Number
        String tokenNumber = generateToken();

        // 7. Create QueueEntry
        QueueEntry queueEntry = QueueEntry.builder()
                .student(student)
                .authority(authority)
                .purposeOfVisit(request.getPurposeOfVisit())
                .status(QueueStatus.WAITING)
                .queuePosition(queuePosition)
                .tokenNumber(tokenNumber)
                .build();

        queueEntryRepository.save(queueEntry);

        // 8. Return JoinQueueResponse
        return JoinQueueResponse.builder()
                .tokenNumber(tokenNumber)
                .queuePosition(queuePosition)
                .authorityName(authority.getName())
                .estimatedWaitingCount(queuePosition - 1)
                .status(QueueStatus.WAITING.name())
                .message("Successfully joined the queue.")
                .build();
    }

    private Student findOrCreateStudent(JoinQueueRequest request) {
        return studentRepository.findByRegisterNumber(request.getRegisterNumber())
                .orElseGet(() -> {
                    Student newStudent = Student.builder()
                            .name(request.getStudentName())
                            .registerNumber(request.getRegisterNumber())
                            .department(request.getDepartment())
                            .year(request.getYear())
                            .email(request.getEmail())
                            .phoneNumber(request.getPhoneNumber())
                            .build();
                    return studentRepository.save(newStudent);
                });
    }

    private int calculateQueuePosition(Long authorityId) {
        long waitingCount = queueEntryRepository.countByAuthorityIdAndStatus(authorityId, QueueStatus.WAITING);
        return (int) (waitingCount + 1);
    }

    private String generateToken() {
        long totalEntries = queueEntryRepository.count();
        return String.format("QA%04d", totalEntries + 1);
    }

    @Transactional(readOnly = true)
    public QueueStatusResponse getQueueStatus(String tokenNumber) {
        QueueEntry entry = queueEntryRepository.findByTokenNumber(tokenNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Token not found."));

        long peopleAhead = queueEntryRepository.countByAuthorityIdAndStatusAndQueuePositionLessThan(
                entry.getAuthority().getId(),
                QueueStatus.WAITING,
                entry.getQueuePosition()
        );

        return QueueStatusResponse.builder()
                .tokenNumber(entry.getTokenNumber())
                .studentName(entry.getStudent().getName())
                .authorityName(entry.getAuthority().getName())
                .status(entry.getStatus().name())
                .queuePosition(entry.getQueuePosition())
                .peopleAhead((int) peopleAhead)
                .estimatedWaitingCount((int) peopleAhead)
                .purposeOfVisit(entry.getPurposeOfVisit())
                .build();
    }

    @Transactional(readOnly = true)
    public List<AuthorityQueueResponse> getAuthorityQueue(Long authorityId) {
        authorityRepository.findById(authorityId)
                .orElseThrow(() -> new ResourceNotFoundException("Authority not found."));

        List<QueueEntry> waitingEntries = queueEntryRepository.findByAuthorityIdAndStatusOrderByQueuePositionAsc(
                authorityId,
                QueueStatus.WAITING
        );

        List<QueueEntry> servingEntries = queueEntryRepository.findByAuthorityIdAndStatusOrderByQueuePositionAsc(
                authorityId,
                QueueStatus.SERVING
        );

        java.util.List<QueueEntry> allEntries = new java.util.ArrayList<>();
        allEntries.addAll(servingEntries);
        allEntries.addAll(waitingEntries);

        return allEntries.stream()
                .map(entry -> AuthorityQueueResponse.builder()
                        .tokenNumber(entry.getTokenNumber())
                        .studentName(entry.getStudent().getName())
                        .registerNumber(entry.getStudent().getRegisterNumber())
                        .purposeOfVisit(entry.getPurposeOfVisit())
                        .queuePosition(entry.getQueuePosition())
                        .status(entry.getStatus().name())
                        .build())
                .toList();
    }

    @Transactional
    public CallNextResponse callNextStudent(Long authorityId) {
        authorityRepository.findById(authorityId)
                .orElseThrow(() -> new ResourceNotFoundException("Authority not found."));

        QueueEntry entry = queueEntryRepository.findFirstByAuthorityIdAndStatusOrderByQueuePositionAsc(
                authorityId,
                QueueStatus.WAITING
        ).orElseThrow(() -> new ResourceNotFoundException("No waiting students found for this authority."));

        entry.setStatus(QueueStatus.SERVING);
        entry.setCalledAt(LocalDateTime.now());
        queueEntryRepository.save(entry);

        return CallNextResponse.builder()
                .tokenNumber(entry.getTokenNumber())
                .studentName(entry.getStudent().getName())
                .registerNumber(entry.getStudent().getRegisterNumber())
                .purposeOfVisit(entry.getPurposeOfVisit())
                .queuePosition(entry.getQueuePosition())
                .status(entry.getStatus().name())
                .build();
    }

    @Transactional
    public CompleteCurrentResponse completeCurrentStudent(Long authorityId) {
        authorityRepository.findById(authorityId)
                .orElseThrow(() -> new ResourceNotFoundException("Authority not found."));

        QueueEntry entry = queueEntryRepository.findFirstByAuthorityIdAndStatusOrderByQueuePositionAsc(
                authorityId,
                QueueStatus.SERVING
        ).orElseThrow(() -> new ResourceNotFoundException("No active student currently being served for this authority."));

        entry.setStatus(QueueStatus.COMPLETED);
        entry.setCompletedAt(LocalDateTime.now());
        queueEntryRepository.save(entry);

        return CompleteCurrentResponse.builder()
                .tokenNumber(entry.getTokenNumber())
                .studentName(entry.getStudent().getName())
                .registerNumber(entry.getStudent().getRegisterNumber())
                .purposeOfVisit(entry.getPurposeOfVisit())
                .queuePosition(entry.getQueuePosition())
                .status(entry.getStatus().name())
                .build();
    }

    @Transactional(readOnly = true)
    public List<StudentHistoryResponse> getStudentHistory(Long studentId) {
        studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found."));

        List<QueueEntry> entries = queueEntryRepository.findByStudentIdOrderByCreatedAtDesc(studentId);

        return entries.stream()
                .map(entry -> StudentHistoryResponse.builder()
                        .tokenNumber(entry.getTokenNumber())
                        .authorityName(entry.getAuthority().getName())
                        .purposeOfVisit(entry.getPurposeOfVisit())
                        .status(entry.getStatus().name())
                        .createdAt(entry.getCreatedAt())
                        .calledAt(entry.getCalledAt())
                        .completedAt(entry.getCompletedAt())
                        .build())
                .toList();
    }
}
