package net.chatfoodie.server.message.repository;

import net.chatfoodie.server.message.Message;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> {
}
