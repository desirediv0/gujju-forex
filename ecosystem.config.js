module.exports = {
    apps: [
        {
            name: "gujju-forex",
            cwd: "/root/gujju-forex",
            script: "npm",
            args: "start",
            env: {
                NODE_ENV: "production",
                PORT: 7018
            },
            instances: 1,
            exec_mode: "fork",
            autorestart: true,
            watch: false,
            max_memory_restart: "800M",
            error_file: "/root/.pm2/logs/gujju-forex-error.log",
            out_file: "/root/.pm2/logs/gujju-forex-out.log",
            log_date_format: "DD/MM/YYYY HH:mm:ss"
        }
    ]
};