package net.chatfoodie.server.favor.repository;

import net.chatfoodie.server.favor.Favor;
import net.chatfoodie.server.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface FavorRepository extends JpaRepository<Favor, Long> {

    @Modifying
    @Query("DELETE FROM Favor f WHERE f.user = :user")
    void deleteAllByUser(@Param("user") User user);

    @Modifying
    @Query(value = "ALTER TABLE favor_tb ALTER COLUMN id RESTART WITH 1", nativeQuery = true)
    void resetIdSequence();

    @Query("SELECT f FROM Favor f JOIN FETCH f.food fo WHERE f.user.id=:userId")
    List<Favor> findByUserId(Long userId);
}
