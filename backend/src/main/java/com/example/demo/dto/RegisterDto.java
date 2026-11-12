package com.example.demo.dto;

import com.example.demo.entity.SystemUser;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterDto {
    private String username;
    private String email;
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;
    private SystemUser.Role role;
}