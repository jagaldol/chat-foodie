package net.chatfoodie.server.chatroom.message.repository;

import net.chatfoodie.server.chatroom.message.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;



public interface MessageRepository extends JpaRepository<Message, Long> {

    void deleteAllByChatroomId(Long chatroomId);

    List<Message> findTop38ByChatroomIdOrderByIdDesc(Long chatroomId);

    Optional<Message> findTop1ByChatroomIdOrderByIdDesc(Long chatroomId);

    List<Message> findAllByChatroomIdAndIdLessThanOrderByIdDesc(Long chatroomId, Long key, Pageable pageable);

    List<Message> findAllByChatroomIdOrderByIdDesc(Long chatroomId, Pageable pageable);
}
