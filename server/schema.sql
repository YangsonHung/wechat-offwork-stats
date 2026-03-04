CREATE TABLE IF NOT EXISTS checkout_entries (
  id VARCHAR(36) PRIMARY KEY,
  stat_date DATE NOT NULL,
  off_work_at VARCHAR(40) NOT NULL,
  off_work_minutes_extended INT NOT NULL,
  submitted_at VARCHAR(40) NOT NULL,
  client_id VARCHAR(64) NOT NULL,
  alias_code VARCHAR(20) NOT NULL,
  ip_hash VARCHAR(64) NOT NULL,
  user_agent_hash VARCHAR(64) NOT NULL,
  source VARCHAR(20) NOT NULL,
  timezone VARCHAR(32) NOT NULL,
  KEY idx_stat_date (stat_date),
  KEY idx_client_stat_date (client_id, stat_date),
  KEY idx_submitted_at (submitted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
