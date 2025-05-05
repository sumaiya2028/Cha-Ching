package com.chaching.backend.config;

import com.chaching.backend.model.User;
import com.chaching.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserService userService;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        // Load user details from the OAuth provider (Google)
        OAuth2User oAuth2User = super.loadUser(userRequest);
        Map<String, Object> attributes = oAuth2User.getAttributes();

        // You can log or process user details here
        System.out.println("User Info: " + attributes);

        // Extract user details from the attributes (assuming Google provides them)
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String picture = (String) attributes.get("picture");  // Profile picture URL from Google

        // Call findOrCreateUser with email, name, and profile picture
        User user = userService.findOrCreateUser(email, name, picture);

        // You can also log or process the user as needed
        System.out.println("User Created or Found: " + user);

        // Return the OAuth2User (this is the user that Spring Security will use)
        return oAuth2User;
    }
}
