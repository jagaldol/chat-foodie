package net.chatfoodie.server.message;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import net.chatfoodie.server.chatroom.Chatroom;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "message_tb")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Chatroom chatroom;

    private boolean isFromChatbot;

    private String content;

    private LocalDateTime created_at;
}
