package net.chatfoodie.server.favor.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.chatfoodie.server._core.errors.exception.Exception403;
import net.chatfoodie.server._core.security.CustomUserDetails;
import net.chatfoodie.server._core.utils.ApiUtils;
import net.chatfoodie.server.favor.dto.FavorRequest;
import net.chatfoodie.server.favor.service.FavorService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;


@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class FavorController {

    final private FavorService favorService;

    @PostMapping("/favors/{id}")
    public ResponseEntity<?> saveUserFoodPreference(@PathVariable Long id,
                                                    @AuthenticationPrincipal CustomUserDetails userDetails,
                                                    @RequestBody @Valid FavorRequest.SaveUserFoodPreferenceDto requestDto, Errors error) {
        if (!Objects.equals(userDetails.getId(), id)) {
            throw new Exception403("권한이 없습니다.");
        }
        favorService.saveUserFoodPreference(id, requestDto);
        ApiUtils.Response<?> response = ApiUtils.success(requestDto);
        return ResponseEntity.ok().body(response);
    }
}
