# AWS EC2 Deployment Guide for EventNexus

## Prerequisites
- AWS Account
- EC2 instance (Ubuntu 20.04 or higher recommended)
- Domain name (optional)

## Step 1: Launch EC2 Instance

1. Login to AWS Console
2. Navigate to EC2 Dashboard
3. Click "Launch Instance"
4. Choose Ubuntu Server 20.04 LTS
5. Select instance type (t2.medium recommended)
6. Configure security group:
   - SSH (22) - Your IP
   - HTTP (80) - Anywhere
   - HTTPS (443) - Anywhere
   - Custom TCP (5000) - Anywhere (Backend API)
   - Custom TCP (5173) - Anywhere (Frontend - optional for dev)
7. Create/select key pair
8. Launch instance

## Step 2: Connect to EC2 Instance

```bash
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

## Step 3: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Git
sudo apt install -y git

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Nginx (optional - for reverse proxy)
sudo apt install -y nginx
```

## Step 4: Clone and Setup Application

```bash
# Clone repository (or upload files)
cd /home/ubuntu
git clone <your-repo-url> eventnexus
# OR upload files using SCP

cd eventnexus
```

## Step 5: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
nano .env
```

Add production environment variables:
```
PORT=5000
NODE_ENV=production
SUPABASE_URL=https://brnbwnukmnktfrgwiddc.supabase.co
SUPABASE_ANON_KEY=your_actual_key
JWT_SECRET=your_production_secret_key
FRONTEND_URL=http://your-ec2-ip:5173
```

```bash
# Start backend with PM2
pm2 start server.js --name eventnexus-backend
pm2 save
pm2 startup
```

## Step 6: Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
nano .env
```

Add:
```
VITE_API_URL=http://your-ec2-ip:5000/api
```

```bash
# Build for production
npm run build

# Serve with PM2 (using serve package)
npm install -g serve
pm2 start "serve -s dist -l 5173" --name eventnexus-frontend
pm2 save
```

## Step 7: Configure Nginx (Optional - Recommended)

```bash
sudo nano /etc/nginx/sites-available/eventnexus
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/eventnexus /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 8: Setup SSL (Optional - Recommended)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

## Step 9: Verify Deployment

1. Access frontend: http://your-ec2-ip or http://your-domain.com
2. Test login and registration
3. Check PM2 status: `pm2 status`
4. View logs: `pm2 logs`

## Maintenance Commands

```bash
# View application status
pm2 status

# View logs
pm2 logs eventnexus-backend
pm2 logs eventnexus-frontend

# Restart applications
pm2 restart eventnexus-backend
pm2 restart eventnexus-frontend

# Stop applications
pm2 stop all

# Update application
cd /home/ubuntu/eventnexus
git pull
cd backend && npm install && pm2 restart eventnexus-backend
cd ../frontend && npm install && npm run build && pm2 restart eventnexus-frontend
```

## Security Best Practices

1. Change default admin password
2. Use strong JWT_SECRET
3. Enable firewall: `sudo ufw enable`
4. Keep system updated: `sudo apt update && sudo apt upgrade`
5. Use environment variables for sensitive data
6. Enable HTTPS with SSL certificate
7. Restrict SSH access to specific IPs
8. Regular backups of Supabase database

## Troubleshooting

### Application not accessible
- Check security group rules
- Verify PM2 status: `pm2 status`
- Check logs: `pm2 logs`

### Database connection issues
- Verify Supabase credentials in .env
- Check network connectivity

### Port conflicts
- Change ports in .env files
- Update Nginx configuration
