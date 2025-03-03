package ku.cs.xylaz.controller;

import ku.cs.xylaz.entity.Member;
import ku.cs.xylaz.repository.MemberRepository;
import ku.cs.xylaz.response.ApiResponse;
import ku.cs.xylaz.request.LoginRequest;
import ku.cs.xylaz.request.SignupRequest;
import ku.cs.xylaz.response.LoginResponse;
import ku.cs.xylaz.service.LoginService;
import ku.cs.xylaz.service.SignupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/")
public class AuthController {
    @Autowired
    private SignupService signupService;
    @Autowired
    private LoginService authService;
    @Autowired
    private MemberRepository memberRepository;

    @PostMapping("/signup")
    public ResponseEntity<String> signupUser(@RequestBody SignupRequest user) {

        if (signupService.isUsernameAvailable(user.getUsername())) {
            signupService.createUser(user);
            return ResponseEntity.ok("Signup successful");
        } else {
            return ResponseEntity.status(400).body("Username not available");
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody LoginRequest loginRequest) {
        try {
            String token = authService.authenticate(loginRequest.getUsername(), loginRequest.getPassword());

            LoginResponse loginResponse = new LoginResponse(token, loginRequest.getUsername());
            ApiResponse<LoginResponse> apiResponse = new ApiResponse<>(true, "Sign-in successful", loginResponse);

            return ResponseEntity.ok(apiResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, "Sign-in failed: " + e.getMessage(), null));
        }
    }
}