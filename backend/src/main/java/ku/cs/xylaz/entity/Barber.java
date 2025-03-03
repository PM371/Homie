package ku.cs.xylaz.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "barbers")
public class Barber {
    public Barber(String name, String specialty, int experience, String gender, String about, String profilePicture) {
        this.name = name;
        this.specialty = specialty;
        this.experience = experience;
        this.gender = gender;
        this.about = about;
        this.profilePicture = profilePicture;
    }
    @Id
    @GeneratedValue
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "barber_id", updatable = false, nullable = false)
    private UUID id;

    @Column(nullable = false)
    private String name;

    private String specialty;
    private int experience;
    private String profilePicture;
    private String gender;
    private String about;
}
