package com.gamage.studentmanagementbackend.controller;

import com.gamage.studentmanagementbackend.entity.User;
import com.gamage.studentmanagementbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // GET all users
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // GET user by id
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userRepository.findById(id).orElse(null);
    }

    // POST create new user
    @PostMapping
    public User createUser(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // PUT update user
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        User user = userRepository.findById(id).orElse(null);
        if (user != null) {
            user.setUsername(updatedUser.getUsername());
            user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
            user.setEmail(updatedUser.getEmail());
            user.setRole(updatedUser.getRole());
            return userRepository.save(user);
        }
        return null;
    }

    // DELETE user
    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return "User deleted successfully";
    }
}
