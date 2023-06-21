package net.chatfoodie.server.domain.chatroom.repository;

import net.chatfoodie.server.domain.chatroom.entity.Chatroom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatroomRepository extends JpaRepository<Chatroom, Long> {
}
