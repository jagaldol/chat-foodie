package net.chatfoodie.server.chatroom;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import net.chatfoodie.server.user.User;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

import java.time.LocalDateTime;

@Entity
@Getter
@DynamicInsert
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "chatroom_tb")
public class Chatroom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 50)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @ColumnDefault("now()")
    private LocalDateTime createdAt;

    @Builder
    public Chatroom(Long id, String title, User user, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.user = user;
        this.createdAt = createdAt;
    }

    public void updateTitle(String title) {
        this.title = title;
    }
}
