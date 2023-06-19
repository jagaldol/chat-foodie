CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT,
    login_id VARCHAR(40) NOT NULL,
    password VARCHAR(64) NOT NULL,
    name VARCHAR(20) DEFAULT '회원',
    gender TINYINT(1) DEFAULT 0,
    birth DATE DEFAULT (CURRENT_DATE),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT now(),
    CONSTRAINT user_id_uindex PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS admin (
    id INT AUTO_INCREMENT,
    login_id VARCHAR(40) NOT NULL,
    password VARCHAR(64) NOT NULL,
    name VARCHAR(20) DEFAULT '관리자',
    created_at TIMESTAMP DEFAULT now(),
    CONSTRAINT admin_id_uindex PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS chatroom (
    id INT AUTO_INCREMENT,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    CONSTRAINT chatroom_id_uindex PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS message (
    id INT AUTO_INCREMENT,
    chatroom_id INT NOT NULL,
    from_user_id INT NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT now(),
    CONSTRAINT message_id_uindex PRIMARY KEY (id)
);