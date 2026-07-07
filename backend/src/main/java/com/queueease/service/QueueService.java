package com.queueease.service;

import com.queueease.dto.JoinQueueRequest;
import com.queueease.dto.JoinQueueResponse;
import com.queueease.entity.Authority;
import com.queueease.entity.Student;
import com.queueease.entity.QueueEntry;
import com.queueease.entity.QueueStatus;
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
                .orElseThrow(() -> new RuntimeException("Authority not found."));

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
}
