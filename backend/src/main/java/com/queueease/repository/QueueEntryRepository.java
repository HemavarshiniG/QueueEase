package com.queueease.repository;

import com.queueease.entity.QueueEntry;
import com.queueease.entity.QueueStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface QueueEntryRepository extends JpaRepository<QueueEntry, Long> {
    
    List<QueueEntry> findByAuthorityIdAndStatusOrderByQueuePositionAsc(
        Long authorityId,
        QueueStatus status
    );

    Optional<QueueEntry> findByTokenNumber(String tokenNumber);

    Optional<QueueEntry> findFirstByAuthorityIdAndStatusOrderByQueuePositionAsc(
        Long authorityId,
        QueueStatus status
    );

    long countByAuthorityIdAndStatus(
        Long authorityId,
        QueueStatus status
    );

    List<QueueEntry> findByStudentIdOrderByCreatedAtDesc(
        Long studentId
    );
}
