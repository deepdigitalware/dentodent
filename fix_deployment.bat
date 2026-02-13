@echo off
echo Fixing Dent O Dent Backend Deployment
echo ======================================

echo Stopping existing processes...
plink -ssh -P 22 -l root -pw Mou@01170628 31.97.206.179 "pm2 stop dod-api 2>/dev/null || true && pm2 delete dod-api 2>/dev/null || true"

echo Waiting for processes to stop...
timeout /t 3 /nobreak >nul

echo Killing any remaining processes on port 6666...
plink -ssh -P 22 -l root -pw Mou@01170628 31.97.206.179 "kill -9 $(lsof -t -i:6666) 2>/dev/null || true"

echo Starting API on port 6667...
plink -ssh -P 22 -l root -pw Mou@01170628 31.97.206.179 "cd /var/www/dentodent/api && PORT=6667 pm2 start content-management-server.js --name dod-api --watch --log-date-format 'YYYY-MM-DD HH:mm:ss'"

echo Updating Nginx configuration...
plink -ssh -P 22 -l root -pw Mou@01170628 31.97.206.179 "cat > /tmp/dod-api.conf << 'EOF'
upstream dod_api {
    server 127.0.0.1:6667;
}

server {
    listen 80;
    server_name api.dentodentdentalclinic.com;

    location / {
        proxy_pass http://dod_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_buffering off;
    }
    
    location /health {
        access_log off;
        proxy_pass http://dod_api;
    }
}
EOF
"

plink -ssh -P 22 -l root -pw Mou@01170628 31.97.206.179 "sudo mv /tmp/dod-api.conf /etc/nginx/sites-available/dod-api && sudo ln -sf /etc/nginx/sites-available/dod-api /etc/nginx/sites-enabled/ && sudo nginx -t && sudo systemctl reload nginx"

echo Verifying deployment...
plink -ssh -P 22 -l root -pw Mou@01170628 31.97.206.179 "curl -f http://localhost:6667/health"

echo Deployment fix completed!
pause