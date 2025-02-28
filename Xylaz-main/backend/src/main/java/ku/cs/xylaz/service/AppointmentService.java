package ku.cs.xylaz.service;

import ku.cs.xylaz.entity.Barber;
import ku.cs.xylaz.entity.Member;
import ku.cs.xylaz.entity.Appointment;
import ku.cs.xylaz.repository.AppointmentRepository;
import ku.cs.xylaz.repository.BarberRepository;
import ku.cs.xylaz.repository.MemberRepository;
import ku.cs.xylaz.request.AppointmentRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final MemberRepository memberRepository;
    private final BarberRepository barberRepository;

    @Autowired
    public AppointmentService(AppointmentRepository appointmentRepository,
                              MemberRepository memberRepository,
                              BarberRepository barberRepository) {
        this.appointmentRepository = appointmentRepository;
        this.memberRepository = memberRepository;
        this.barberRepository = barberRepository;
    }

    public Appointment bookAppointment(String docId, AppointmentRequest request) {
        Member member = memberRepository.findByUsername(request.getUsername());

        Barber barber = barberRepository.findById(UUID.fromString(docId))
                .orElseThrow(() -> new RuntimeException("Barber not found"));

        String appointmentDate = request.getAppointmentDate();
        List<Appointment> existingAppointments = appointmentRepository.findByBarberAndAppointmentDate(barber, appointmentDate);

        if (!existingAppointments.isEmpty()) {
            throw new RuntimeException("Appointment already exists for this barber at the selected date and time.");
        }

        Appointment newAppointment = new Appointment();
        newAppointment.setMember(member);
        newAppointment.setBarber(barber);
        newAppointment.setAppointmentDate(appointmentDate);
        newAppointment.setStatus("Confirmed");
        newAppointment.setServiceType(request.getServiceType());
        newAppointment.setPrice(request.getPrice());

        return appointmentRepository.save(newAppointment);
    }
}





