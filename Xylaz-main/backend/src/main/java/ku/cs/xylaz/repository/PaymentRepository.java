package ku.cs.xylaz.repository;

import ku.cs.xylaz.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
@Repository
public interface PaymentRepository extends JpaRepository<Appointment, UUID> {
    List<Appointment> findByMemberId(UUID memberId);
    List<Appointment> findByBarberId(UUID barberId);
    List<Appointment> findByStatus(String status);
    List<Appointment> findByAppointmentDate(String appointmentDate);
    List<Appointment> findByMemberIdAndAppointmentDate(UUID memberId, String appointmentDate);
}
