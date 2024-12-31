package gtu.codybuilders.shareneat.service.impl;

import gtu.codybuilders.shareneat.model.NutritionInfo;
import gtu.codybuilders.shareneat.service.ImageProcessingService;

import java.nio.file.Path;
import java.nio.file.Paths;

public class Main {
    public static void main(String[] args) {
        // Creates the service
        ImageProcessingService service = new ImageProcessingServiceImpl();

        Path path = Paths.get(System.getProperty("user.dir"), "shareneat","src", "main", "resources", "static", "images", "testImage");

        // Full paths for image files
                String macroTableUrl = path.resolve("macroTable.png").toString();
                String contentUrl = path.resolve("content.png").toString();

        // Debugging to verify paths
                System.out.println("Macro Table Path: " + macroTableUrl);
                System.out.println("Content Path: " + contentUrl);


        // Retrieves the recognized information
        NutritionInfo info = service.parseImages(macroTableUrl, contentUrl);

        // Prints the result
        System.out.println(info);
    }
}
