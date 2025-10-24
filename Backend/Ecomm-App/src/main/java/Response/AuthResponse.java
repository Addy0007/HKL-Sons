package Response;

import lombok.Data;

@Data
public class AuthResponse {
    private String jwt;
    private String message;

    public  AuthResponse(){

    }
    public AuthResponse(String jwt,String message) {
        this.message = message;
        this.jwt = jwt;
    }
}
