package net.chatfoodie.server.chatroom.message.repository;

import net.chatfoodie.server.chatroom.message.Message;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;
import java.util.Optional;



public interface MessageRepository extends JpaRepository<Message, Long> {
    void deleteAllByChatroomId(Long chatroomId);

    List<Message> findTop38ByChatroomIdOrderByIdDesc(Long chatroomId);

    Optional<Message> findTop1ByChatroomIdOrderByIdDesc(Long chatroomId);

    List<Message> findAllByChatroomId(Long chatroomId);

}
