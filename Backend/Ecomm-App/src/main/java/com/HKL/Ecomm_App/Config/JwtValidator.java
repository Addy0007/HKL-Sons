package com.HKL.Ecomm_App.Config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.List;

public class JwtValidator extends OncePerRequestFilter {

    private final SecretKey key;

    public JwtValidator() {
        // Use Base64 decode to produce the same key bytes as JwtProvider
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(JwtConstant.SECRET_KEY));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String jwt = request.getHeader(JwtConstant.JWT_HEADER);

        if (jwt != null && jwt.startsWith("Bearer ")) {
            String token = jwt.substring(7); // actual token without "Bearer "

            try {
                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(key)
                        .build()
                        .parseClaimsJws(token)
                        .getBody();

                String email = claims.getSubject(); // or claims.get("email")
                Object authoritiesObj = claims.get("authorities");
                String authorities = authoritiesObj != null ? String.valueOf(authoritiesObj) : "";

                List<GrantedAuthority> auths = authorities.isEmpty()
                        ? AuthorityUtils.NO_AUTHORITIES
                        : AuthorityUtils.commaSeparatedStringToAuthorityList(authorities);

                Authentication authentication =
                        new UsernamePasswordAuthenticationToken(email, null, auths);

                SecurityContextHolder.getContext().setAuthentication(authentication);

            } catch (ExpiredJwtException e) {
                // token expired
                throw new BadCredentialsException("Token expired, please login again");
            } catch (Exception e) {
                throw new BadCredentialsException("Invalid token .. from Jwt Validator");
            }
        }

        filterChain.doFilter(request, response);
    }
}
