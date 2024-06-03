# times_dust_frontend

设置nginx转发
        location /times_dust {
                proxy_pass http://localhost:3000;  # 将请求转发到Node.js应用程序的端口
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
        }

确认前端代码路径前缀
constants.js: const MY_PREFIX_PATH = `/times_dust`

确认后端代码路径前缀
constants.js: const MY_API_PREFIX_PATH = `/times_dust_api`

启动前端
node times_dust_frontend.js