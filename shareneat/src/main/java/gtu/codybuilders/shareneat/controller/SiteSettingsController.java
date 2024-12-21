package gtu.codybuilders.shareneat.controller;

import gtu.codybuilders.shareneat.dto.SiteSettingsDTO;
import gtu.codybuilders.shareneat.model.SiteSettings;
import gtu.codybuilders.shareneat.service.SiteSettingsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SiteSettingsController {

    private final SiteSettingsService siteSettingsService;

    /**
     * Retrieves the current site settings.
     *
     * @return ResponseEntity containing the SiteSettings object.
     */
    @GetMapping
    public ResponseEntity<SiteSettings> getSiteSettings() {
        SiteSettings settings = siteSettingsService.getSiteSettings();
        return ResponseEntity.ok(settings);
    }

    /**
     * Updates the site settings with the provided data.
     *
     * @param siteSettingsDTO Data Transfer Object containing updated settings.
     * @return ResponseEntity containing the updated SiteSettings object.
     */
    @PutMapping
    public ResponseEntity<SiteSettings> updateSiteSettings(@Valid @RequestBody SiteSettingsDTO siteSettingsDTO) {
        SiteSettings updatedSettings = siteSettingsService.updateSiteSettings(siteSettingsDTO);
        return ResponseEntity.ok(updatedSettings);
    }
}
