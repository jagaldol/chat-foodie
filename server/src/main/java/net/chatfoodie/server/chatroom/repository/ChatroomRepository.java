package net.chatfoodie.server.chatroom.repository;

import net.chatfoodie.server.chatroom.Chatroom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ChatroomRepository extends JpaRepository<Chatroom, Long> {
    List<Chatroom> findAllByUserIdOrderByIdDesc(Long userId);

    @Query("SELECT c FROM Chatroom c JOIN FETCH c.user u WHERE c.id=:id")
    Optional<Chatroom> findByIdJoinUser(Long id);

    List<Chatroom> findAllByUserId(Long id);
}
