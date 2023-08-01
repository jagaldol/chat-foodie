package net.chatfoodie.server.message;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
public class Message {
    @Id
    @GeneratedValue
    Long id;

    Long chatroom_id;

    Long from_user_id;

    String content;

    LocalDateTime created_at;
}
