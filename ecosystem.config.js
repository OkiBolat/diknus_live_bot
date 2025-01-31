module.exports = {
  apps: [{
    name: "telegram-livestream-bot",
    script: "livestream_bot.js",
    watch: false,
    max_memory_restart: "1G",
    exp_backoff_restart_delay: 100,
    env: {
      NODE_ENV: "production",
    },
    restart_delay: 10000,
    max_restarts: 5,
    out_file: "logs/out.log",
    error_file: "logs/error.log",
    merge_logs: true,
    time: true
  }]
} 