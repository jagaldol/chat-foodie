package net.chatfoodie.server.chatroom.controller;

import lombok.RequiredArgsConstructor;
import net.chatfoodie.server._core.security.CustomUserDetails;
import net.chatfoodie.server._core.utils.ApiUtils;
import net.chatfoodie.server.chatroom.service.ChatroomService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class ChatroomController {
    final private ChatroomService chatroomService;

    @PostMapping("/chatrooms")
    public ResponseEntity<?> create(@AuthenticationPrincipal CustomUserDetails userDetails) {
        chatroomService.create(userDetails.getId());
        ApiUtils.Response<?> response = ApiUtils.success();
        return ResponseEntity.ok().body(response);
    }
}
