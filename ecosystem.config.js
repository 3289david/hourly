module.exports = {
  apps: [
    {
      name: "hourly",
      script: ".next/standalone/server.js",
      cwd: "/root/hourly",
      env_file: ".env",
      env: {
        NODE_ENV: "production",
        PORT: "3010",
        HOSTNAME: "127.0.0.1",
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
    },
  ],
};
