package gtu.codybuilders.shareneat.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SiteSettingsDTO {

    @NotBlank(message = "Terms of Service cannot be blank.")
    private String termsOfService;

    @NotBlank(message = "Privacy Policy cannot be blank.")
    private String privacyPolicy;
}
