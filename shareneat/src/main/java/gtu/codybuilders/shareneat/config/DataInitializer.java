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

            String dummyEmail = "dummy@outlook.com";

            // Check if dummy user already exists
            if (userService.isUserExists(dummyEmail))
                userService.deleteUser(dummyEmail);

            User dummyUser = new User();
            dummyUser.setEmail(dummyEmail);
            dummyUser.setPassword("dummy.deneme");
            dummyUser.setUsername("DummyTheUser");
            dummyUser.setCreated(Instant.now());
            dummyUser.setEnabled(true);
            dummyUser.setBanned(false);
            dummyUser.setBio("I'm the dummy to serve your desire. I'm happy to assist you");
            dummyUser.setRole(Role.ROLE_USER);

            // Set default values for other fields
            dummyUser.setFollowersCount(0);
            dummyUser.setFollowingCount(0);
            dummyUser.setPostsCount(0);
            dummyUser.setLastLogin(Instant.now());
            dummyUser.setProfilePictureUrl("dummy.png");

            userService.saveUser(dummyUser);

            String dieticianEmail = "dietician@outlook.com";

            // Check if dietician user already exists
            if (userService.isUserExists(dieticianEmail))
                userService.deleteUser(dieticianEmail);

            User dieticianUser = new User();
            dieticianUser.setEmail(dieticianEmail);
            dieticianUser.setPassword("dietician123");
            dieticianUser.setUsername("DieticianPro");
            dieticianUser.setCreated(Instant.now());
            dieticianUser.setEnabled(true);
            dieticianUser.setBanned(false);
            dieticianUser.setBio("I’m a dietician here to share healthy eating tips.");
            dieticianUser.setRole(Role.ROLE_EXPERT);

            // Set default values for other fields
            dieticianUser.setFollowersCount(0);
            dieticianUser.setFollowingCount(0);
            dieticianUser.setPostsCount(0);
            dieticianUser.setLastLogin(Instant.now());
            dieticianUser.setProfilePictureUrl("default-image.png");

            userService.saveUser(dieticianUser);

            System.out.println("Admin user created with email: " + myEmail);
            System.out.println("Dummy user created with email: " + dummyEmail);
            System.out.println("Dietician user created with email: " + dieticianEmail);
        };
    }
}
