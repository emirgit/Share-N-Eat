package gtu.codybuilders.shareneat.service.impl;

import gtu.codybuilders.shareneat.service.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

public class JwtServiceImpl implements JwtService {

    @Override
    public String extractUserEmail(String jwt) {
        return null;
    }

    @Override
    public Claims extractAllClaims(String toke) {
    }
}
