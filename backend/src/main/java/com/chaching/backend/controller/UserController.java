package com.chaching.backend.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {

    private final OAuth2AuthorizedClientService authorizedClientService;

    // Inject the OAuth2AuthorizedClientService
    public UserController(OAuth2AuthorizedClientService authorizedClientService) {
        this.authorizedClientService = authorizedClientService;
    }

    // Endpoint to handle the OAuth2 callback
    @PostMapping("/auth/google/callback")
    public Map<String, String> handleAuthCallback(@RequestBody Map<String, String> body) {
        String code = body.get("code");

        if (code == null || code.isEmpty()) {
            return Map.of("error", "No code received from frontend.");
        }

        try {
            // Exchange the code for an access token (JWT or other)
            String token = exchangeCodeForToken(code);

            if (token != null) {
                return Map.of("token", token); // Return the token
            } else {
                return Map.of("error", "Failed to exchange code for token.");
            }
        } catch (Exception e) {
            return Map.of("error", "Error during token exchange: " + e.getMessage());
        }
    }

    // Method to exchange the authorization code for an access token
    private String exchangeCodeForToken(String code) {
        // Get the OAuth2 authorized client (i.e., the client that performed the authentication)
        OAuth2AuthorizedClient authorizedClient = authorizedClientService.loadAuthorizedClient("google", "user");

        if (authorizedClient != null) {
            OAuth2AccessToken accessToken = authorizedClient.getAccessToken();
            return accessToken.getTokenValue(); // Return the JWT token
        }

        return null;
    }

    // Endpoint to get user details from OAuth2 (with authentication)
    @GetMapping("/user")
    public Map<String, Object> getUser(@AuthenticationPrincipal OAuth2User principal) {
        return principal.getAttributes(); // This includes name, email, picture, etc.
    }
}
