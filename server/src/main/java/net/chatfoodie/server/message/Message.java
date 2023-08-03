package net.chatfoodie.server.message;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import net.chatfoodie.server.chatroom.Chatroom;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

import java.time.LocalDateTime;

@Entity
@Getter
@DynamicInsert
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "message_tb")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Chatroom chatroom;

    private boolean isFromChatbot;

    @Column(columnDefinition = "TEXT")
    private String content;

    @ColumnDefault(value = "now()")
    private LocalDateTime created_at;
}
