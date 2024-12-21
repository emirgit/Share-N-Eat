package gtu.codybuilders.shareneat.service.impl;

import gtu.codybuilders.shareneat.dto.SiteSettingsDTO;
import gtu.codybuilders.shareneat.model.SiteSettings;
import gtu.codybuilders.shareneat.repository.SiteSettingsRepository;
import gtu.codybuilders.shareneat.service.SiteSettingsService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SiteSettingsServiceImpl implements SiteSettingsService {

    private final SiteSettingsRepository siteSettingsRepository;

    /**
     * Initializes default site settings if none exist in the database.
     */
    @PostConstruct
    public void initializeDefaultSettings() {
        if (siteSettingsRepository.count() == 0) {
            SiteSettings defaultSettings = SiteSettings.builder()
                    .termsOfService("These are the current Terms of Service...")
                    .privacyPolicy("This is the current Privacy Policy...\nYour data is stored securely and is not shared without your consent.")
                    .build();
            siteSettingsRepository.save(defaultSettings);
        }
    }

    @Override
    public SiteSettings getSiteSettings() {
        return siteSettingsRepository.findTopByOrderByIdAsc();
    }

    @Override
    public SiteSettings updateSiteSettings(SiteSettingsDTO siteSettingsDTO) {
        SiteSettings existingSettings = siteSettingsRepository.findTopByOrderByIdAsc();
        if (existingSettings == null) {
            // In case no settings exist, create a new one
            existingSettings = SiteSettings.builder().build();
        }
        existingSettings.setTermsOfService(siteSettingsDTO.getTermsOfService());
        existingSettings.setPrivacyPolicy(siteSettingsDTO.getPrivacyPolicy());
        return siteSettingsRepository.save(existingSettings);
    }
}
