package ku.cs.xylaz.repository;

import ku.cs.xylaz.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;


@Repository
public interface MemberRepository extends JpaRepository<Member, UUID> {
    Member findByUsername(String username);
}
