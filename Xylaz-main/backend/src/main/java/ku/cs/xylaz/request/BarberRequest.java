package ku.cs.xylaz.request;

import lombok.Data;

@Data
public class BarberRequest {

    private String profilePicture;
    private String specialty;
    private String gender;
    private String name;
    private String about;
    private String experience;
}
