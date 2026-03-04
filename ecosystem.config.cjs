module.exports = {
  apps: [
    {
      name: "wechat-offwork-stats-api",
      script: "dist-server/server/index.js",
      cwd: "/var/www/wechat-offwork-stats",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
        PORT: 8787,
        DB_HOST: "127.0.0.1",
        DB_PORT: 3306,
        DB_USER: "offwork_app",
        DB_PASSWORD: "StrongAppPass@2026",
        DB_NAME: "offwork_stats"
      }
    }
  ]
};
