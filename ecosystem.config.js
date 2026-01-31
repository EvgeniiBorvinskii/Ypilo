module.exports = {
  apps: [{
    name: 'ypilo',
    cwd: '/srv/COMPANY',
    script: 'npm',
    args: 'start',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env_file: '/srv/COMPANY/.env.local',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/ypilo-error.log',
    out_file: '/var/log/pm2/ypilo-out.log',
    log_file: '/var/log/pm2/ypilo-combined.log',
    time: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    combine_logs: true
  }]
}