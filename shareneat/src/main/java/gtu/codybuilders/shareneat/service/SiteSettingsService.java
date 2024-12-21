package gtu.codybuilders.shareneat.service;

import gtu.codybuilders.shareneat.dto.SiteSettingsDTO;
import gtu.codybuilders.shareneat.model.SiteSettings;

public interface SiteSettingsService {

    /**
     * Retrieves the current site settings.
     *
     * @return SiteSettings object containing Terms of Service and Privacy Policy.
     */
    SiteSettings getSiteSettings();

    /**
     * Updates the site settings with the provided data.
     *
     * @param siteSettingsDTO Data Transfer Object containing updated settings.
     * @return Updated SiteSettings object.
     */
    SiteSettings updateSiteSettings(SiteSettingsDTO siteSettingsDTO);
}
