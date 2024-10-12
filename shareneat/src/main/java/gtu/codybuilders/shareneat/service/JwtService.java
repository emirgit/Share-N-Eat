package gtu.codybuilders.shareneat.service;

import io.jsonwebtoken.Claims;

public interface JwtService {


    String extractUserEmail(String jwt);

    Claims extractAllClaims(String toke);
}
