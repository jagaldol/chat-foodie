CREATE TABLE IF NOT EXISTS user_tb (
    id INT AUTO_INCREMENT PRIMARY KEY,
    login_id VARCHAR(40) NOT NULL,
    password VARCHAR(100) NOT NULL,
    name VARCHAR(20) DEFAULT '회원',
    gender TINYINT(1) DEFAULT false,
    birth DATE DEFAULT '2000-01-01',
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT now()
);