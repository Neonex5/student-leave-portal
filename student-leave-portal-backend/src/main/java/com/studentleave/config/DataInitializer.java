package com.studentleave.config;

import com.studentleave.model.User;
import com.studentleave.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository) {
        return args -> {
            userRepository.save(new User("Alice Student", "STUDENT"));
            userRepository.save(new User("Bob Teacher", "APPROVER"));
        };
    }
}
