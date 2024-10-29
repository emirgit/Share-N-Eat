package gtu.codybuilders.shareneat.service.impl;

import gtu.codybuilders.shareneat.model.User;
import gtu.codybuilders.shareneat.model.UserPrincipal;
import gtu.codybuilders.shareneat.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository repository;

    @Autowired
    public CustomUserDetailsService(UserRepository repository) {
        this.repository = repository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        Optional<User> user = repository.findByEmail(email);

        if (user.isEmpty())
            throw new UsernameNotFoundException("User Not Found!");


        return new UserPrincipal(user.get());
    }

}
