package com.HKL.Ecomm_App.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

/**
 * ✅ Handles security configuration for your entire app:
 * - Enables JWT stateless authentication
 * - Configures public/private routes
 * - Sets up CORS for frontend (React on port 5173)
 */
@Configuration
@EnableWebSecurity
public class AppConfig {

    // ✅ Main security filter chain
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // Disable CSRF since this is a REST API
                .csrf(csrf -> csrf.disable())

                // ✅ Enable CORS with our custom configuration
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Stateless sessions (JWT handles authentication)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Authorization rules
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll()  // Public endpoints (signup/login)
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll() // Swagger access
                        .requestMatchers("/api/products/**").permitAll() // ✅ ADDED: Make all product endpoints public
                        .requestMatchers("/api/**").authenticated() // Protected routes (cart, orders, etc.)
                        .anyRequest().permitAll()
                )

                // ✅ Add your custom JWT validator before UsernamePasswordAuthenticationFilter
                .addFilterBefore(new JwtValidator(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // ✅ Configure Cross-Origin Resource Sharing
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Allowed frontend URLs
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:5173",  // Vite (your frontend)
                "http://localhost:3000",  // React CRA (optional)
                "http://localhost:4200"   // Angular (optional)
        ));

        // Allowed request types
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Allowed headers from frontend
        configuration.setAllowedHeaders(Collections.singletonList("*"));

        // Headers exposed to frontend (e.g. Authorization token)
        configuration.setExposedHeaders(Arrays.asList("Authorization"));

        // Allow cookies or credentials (JWT tokens)
        configuration.setAllowCredentials(true);

        // Apply to all endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}