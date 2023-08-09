package net.chatfoodie.server.chatroom.message.controller;


import lombok.RequiredArgsConstructor;

import net.chatfoodie.server._core.security.CustomUserDetails;
import net.chatfoodie.server._core.utils.ApiUtils;
import net.chatfoodie.server.chatroom.message.dto.MessageResponse;
import net.chatfoodie.server.chatroom.message.service.MessageService;

import org.springframework.http.ResponseEntity;


import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class MessageController {

    final private MessageService messageService;
    @GetMapping("/chatrooms/{chatroomId}/messages")
    public ResponseEntity<?> chatHistory(@PathVariable Long chatroomId, @AuthenticationPrincipal CustomUserDetails userDetails) {
        MessageResponse.ContentList responseDto = messageService.chatHistory(userDetails.getId(), chatroomId);
        ApiUtils.Response<?> response = ApiUtils.success(responseDto);
        return ResponseEntity.ok().body(response);

    }
}
