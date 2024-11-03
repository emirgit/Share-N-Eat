package gtu.codybuilders.shareneat.service;

import java.util.List;

import gtu.codybuilders.shareneat.dto.FavoritePostDto;

public interface FavoritePostService {
    void addFavoritePost(Long postId);
    void removeFavoritePost(Long postId);
    List<FavoritePostDto> getFavoritePostsOfUser();
    List<FavoritePostDto> getFavoritePostsByUserId(Long userId); 
}

