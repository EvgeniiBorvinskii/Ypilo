server {
    listen 80;
    server_name videodownload.ypilo.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name videodownload.ypilo.com;

    ssl_certificate /etc/letsencrypt/live/videodownload.ypilo.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/videodownload.ypilo.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/javascript application/xml+rss application/json;

    location / {
        proxy_pass http://localhost:8090;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/ {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 1800s;
        proxy_connect_timeout 1800s;
        proxy_send_timeout 1800s;
    }

    location /socket.io/ {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /download-file/ {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_buffering off;
        proxy_read_timeout 1800s;
        client_max_body_size 2G;
        proxy_max_temp_file_size 0;
    }

    location = /robots.txt {
        proxy_pass http://localhost:8090/robots.txt;
    }

    location = /sitemap.xml {
        proxy_pass http://localhost:8090/sitemap.xml;
    }

    access_log /var/log/nginx/videodownload.ypilo.com.access.log;
    error_log /var/log/nginx/videodownload.ypilo.com.error.log;
}
