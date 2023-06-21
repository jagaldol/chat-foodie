package net.chatfoodie.server.domain.message.repository;

import net.chatfoodie.server.domain.message.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> {
}
