package net.chatfoodie.server.domain.user.repository;


import net.chatfoodie.server.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

}
