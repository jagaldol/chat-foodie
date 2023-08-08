package net.chatfoodie.server.chatroom.repository;

import net.chatfoodie.server.chatroom.Chatroom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatroomRepository extends JpaRepository<Chatroom, Long> {
    List<Chatroom> findAllByUserIdOrderByIdDesc(Long userId);

}
