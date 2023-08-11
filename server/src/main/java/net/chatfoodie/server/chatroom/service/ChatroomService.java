package net.chatfoodie.server.chatroom.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.chatfoodie.server._core.errors.exception.Exception403;
import net.chatfoodie.server._core.errors.exception.Exception404;
import net.chatfoodie.server._core.errors.exception.Exception500;
import net.chatfoodie.server._core.utils.Utils;
import net.chatfoodie.server._core.utils.cursor.CursorRequest;
import net.chatfoodie.server._core.utils.cursor.PageCursor;
import net.chatfoodie.server.chatroom.Chatroom;
import net.chatfoodie.server.chatroom.dto.ChatroomRequest;
import net.chatfoodie.server.chatroom.dto.ChatroomResponse;
import net.chatfoodie.server.chatroom.message.Message;
import net.chatfoodie.server.chatroom.message.repository.MessageRepository;
import net.chatfoodie.server.chatroom.repository.ChatroomRepository;
import net.chatfoodie.server.user.User;
import net.chatfoodie.server.user.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

@Slf4j
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class ChatroomService {
    final private ChatroomRepository chatroomRepository;
    final private UserRepository userRepository;
    final private MessageRepository messageRepository;

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

    public ChatroomResponse.GetChatroomDto get(Long userId) {
        List<Chatroom> chatrooms = chatroomRepository.findAllByUserIdOrderByIdDesc(userId);

        return ChatroomResponse.GetChatroomDto.of(chatrooms);
    }

    @Transactional
    public void changeTitle(Long chatroomId, Long userId, ChatroomRequest.ChangeTitleDto requestDto) {
        Chatroom chatroom = chatroomRepository.findById(chatroomId).orElseThrow(() -> new Exception404("채팅방을 찾을 수 없습니다."));
        
        if (!Objects.equals(chatroom.getUser().getId(), userId)) throw new Exception403("현재 유저의 채팅방이 아닙니다.");

        chatroom.updateTitle(requestDto.title());
    }

    @Transactional
    public void delete(Long userId, Long chatroomId) {
        Chatroom chatroom = chatroomRepository.findById(chatroomId).orElseThrow(() -> new Exception404("채팅방을 찾을 수 없습니다."));

        if (!Objects.equals(userId, chatroom.getUser().getId())) throw new Exception403("현재 유저의 채팅방이 아닙니다.");

        messageRepository.deleteAllByChatroomId(chatroomId);
        chatroomRepository.delete(chatroom);
    }

    public PageCursor<ChatroomResponse.getMessagesDto> chatHistory(Long userId, Long chatroomId, CursorRequest cursorRequest) {

        Chatroom chatroom = chatroomRepository.findById(chatroomId)
                .orElseThrow(() -> new Exception404("채팅방을 찾을 수 없습니다."));

        // 채팅방의 유저와 현재 접속한 유저가 같은지 확인합니다.
        if (!Objects.equals(chatroom.getUser().getId(), userId)) {
            throw new Exception403("현재 유저의 채팅방이 아닙니다.");
        }

        var messages = getMessages(chatroomId, cursorRequest);
        Collections.reverse(messages);

        var response = ChatroomResponse.getMessagesDto.of(messages);


        var nextKey = messages.stream()
                .mapToLong(Message::getId)
                .min().orElse(CursorRequest.NONE_KEY);

        return new PageCursor<>(cursorRequest.next(nextKey), response);
    }

    private List<Message> getMessages(Long chatroomId, CursorRequest cursorRequest) {
        Pageable pageable = PageRequest.of(0, cursorRequest.getSize());

        if (cursorRequest.hasKey())
            return messageRepository.findAllByChatroomIdAndIdLessThanOrderByIdDesc(chatroomId, cursorRequest.key(), pageable);
        return messageRepository.findAllByChatroomIdOrderByIdDesc(chatroomId, pageable);
    }
}
