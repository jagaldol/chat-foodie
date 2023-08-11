package net.chatfoodie.server.chatroom.message.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.chatfoodie.server._core.errors.exception.Exception403;
import net.chatfoodie.server._core.errors.exception.Exception404;
import net.chatfoodie.server.chatroom.Chatroom;
import net.chatfoodie.server.chatroom.message.Message;
import net.chatfoodie.server.chatroom.message.repository.MessageRepository;
import net.chatfoodie.server.chatroom.repository.ChatroomRepository;
import net.chatfoodie.server.util.CursorRequest;
import net.chatfoodie.server.util.PageCursor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;


@Slf4j
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class MessageService {

    final private MessageRepository messageRepository;
    final private ChatroomRepository chatroomRepository;

    public PageCursor<Message> chatHistory(Long userId, Long chatroomId, CursorRequest cursorRequest) {

        Chatroom chatroom = chatroomRepository.findById(chatroomId)
                .orElseThrow(() -> new Exception404("채팅방을 찾을 수 없습니다."));

        // 채팅방의 유저와 현재 접속한 유저가 같은지 확인합니다.
        if (!Objects.equals(chatroom.getUser().getId(), userId)) {
            throw new Exception403("현재 유저의 채팅방이 아닙니다.");
        }

        Pageable pageable = PageRequest.of(0, 3, Sort.by(Sort.Direction.DESC, "id"));
        Page<Message> chatHistoryPage = messageRepository.findAllByChatroomId(chatroomId, pageable);

        List<Message> chatHistory = chatHistoryPage.getContent();
        CursorRequest nextCursor = cursorRequest.next(getNextKey(chatHistory));

        return new PageCursor<>(nextCursor, chatHistory);
    }

    private Page<Message> findAllByChatroomId(Long chatroomId, CursorRequest cursorRequest) {
        Pageable pageable = PageRequest.of(0, 3, Sort.by(Sort.Direction.DESC, "id"));

        if (cursorRequest.hasKey()) {
            return messageRepository.findAllByLessThanIdAndChatroomId(cursorRequest.key(), chatroomId, pageable);
        }
        return messageRepository.findAllByChatroomId(chatroomId, pageable);

    }

    private static long getNextKey(List<Message> messages) {
        return messages.stream()
                .mapToLong(Message::getId)
                .min()
                .orElse(CursorRequest.NONE_KEY);
    }
}

//public class MessageService {
//
////    final private MessageRepository messageRepository;
////    final private ChatroomRepository chatroomRepository;
////
////    public MessageResponse.ContentList chatHistory(Long userId, Long chatroomId) {
////
////        Chatroom chatroom = chatroomRepository.findById(chatroomId)
////                .orElseThrow(() -> new Exception404("채팅방을 찾을 수 없습니다."));
////
////        // 채팅방의 유저와 현재 접속한 유저가 같은지 확인합니다.
////        if (!Objects.equals(chatroom.getUser().getId(), userId)) {
////            throw new Exception403("현재 유저의 채팅방이 아닙니다.");
////        }
////
////        // 채팅방의 대화내용을 조회하고, 최신 메시지 순서로 정렬합니다.
////        List<Message> chatHistory = messageRepository.findAllByChatroomId(chatroomId);
////
////
////        return MessageResponse.ContentList.of(chatHistory);
////    }
//
//}
