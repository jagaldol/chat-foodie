package net.chatfoodie.server._core.config;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Configs {
    public final static List<String> CORS = Collections.unmodifiableList(
            List.of("http://localhost:3000",
                    "http://chatfoodie.net",
                    "https://chatfoodie.net",
                    "http://www.chatfoodie.net",
                    "https://www.chatfoodie.net")  // 모든 IP 주소 허용 (나중에 프론트 앤드 IP만 허용하게 바꿔야함)
    );
}
