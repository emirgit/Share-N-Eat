package gtu.codybuilders.shareneat.service.impl;

import gtu.codybuilders.shareneat.exception.UserAlreadyExistsException;
import gtu.codybuilders.shareneat.model.User;
import gtu.codybuilders.shareneat.repository.UserRepository;
import gtu.codybuilders.shareneat.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User saveUser(User user) {
        if (repository.existsByEmail(user.getEmail())) {
            logger.warn("Attempt to register with existing email: {}", user.getEmail());
            throw new UserAlreadyExistsException("User with email " + user.getEmail() + " already exists.");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = repository.save(user);
        logger.info("User registered successfully: {}", savedUser.getEmail());
        return savedUser;
    }

    @Override
    public boolean isUserExists(String email) {
        return repository.existsByEmail(email);
    }

    @Override
    public Optional<User> findUserByEmail(String email) {
        return repository.findByEmail(email);
    }

    // Additional methods as needed
}
