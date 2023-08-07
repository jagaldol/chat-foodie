package net.chatfoodie.server.chatroom.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.chatfoodie.server._core.errors.exception.Exception400;
import net.chatfoodie.server._core.errors.exception.Exception404;
import net.chatfoodie.server._core.errors.exception.Exception500;
import net.chatfoodie.server._core.utils.Utils;
import net.chatfoodie.server.chatroom.Chatroom;
import net.chatfoodie.server.chatroom.dto.ChatroomRequest;
import net.chatfoodie.server.chatroom.repository.ChatroomRepository;
import net.chatfoodie.server.user.User;
import net.chatfoodie.server.user.repository.UserRepository;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Objects;

@Slf4j
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class ChatroomService {
    final private ChatroomRepository chatroomRepository;
    final private UserRepository userRepository;
    public void create(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new Exception404("회원이 존재하지 않습니다"));

        String title = Utils.convertDateTimeToString(LocalDateTime.now()) + " 음식 추천";

        Chatroom chatroom = Chatroom.builder()
                                .title(title)
                                .user(user)
                                .build();

        try {
            chatroomRepository.save(chatroom);
        } catch (Exception e) {
            throw new Exception500("채팅방 생성 중 오류가 발생하였습니다.");
        }
    }

    @Transactional
    public void changeTitle(Long chatroomId, Long userId, ChatroomRequest.ChangeTitleDto requestDto) {
        Chatroom chatroom = chatroomRepository.findById(chatroomId).orElseThrow(() -> new Exception404("채팅방을 찾을 수 없습니다."));
        
        if (!Objects.equals(chatroom.getUser().getId(), userId)) throw new Exception400("현재 유저의 채팅방이 아닙니다.");
        
        if (requestDto.title() != null) {
            chatroom.updateTitle(requestDto.title());
        }
    }
}
