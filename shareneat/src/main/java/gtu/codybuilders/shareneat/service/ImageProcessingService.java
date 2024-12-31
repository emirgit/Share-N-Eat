package gtu.codybuilders.shareneat.service;

import gtu.codybuilders.shareneat.model.NutritionInfo;

public interface ImageProcessingService {
    /**
     * Processes two images: one containing a macro table, and another with ingredient details.
     * Returns a NutritionInfo object populated with the extracted values and ingredient content.
     */
    NutritionInfo parseImages(String macroTableUrl, String contentUrl);
}
