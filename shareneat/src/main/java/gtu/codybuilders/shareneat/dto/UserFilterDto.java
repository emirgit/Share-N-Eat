package gtu.codybuilders.shareneat.dto;

import gtu.codybuilders.shareneat.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserFilterDto {
    private String username;
    private String email;
    private Role role;
    private boolean isBanned;
    private boolean enabled;
}
