package net.chatfoodie.server.favor.repository;

import net.chatfoodie.server.favor.Favor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FavorRepository extends JpaRepository<Favor, Long> {

    @Query("SELECT f FROM Favor f JOIN FETCH f.food WHERE f.user.id=:userId")
    List<Favor> findByUserId(Long userId);
}
