package net.chatfoodie.server.chat.publiclog.repository;

import net.chatfoodie.server.chat.publiclog.ChatPublicLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatPublicLogRepository extends JpaRepository<ChatPublicLog, Long> {

}
