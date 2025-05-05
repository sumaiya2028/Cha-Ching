package com.chaching.backend.service;

import com.chaching.backend.model.User;
import com.chaching.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;  // Use PasswordEncoder here

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User save(User user) {
        // Only encrypt password if it's not null and not already encrypted
        if (user.getPassword() != null && !user.getPassword().startsWith("$2a$")) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        return userRepository.save(user);
    }

    public User findOrCreateUser(String email, String fullName) {
        return userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setFullName(fullName);
                    newUser.setProvider("google"); // indicate it's an OAuth user
                    newUser.setPassword(null); // no password needed for Google login
                    return userRepository.save(newUser);
                });
    }

    public User createUser(String email, String password, String fullName) {
        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));  // Use the injected PasswordEncoder
        user.setFullName(fullName);
        user.setProvider("local");
        return userRepository.save(user);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}
