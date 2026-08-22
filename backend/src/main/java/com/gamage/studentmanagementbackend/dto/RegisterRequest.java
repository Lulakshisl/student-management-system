package com.gamage.studentmanagementbackend.dto;

import com.gamage.studentmanagementbackend.enums.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String password;
    private String email;
    private Role role;
}
