package gtu.codybuilders.shareneat.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SiteSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "terms_of_service", columnDefinition = "TEXT", nullable = false)
    private String termsOfService;

    @Column(name = "privacy_policy", columnDefinition = "TEXT", nullable = false)
    private String privacyPolicy;
}
