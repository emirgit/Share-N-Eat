package gtu.codybuilders.shareneat.repository;

import gtu.codybuilders.shareneat.model.Role;
import gtu.codybuilders.shareneat.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

    Optional<User> findByEmail(String email);

    // Find a user by username
    Optional<User> findByUsername(String username);

    // Check if a user with the given email exists
    boolean existsByEmail(String email);

    // Check if a user with the given username exists
    boolean existsByUsername(String username);

    // Added for SearchController
    Page<User> findByUsernameContainingIgnoreCase(String query, Pageable pageable);

    Optional<List<User>> findByRole(Role role);

    Optional<List<User>> findByEnabled(Boolean enabled);

    @Query("SELECT COUNT(u) FROM User u WHERE u.created BETWEEN :startDate AND :endDate")
    long countUsersRegisteredBetween(Instant startDate, Instant endDate);


}
