package net.chatfoodie.server.chatroom;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import net.chatfoodie.server.user.User;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "chatroom_tb")
public class Chatroom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    private LocalDateTime created_at;
}
