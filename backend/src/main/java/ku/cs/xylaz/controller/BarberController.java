package ku.cs.xylaz.controller;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;  // This is from Spring
import ku.cs.xylaz.entity.Barber;
import ku.cs.xylaz.repository.BarberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
// Correct imports for Spring file handling
import org.springframework.core.io.FileSystemResource;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.io.IOException;
import org.springframework.web.multipart.MultipartFile;



@RestController
@RequestMapping("/")
public class BarberController {
    @Autowired
    private final BarberRepository barberRepository;

    public BarberController(BarberRepository barberRepository) {
        this.barberRepository = barberRepository;
    }

//    @PostMapping("/addBarber")
//    public ResponseEntity<Barber> addBarber(@RequestBody Barber barber) {
//        Barber savedBarber = barberRepository.save(barber);
//        return new ResponseEntity<>(savedBarber, HttpStatus.CREATED);
//    }
@PostMapping("/addBarber")
public ResponseEntity<Barber> addBarber(
        @RequestParam("profilePicture") MultipartFile profilePicture, // รับไฟล์
        @RequestParam("name") String name,
        @RequestParam("specialty") String specialty,
        @RequestParam("experience") int experience,
        @RequestParam("gender") String gender,
        @RequestParam("about") String about) {

    // ดึงนามสกุลของไฟล์
    String originalFileName = profilePicture.getOriginalFilename();
    String fileExtension = originalFileName != null && originalFileName.contains(".")
            ? originalFileName.substring(originalFileName.lastIndexOf("."))
            : "";

    // สร้างชื่อไฟล์ใหม่โดยใช้ name จากฟอร์มและเก็บนามสกุลไฟล์ไว้
    String fileName = name + fileExtension;
    Path filePath = Paths.get("db/picture/" + fileName); // ระบุ path ที่จะเก็บไฟล์

    try {
        // บันทึกไฟล์
        Files.copy(profilePicture.getInputStream(), filePath);

        // สร้าง Barber object และบันทึกในฐานข้อมูล
        Barber barber = new Barber(name, specialty, experience, gender, about, fileName);
        Barber savedBarber = barberRepository.save(barber);

        return new ResponseEntity<>(savedBarber, HttpStatus.CREATED);
    } catch (IOException e) {
        e.printStackTrace();
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
    @GetMapping("/picture/{fileName}")
    public ResponseEntity<Resource> getFile(@PathVariable String fileName) {
        // Define the file path
        Path filePath = Paths.get("db/picture/" + fileName);

        // Create a FileSystemResource to point to the file
        Resource resource = new FileSystemResource(filePath);

        // Check if the file exists
        if (resource.exists()) {
            return ResponseEntity.ok()
                    .header("Content-Type", "image/jpeg") // Adjust content type if necessary
                    .body(resource);
        } else {
            return ResponseEntity.notFound().build(); // Return 404 if the file doesn't exist
        }
    }



    @GetMapping("/")
    public List<Map<String, Object>> getAllBarberData() {
        return barberRepository.findAll().stream()
                .map(barber -> {
                    Map<String, Object> barberData = new HashMap<>();
                    barberData.put("barber_id", barber.getId());
                    barberData.put("name", barber.getName());
                    barberData.put("specialty", barber.getSpecialty());
                    barberData.put("experience", barber.getExperience());
                    barberData.put("profilePicture", barber.getProfilePicture());
                    barberData.put("gender", barber.getGender());
                    barberData.put("about", barber.getAbout());
                    return barberData;
                })
                .collect(Collectors.toList());
    }
}
