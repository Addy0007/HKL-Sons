package com.HKL.Ecomm_App.Config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.stream.Collectors;

@Service
public class JwtProvider {

    private static final long EXPIRATION_TIME = 1000L * 60 * 60 * 24 * 7; // 7 days
    private static final String SECRET_KEY = JwtConstant.SECRET_KEY;

    private final SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(SECRET_KEY));

    // ✅ UPDATED: Include role in JWT
    public String generateToken(Authentication auth) {
        String email = auth.getName();

        // ✅ Extract role from authorities
        String role = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_CUSTOMER");

        System.out.println("🔐 Generating JWT for: " + email + " with role: " + role);

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .claim("email", email)
                .claim("role", role) // ✅ ADD ROLE TO TOKEN
                .signWith(key)
                .compact();
    }

    // ✅ UPDATED: Include role when generating from email
    public String generateTokenFromEmail(String email, String role) {
        if (role == null || role.isEmpty()) {
            role = "ROLE_CUSTOMER";
        }

        System.out.println("🔐 Generating JWT for: " + email + " with role: " + role);

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .claim("email", email)
                .claim("role", role) // ✅ ADD ROLE TO TOKEN
                .signWith(key)
                .compact();
    }

    public String getEmailFromToken(String jwt) {
        if (jwt == null) {
            throw new IllegalArgumentException("JWT is missing");
        }

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

    // ✅ NEW: Get role from token
    public String getRoleFromToken(String jwt) {
        if (jwt == null) {
            throw new IllegalArgumentException("JWT is missing");
        }

        if (jwt.startsWith("Bearer ")) {
            jwt = jwt.substring(7);
        }

        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(jwt)
                .getBody();

        return claims.get("role", String.class);
    }
}