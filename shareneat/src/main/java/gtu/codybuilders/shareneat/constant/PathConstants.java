package gtu.codybuilders.shareneat.constant;

import java.nio.file.Path;
import java.nio.file.Paths;

public class PathConstants {


    public static final String AUTH = "/auth";
    public static final String LOGIN = "/login";
    public static final String REGISTER = "/register";

    public static final String PASSWORD = "/password";
    public static final String FORGOT = "/forgot";
    public static final String FORGOT_PASSWORD = FORGOT + PASSWORD;
    public static final String RESET = "/reset";
    public static final String RESET_PASSWORD = RESET + PASSWORD;

    public static final String FORGOT_PASSWORD_EMAIL_VAR = FORGOT_PASSWORD + "/{email}";


    //image upload paths
    private static final Path UPLOAD_DIR = Paths.get(System.getProperty("user.dir"), "shareneat","src", "main", "resources", "static", "images");
    //public Path uploadDir() {return UPLOAD_DIR;}

    public static final Path UPLOAD_DIR_DEFAULT = UPLOAD_DIR.resolve("default");
//    public static Path uploadDirDefault() {return UPLOAD_DIR_DEFAULT;}

    public static final Path UPLOAD_DIR_USER = UPLOAD_DIR.resolve("users");
//    public static Path uploadDirUser() {return UPLOAD_DIR_USER;}

    public static final Path UPLOAD_DIR_PRODUCT = UPLOAD_DIR.resolve("products");
//    public static Path uploadDirProduct() {return UPLOAD_DIR_PRODUCT;}

    public static final Path UPLOAD_DIR_POST = UPLOAD_DIR.resolve("posts");
//    public static Path uploadDirPost() {return UPLOAD_DIR_POST;}

    public static final String defaultProductImage = "default_product.jpg";
    public static final String defaultUserImage = "default_user.jpg";
    public static final String defaultPostImage = "default_post.jpg";

    /*
    public static final String USER = "/user";
    public static final String FOLLOWERS_USER_ID = "/followers/{userId}";
    public static final String FOLLOWING_USER_ID = "/following/{userId}";
    public static final String FOLLOWER_REQUESTS = "/follower-requests";
    public static final String FOLLOW_USER_ID = "/follow/{userId}";
    public static final String FOLLOW_OVERALL = "/follow/overall/{userId}";
    public static final String FOLLOW_PRIVATE = "/follow/private/{userId}";
    public static final String FOLLOW_ACCEPT = "/follow/accept/{userId}";
    public static final String FOLLOW_DECLINE = "/follow/decline/{userId}";
    public static final String TOKEN = "/token";
    public static final String USER_ID = "/{userId}";
    public static final String ALL = "/all";
    public static final String SEARCH_USERNAME = "/items/search/{username}";
    public static final String USERNAME = "/username";
    public static final String EMAIL = "/email";
    public static final String PHONE = "/phone";
    public static final String COUNTRY = "/country";
    public static final String GENDER = "/gender";
    public static final String LANGUAGE = "/language";
    public static final String DIRECT = "/direct";
    public static final String PRIVATE = "/private";
    public static final String COLOR_SCHEME = "/color_scheme";
    public static final String BACKGROUND_COLOR = "/background_color";
    */
}