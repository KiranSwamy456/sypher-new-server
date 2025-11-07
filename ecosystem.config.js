module.exports = {
  apps: [{
    name: 'sypher-app',
    script: 'yarn',
    args: 'start',
    cwd: '/var/www/html',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
