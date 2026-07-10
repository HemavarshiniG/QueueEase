package com.queueease.config;

import com.queueease.entity.Authority;
import com.queueease.repository.AuthorityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import lombok.extern.slf4j.Slf4j;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AuthorityRepository authorityRepository;

    @Override
    public void run(String... args) throws Exception {
        // Migrate old database names to match frontend names exactly
        updateAuthorityName("HOD - IT", "HOD - Information Technology");
        updateAuthorityName("HOD - CSE", "HOD - Computer Science");
        updateAuthorityName("HOD - AI & DS", "HOD - Artificial Intelligence & Data Science");
        updateAuthorityName("HOD - ECE", "HOD - Electronics & Communication");
        updateAuthorityName("HOD - Mechanical", "HOD - Mechanical Engineering");
        updateAuthorityName("HOD - Civil", "HOD - Civil Engineering");
        updateAuthorityName("HOD - EEE", "HOD - Electrical & Electronics Engineering");

        if (authorityRepository.count() == 0) {
            List<String> defaultAuthorities = Arrays.asList(
                "Principal",
                "Vice Principal",
                "Chairman",
                "Dean - Academics",
                "Dean - Student Affairs",
                "HOD - Information Technology",
                "HOD - Computer Science",
                "HOD - Artificial Intelligence & Data Science",
                "HOD - Electronics & Communication",
                "HOD - Mechanical Engineering",
                "HOD - Civil Engineering",
                "HOD - Electrical & Electronics Engineering",
                "Placement Officer",
                "Controller of Examinations",
                "Office Superintendent",
                "Librarian"
            );

            log.info("No authorities found in database. Seeding {} default authorities...", defaultAuthorities.size());
            for (String name : defaultAuthorities) {
                Authority authority = Authority.builder()
                        .name(name)
                        .description(name + " Office")
                        .active(true)
                        .build();
                authorityRepository.save(authority);
            }
            log.info("Database seeding completed successfully.");
        } else {
            log.info("Database already seeded with {} authorities.", authorityRepository.count());
        }
    }

    private void updateAuthorityName(String oldName, String newName) {
        authorityRepository.findByName(oldName).ifPresent(auth -> {
            auth.setName(newName);
            auth.setDescription(newName + " Office");
            authorityRepository.save(auth);
            log.info("Successfully migrated authority name from '{}' to '{}'", oldName, newName);
        });
    }
}
