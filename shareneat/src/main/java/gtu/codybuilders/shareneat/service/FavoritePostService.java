package gtu.codybuilders.shareneat.service;

import java.util.List;

import gtu.codybuilders.shareneat.model.FavoritePost;

public interface FavoritePostService {
    void addFavoritePost(Long postId);
    void removeFavoritePost(Long postId);
    List<FavoritePost> getFavoritePostsOfUser();
    List<FavoritePost> getFavoritePostsByUserId(Long userId); 
}

