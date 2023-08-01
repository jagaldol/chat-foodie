package net.chatfoodie.server.chatroom;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
public class Chatroom {
    @Id
    @GeneratedValue
    private Long id;

    private Long user_id;

    private LocalDateTime created_at;
}
