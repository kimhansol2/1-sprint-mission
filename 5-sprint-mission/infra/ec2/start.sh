sudo npm install -g pm2
pm2 -v
pm2 start "npm run dev" --name mission-app
pm2 list
pm2 startup
pm2 save