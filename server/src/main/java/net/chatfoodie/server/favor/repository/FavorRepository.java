package net.chatfoodie.server.favor.repository;

import net.chatfoodie.server.favor.Favor;
import net.chatfoodie.server.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FavorRepository extends JpaRepository<Favor, Long> {

    Optional<Favor> findByUser(User user);
}
