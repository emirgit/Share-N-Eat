package gtu.codybuilders.shareneat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserManagementDTO {
    private Long id;
    private String username;
    private String email;
    private String role;
    private String status;
    private boolean verified;
}