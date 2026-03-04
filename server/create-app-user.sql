CREATE USER IF NOT EXISTS 'offwork_app'@'localhost' IDENTIFIED BY 'StrongAppPass@2026';
GRANT ALL PRIVILEGES ON offwork_stats.* TO 'offwork_app'@'localhost';

CREATE USER IF NOT EXISTS 'offwork_app'@'127.0.0.1' IDENTIFIED BY 'StrongAppPass@2026';
GRANT ALL PRIVILEGES ON offwork_stats.* TO 'offwork_app'@'127.0.0.1';

FLUSH PRIVILEGES;
