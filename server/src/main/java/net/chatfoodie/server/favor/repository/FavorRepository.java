package net.chatfoodie.server.favor.repository;

import net.chatfoodie.server.favor.Favor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface FavorRepository extends JpaRepository<Favor, Long> {

    @Modifying
    @Query("DELETE FROM Favor f WHERE f.user.id = :userId")
    void deleteAllByUserId(Long userId);

    @Query("SELECT f FROM Favor f JOIN FETCH f.food fo WHERE f.user.id=:userId")
    List<Favor> findByUserId(Long userId);

}
