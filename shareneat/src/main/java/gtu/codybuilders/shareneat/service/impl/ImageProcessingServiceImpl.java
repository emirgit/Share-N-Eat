package gtu.codybuilders.shareneat.service.impl;

import gtu.codybuilders.shareneat.constant.PathConstants;
import gtu.codybuilders.shareneat.model.NutritionInfo;
import gtu.codybuilders.shareneat.service.ImageProcessingService;
import net.sourceforge.tess4j.ITesseract;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

public class ImageProcessingServiceImpl implements ImageProcessingService {

    private static final Logger logger = LoggerFactory.getLogger(ImageProcessingServiceImpl.class);

    @Override
    public NutritionInfo parseImages(String macroTableUrl, String contentUrl) {
        // Creates a data object to hold the results
        NutritionInfo info = new NutritionInfo();

        // Prepares a Tesseract OCR instance.
        ITesseract tesseract = new Tesseract();
        // Points to the directory containing 'tessdata', ensuring that Turkish (tur) and English (eng) are installed.
        tesseract.setDatapath(PathConstants.TESSDATA_PATH.toString());
        // Sets the language to both English and Turkish.
        // Make sure 'eng.traineddata' and 'tur.traineddata' are present in your tessdata folder.
        tesseract.setLanguage("eng+tur");

        // Extracts text from both images
        String macroText   = extractText(macroTableUrl, tesseract);
        String contentText = extractText(contentUrl, tesseract);
        System.out.println("Macro Text:");
        System.out.println(macroText);
        System.out.println("Content Text:");
        System.out.println(contentText);

        // Parses the macro table text for known values
        Map<String, String> macrosFound = parseMacroTable(macroText);

        // Maps recognized text to numeric fields on the model
        info.setCalories(parseDouble(macrosFound.get("energy")));
        info.setProteinGrams(parseDouble(macrosFound.get("protein")));
        info.setCarbonhydrateGrams(parseDouble(macrosFound.get("carbonhydrate")));
        info.setFatGrams(parseDouble(macrosFound.get("fat")));

        // Places the OCR text from the second image into the 'content' field
        info.setContent(contentText.trim());

        return info;
    }

    /**
     * Performs OCR on the provided image file, returning the recognized text.
     */
    private String extractText(String imageUrl, ITesseract tesseract) {
        try {
            File file = new File(imageUrl);

            if (!file.exists() || !file.isFile()) {
                logger.error("File does not exist or is not a valid file: " + imageUrl);
                return "";
            }

            return tesseract.doOCR(file);
        } catch (TesseractException e) {
            e.printStackTrace();
            return "";
        }
    }

    /**
     * Splits the recognized text into lines and searches for key words (in both English and Turkish).
     * For each recognized macro, it extracts the first numeric value next to it.
     */
    private Map<String, String> parseMacroTable(String text) {
        // Maintains a map for storing recognized macros (energy, protein, etc.) and their extracted string values
        Map<String, String> macrosMap = new HashMap<>();

        // Prepares synonyms for each macro. Any line containing these keywords is mapped to the same key.
        Map<String, String[]> synonyms = new HashMap<>();
        synonyms.put("energy",        new String[] {"energy", "enerji"});
        synonyms.put("fat",           new String[] {"fat", "yağ"});
        synonyms.put("carbonhydrate",  new String[] {"carbonhydrate", "karbonhidrat"});
        synonyms.put("protein",       new String[] {"protein"});
        // Additional fields (e.g., "sugar", "salt", "kalsiyum", etc.) can be added here if needed

        // Splits the recognized text by lines
        String[] lines = text.split("\\r?\\n");

        // Checks each line against the synonyms
        for (String line : lines) {
            String lowerLine = line.toLowerCase();

            // Iterates over each macro key and its synonyms
            for (Map.Entry<String, String[]> entry : synonyms.entrySet()) {
                String macroKey = entry.getKey();
                String[] macroSynonyms = entry.getValue();

                // If a line contains any synonym of that macro
                for (String synonym : macroSynonyms) {
                    if (lowerLine.contains(synonym)) {
                        // Extracts the first numeric value after the found synonym
                        String valueFound = extractNumericValue(line);
                        if (valueFound != null && !valueFound.isEmpty()) {
                            macrosMap.put(macroKey, valueFound);
                            break;
                        }
                    }
                }
            }
        }
        return macrosMap;
    }

    /**
     * Looks for the first token in the line that matches an integer or decimal number format.
     */
    private String extractNumericValue(String text) {
        String[] tokens = text.split("\\s+");
        for (String token : tokens) {
            if (token.matches("\\d+(\\.\\d+)?")) {
                return token;
            }
        }
        return null;
    }

    /**
     * Converts a string to a Double, returning null if the string is empty or invalid.
     */
    private Double parseDouble(String numericStr) {
        if (numericStr == null || numericStr.isEmpty()) {
            return null;
        }
        try {
            return Double.valueOf(numericStr);
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
