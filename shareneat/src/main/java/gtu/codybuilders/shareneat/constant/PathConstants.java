package gtu.codybuilders.shareneat.constant;

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

    // Post
    public static final String API = "/api";

    public static final String API_POST = API + "/post";

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
