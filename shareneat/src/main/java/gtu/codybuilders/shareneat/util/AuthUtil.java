package gtu.codybuilders.shareneat.util;

import gtu.codybuilders.shareneat.model.UserPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

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

}
