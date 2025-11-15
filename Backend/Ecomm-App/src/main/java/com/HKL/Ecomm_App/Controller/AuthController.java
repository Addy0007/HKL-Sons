package com.HKL.Ecomm_App.Controller;

import com.HKL.Ecomm_App.Config.JwtProvider;
import com.HKL.Ecomm_App.Model.User;
import com.HKL.Ecomm_App.Repository.UserRepository;
import com.HKL.Ecomm_App.Request.LoginRequest;
import com.HKL.Ecomm_App.Response.AuthResponse;
import com.HKL.Ecomm_App.Service.CartService;
import com.HKL.Ecomm_App.Service.CustomUserServiceImplementation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AuthController {

    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CustomUserServiceImplementation customUserServiceImplementation;
    private final CartService cartService;

    public AuthController(
            UserRepository userRepository,
            CustomUserServiceImplementation customUserServiceImplementation,
            PasswordEncoder passwordEncoder,
            JwtProvider jwtProvider,
            CartService cartService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.customUserServiceImplementation = customUserServiceImplementation;
        this.jwtProvider = jwtProvider;
        this.cartService = cartService;
    }

    // ----------------------------------------
    // SIGNUP
    // ----------------------------------------
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> createUserHandler(@RequestBody User user) {

        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new RuntimeException("Email is already used with another account");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);

        // Create cart for new user
        cartService.createCart(savedUser);

        // Generate token from email
        String token = jwtProvider.generateTokenFromEmail(savedUser.getEmail());

        savedUser.setPassword(null); // NEVER return password

        AuthResponse authResponse = new AuthResponse(token, "SignUp Success", savedUser);

        return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
    }


    // ----------------------------------------
    // SIGNIN
    // ----------------------------------------
    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> loginUserHandler(@RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticate(loginRequest.getEmail(), loginRequest.getPassword());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(loginRequest.getEmail());
        String token = jwtProvider.generateToken(authentication);

        user.setPassword(null); // DO NOT RETURN PASSWORD

        AuthResponse authResponse = new AuthResponse(token, "SignIn Success", user);

        return new ResponseEntity<>(authResponse, HttpStatus.OK);
    }


    private Authentication authenticate(String email, String rawPassword) {

        UserDetails userDetails = customUserServiceImplementation.loadUserByUsername(email);

        if (userDetails == null) {
            throw new BadCredentialsException("User not found");
        }

        if (!passwordEncoder.matches(rawPassword, userDetails.getPassword())) {
            throw new BadCredentialsException("Invalid password");
        }

        return new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities()
        );
    }
}
