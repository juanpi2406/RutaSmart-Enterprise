package com.rutasmart.service.interfaces;

import com.rutasmart.dto.request.LoginRequest;
import com.rutasmart.dto.response.LoginResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request);

}