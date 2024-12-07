package gtu.codybuilders.shareneat.util;

import org.springframework.security.core.GrantedAuthority;
import gtu.codybuilders.shareneat.model.UserPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class AuthUtil {

    public static Long getUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();

            if (principal instanceof UserPrincipal) {
                return ((UserPrincipal) principal).getUser().getUserId();
            }
        }

        throw new IllegalStateException("No authenticated user found");
    }

    /**
     * Retrieves the authenticated user's roles.
     *
     * @return List of role names (e.g., ["ROLE_USER", "ROLE_ADMIN"])
     * @throws IllegalStateException if no authenticated user is found
     */
    public static List<String> getUserRoles() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();

            if (principal instanceof UserPrincipal) {

                return ((UserPrincipal) principal).getAuthorities()
                        .stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.toList());
            }
        }

        throw new IllegalStateException("No authenticated user found");
    }

}
