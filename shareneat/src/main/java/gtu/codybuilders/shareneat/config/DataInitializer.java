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
            if (userService.isUserExists(myEmail))
                userService.deleteUser(myEmail);

            User dummyUser = new User();
            dummyUser.setEmail(myEmail);
            dummyUser.setPassword("admin");
            dummyUser.setUsername("theAdmin");
            dummyUser.setCreated(Instant.now());
            dummyUser.setEnabled(true);
            dummyUser.setBio("I'm the admin");
            dummyUser.setRole(Role.ROLE_ADMIN);

            // Set default values for other fields
            dummyUser.setFollowersCount(0);
            dummyUser.setFollowingCount(0);
            dummyUser.setPostsCount(0);
            dummyUser.setLastLogin(Instant.now());
            dummyUser.setProfilePictureUrl("dummy.png");

            userService.saveUser(dummyUser);

            String dummyEmail = "dummy@outlook.com";

            // Check if admin user already exists
            if (userService.isUserExists(dummyEmail))
                userService.deleteUser(dummyEmail);

            User dummyUser1 = new User();
            dummyUser1.setEmail(dummyEmail);
            dummyUser1.setPassword("dummy.deneme");
            dummyUser1.setUsername("DummyTheUser");
            dummyUser1.setCreated(Instant.now());
            dummyUser1.setEnabled(true);
            dummyUser1.setBio("I'm the dummy to serve your desire. I happy to assist you");
            dummyUser1.setRole(Role.ROLE_USER);

            // Set default values for other fields
            dummyUser1.setFollowersCount(121);
            dummyUser1.setFollowingCount(999);
            dummyUser1.setPostsCount(5);
            dummyUser1.setLastLogin(Instant.now());
            dummyUser1.setProfilePictureUrl("dummy.png");

            userService.saveUser(dummyUser1);

            System.out.println("Admin user created with email: " + dummyEmail);
        };
    }
}
