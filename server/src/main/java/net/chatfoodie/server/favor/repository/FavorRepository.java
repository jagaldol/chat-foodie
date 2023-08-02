package net.chatfoodie.server.favor.repository;

import net.chatfoodie.server.favor.Favor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavorRepository extends JpaRepository<Favor, Long> {

    List<Favor> findByUserId(Long userId);
}
