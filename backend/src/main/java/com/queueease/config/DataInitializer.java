package com.queueease.config;

import com.queueease.entity.Authority;
import com.queueease.repository.AuthorityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import java.util.Arrays;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AuthorityRepository authorityRepository;

    @Override
    public void run(String... args) throws Exception {
        if (authorityRepository.count() == 0) {
            List<String> defaultAuthorities = Arrays.asList(
                "Principal",
                "Vice Principal",
                "Chairman",
                "Dean - Academics",
                "Dean - Student Affairs",
                "HOD - IT",
                "HOD - CSE",
                "HOD - AI & DS",
                "HOD - ECE",
                "HOD - Mechanical",
                "HOD - Civil",
                "HOD - EEE",
                "Placement Officer",
                "Controller of Examinations",
                "Office Superintendent",
                "Librarian"
            );

            for (String name : defaultAuthorities) {
                Authority authority = Authority.builder()
                        .name(name)
                        .description(name + " Office")
                        .active(true)
                        .build();
                authorityRepository.save(authority);
            }
        }
    }
}
