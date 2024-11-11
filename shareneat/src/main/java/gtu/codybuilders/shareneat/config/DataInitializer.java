package gtu.codybuilders.shareneat.config;


import gtu.codybuilders.shareneat.model.Role;
import gtu.codybuilders.shareneat.model.User;
import gtu.codybuilders.shareneat.service.impl.UserServiceImpl;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;

@Configuration
public class DataInitializer {

    private final UserServiceImpl userService;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserServiceImpl userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @Bean
    public CommandLineRunner initAdminUser() {
        return args -> {

            String dummyEmail = "dummy@outlook.com";

            // Check if admin user already exists
            if (userService.isUserExists(dummyEmail))
                userService.deleteUser(dummyEmail);

            User dummyUser = new User();
            dummyUser.setEmail(dummyEmail);
            dummyUser.setPassword("dummy.deneme");
            dummyUser.setUsername("DummyTheUser");
            dummyUser.setCreated(Instant.now());
            dummyUser.setEnabled(true);
            dummyUser.setBio("I'm the dummy to serve your desire. I happy to assist you");
            dummyUser.setRole(Role.ROLE_USER);

            // Set default values for other fields
            dummyUser.setFollowersCount(121);
            dummyUser.setFollowingCount(999);
            dummyUser.setPostsCount(5);
            dummyUser.setLastLogin(Instant.now());
            dummyUser.setProfilePictureUrl("dummy.png");

            userService.saveUser(dummyUser);

            System.out.println("Admin user created with email: " + dummyEmail);
        };
    }
}
