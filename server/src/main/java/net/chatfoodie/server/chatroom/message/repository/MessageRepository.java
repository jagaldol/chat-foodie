package net.chatfoodie.server.chatroom.message.repository;

import net.chatfoodie.server.chatroom.message.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    void deleteAllByChatroomId(Long chatroomId);
}
