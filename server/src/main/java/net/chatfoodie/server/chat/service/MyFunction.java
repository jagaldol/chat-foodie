package net.chatfoodie.server.chat.service;


import net.chatfoodie.server.chat.dto.MessageIds;

@FunctionalInterface
public interface MyFunction {
    MessageIds apply(String message);
}
