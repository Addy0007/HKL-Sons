package com.HKL.Ecomm_App.Config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtProvider {

    private static final long EXPIRATION_TIME = 1000L * 60 * 60 * 24 * 7; // 7 days
    private static final String SECRET_KEY = JwtConstant.SECRET_KEY;

    private final SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(SECRET_KEY));

    public String generateToken(Authentication auth) {
        String email = auth.getName();

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .claim("email", email)
                .signWith(key)
                .compact();
    }

    /**
     * Convenience when you want to generate token directly from an email (e.g., after signup).
     */
    public String generateTokenFromEmail(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .claim("email", email)
                .signWith(key)
                .compact();
    }

    public String getEmailFromToken(String jwt) {

        if (jwt == null) {
            throw new IllegalArgumentException("JWT is missing");
        }

        // Support both: "Bearer token" and "token"
        if (jwt.startsWith("Bearer ")) {
            jwt = jwt.substring(7);
        }

        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(jwt)
                .getBody();

        return claims.get("email", String.class);
    }

}
