package com.queueease.service;

import com.queueease.dto.DashboardStatisticsResponse;
import com.queueease.entity.QueueStatus;
import com.queueease.repository.AuthorityRepository;
import com.queueease.repository.QueueEntryRepository;
import com.queueease.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final StudentRepository studentRepository;
    private final AuthorityRepository authorityRepository;
    private final QueueEntryRepository queueEntryRepository;

    @Transactional(readOnly = true)
    public DashboardStatisticsResponse getDashboardStatistics() {
        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();

        return DashboardStatisticsResponse.builder()
                .totalStudents(studentRepository.count())
                .totalAuthorities(authorityRepository.count())
                .totalQueueEntries(queueEntryRepository.count())
                .waitingCount(queueEntryRepository.countByStatus(QueueStatus.WAITING))
                .servingCount(queueEntryRepository.countByStatus(QueueStatus.SERVING))
                .completedCount(queueEntryRepository.countByStatus(QueueStatus.COMPLETED))
                .cancelledCount(queueEntryRepository.countByStatus(QueueStatus.CANCELLED))
                .todayQueueEntries(queueEntryRepository.countByCreatedAtGreaterThanEqual(startOfToday))
                .build();
    }
}
