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

            String myEmail = "m.emir.kara@outlook.com";

            // Check if admin user already exists
            if (!userService.isUserExists(myEmail)){
                User adminUser = new User();
                adminUser.setEmail(myEmail);
                adminUser.setPassword("admin");
                adminUser.setUsername("theAdmin");
                adminUser.setCreated(Instant.now());
                adminUser.setEnabled(true);
                adminUser.setBanned(false);
                adminUser.setBio("I'm the admin");
                adminUser.setRole(Role.ROLE_ADMIN);

                // Set default values for other fields
                adminUser.setFollowersCount(0);
                adminUser.setFollowingCount(0);
                adminUser.setPostsCount(0);
                adminUser.setLastLogin(Instant.now());
                adminUser.setProfilePictureUrl("default-image.png");

                userService.saveUser(adminUser);
                
                System.out.println("Admin user created with email: " + myEmail);

            }
                
        };
    }
}
