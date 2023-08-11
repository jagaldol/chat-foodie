package net.chatfoodie.server.chatroom.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.chatfoodie.server._core.security.CustomUserDetails;
import net.chatfoodie.server._core.utils.ApiUtils;
import net.chatfoodie.server._core.utils.cursor.CursorRequest;
import net.chatfoodie.server._core.utils.cursor.PageCursor;
import net.chatfoodie.server.chatroom.dto.ChatroomRequest;
import net.chatfoodie.server.chatroom.dto.ChatroomResponse;
import net.chatfoodie.server.chatroom.service.ChatroomService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/chatrooms")
    public ResponseEntity<?> get(@AuthenticationPrincipal CustomUserDetails userDetails) {
        ChatroomResponse.GetChatroomDto getChatroomDto = chatroomService.get(userDetails.getId());
        ApiUtils.Response<?> response = ApiUtils.success(getChatroomDto);
        return ResponseEntity.ok().body(response);
    }

    @PutMapping("/chatrooms/{chatroomId}")
    public ResponseEntity<?> changeTitle(@PathVariable Long chatroomId,
                                         @AuthenticationPrincipal CustomUserDetails userDetails,
                                         @RequestBody @Valid ChatroomRequest.ChangeTitleDto requestDto,
                                         Errors errors) {
        chatroomService.changeTitle(chatroomId, userDetails.getId(), requestDto);
        ApiUtils.Response<?> response = ApiUtils.success();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/chatrooms/{chatroomId}")
    public ResponseEntity<?> deleteChatroom(@PathVariable Long chatroomId,
                                            @AuthenticationPrincipal CustomUserDetails userDetails) {
        chatroomService.delete(userDetails.getId(), chatroomId);
        ApiUtils.Response<?> response = ApiUtils.success();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/chatrooms/{chatroomId}/messages")
    public ResponseEntity<?> chatHistory(@PathVariable Long chatroomId,
                                         @AuthenticationPrincipal CustomUserDetails userDetails,
                                         CursorRequest cursorRequest) {
        PageCursor<?> responseDto = chatroomService.chatHistory(userDetails.getId(), chatroomId, cursorRequest);
        ApiUtils.Response<?> response = ApiUtils.success(responseDto);
        return ResponseEntity.ok(response);
    }
}
