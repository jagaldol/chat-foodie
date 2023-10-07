CREATE TABLE IF NOT EXISTS user_tb
(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    login_id VARCHAR(40) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    name VARCHAR(40) DEFAULT '회원',
    gender BOOLEAN DEFAULT FALSE,
    birth DATE DEFAULT '2000-01-01',
    email VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(50) DEFAULT 'ROLE_PENDING' CHECK (role IN ('ROLE_PENDING','ROLE_USER')),
    created_at TIMESTAMP DEFAULT now()
);
CREATE INDEX user_email_idx
    ON user_tb (email);
CREATE INDEX user_loginId_idx
    ON user_tb (login_id);

CREATE TABLE IF NOT EXISTS chatroom_tb
(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);


CREATE TABLE IF NOT EXISTS message_tb
(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    chatroom_id BIGINT NOT NULL,
    is_from_chatbot BOOLEAN NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);
CREATE INDEX message_chatroom_id_idx
    ON message_tb (chatroom_id);


CREATE TABLE IF NOT EXISTS favor_tb
(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    food_id BIGINT,
    created_at TIMESTAMP DEFAULT now()
);
CREATE INDEX favor_user_id_idx
    ON favor_tb (user_id);


CREATE TABLE IF NOT EXISTS food_tb
(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    image_url VARCHAR(100) NOT NULL,
    country VARCHAR(50) NOT NULL,
    flavor VARCHAR(50) NOT NULL,
    temperature VARCHAR(50) NOT NULL,
    ingredient VARCHAR(50) NOT NULL,
    spicy INTEGER NOT NULL,
    oily VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);


CREATE TABLE IF NOT EXISTS chat_public_log_tb
(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ip VARCHAR(20) NOT NULL,
    request_message TEXT NOT NULL,
    output TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);
CREATE INDEX chat_public_log_ip_created_at_idx
    ON chat_public_log_tb (ip, created_at);


CREATE TABLE IF NOT EXISTS email_verification_tb
(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    verification_code VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);
CREATE INDEX email_verification_email_idx
    ON email_verification_tb (email);
