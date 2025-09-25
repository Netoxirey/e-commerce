# 🚀 Deployment Guide

This guide covers secure deployment of the e-commerce application using Docker Compose.

## 🔒 Security First

**⚠️ IMPORTANT**: Never commit sensitive environment variables to version control!

## 📋 Prerequisites

- Docker and Docker Compose installed
- Domain name (for production)
- SSL certificate (for production)
- Strong passwords and secrets

## 🛠️ Environment Setup

### 1. Create Environment Files

```bash
# For production
cp env.production.example .env.production

# For development
cp env.development.example .env.development
```

### 2. Configure Production Environment

Edit `.env.production` with your actual values:

```bash
# Required - Database (External Database Service)
DATABASE_URL=postgresql://username:password@your-database-host:5432/ecommerce_prod

# Required - Redis (External Redis Service)
REDIS_URL=redis://username:password@your-redis-host:6379

# Required - JWT Secrets (Generate strong secrets!)
JWT_SECRET=your_super_secure_jwt_secret_here_minimum_32_characters
JWT_REFRESH_SECRET=your_super_secure_refresh_secret_here_minimum_32_characters

# Required - Domain
CORS_ORIGIN=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://yourdomain.com/api/v1

# Optional - Email
SMTP_HOST=smtp.your-provider.com
SMTP_USER=your-email@yourdomain.com
SMTP_PASS=your_email_password

# Optional - Payments
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
```

### 3. Generate Secure Secrets

```bash
# Generate JWT secrets (32+ characters)
openssl rand -base64 32
openssl rand -base64 32

# Generate database password
openssl rand -base64 16
```

## 🐳 Docker Deployment

### Development

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml --env-file .env.development up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop development environment
docker-compose -f docker-compose.dev.yml down
```

### Production

```bash
# Start production environment
docker-compose --env-file .env.production up -d

# View logs
docker-compose logs -f

# Stop production environment
docker-compose down
```

## 🌐 Production Deployment Steps

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Clone Repository

```bash
git clone <your-repo-url>
cd e-commerce
```

### 3. Configure Environment

```bash
# Copy and edit production environment
cp env.production.example .env.production
nano .env.production
```

### 4. Deploy Application

```bash
# Build and start services
docker-compose --env-file .env.production up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f app
```

### 5. Set Up Reverse Proxy (Nginx)

Create `/etc/nginx/sites-available/ecommerce`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Proxy to application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/ecommerce /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🔧 Maintenance

### Database Backups

Since you're using an external database service, use your database provider's backup tools:

```bash
# For PostgreSQL (if using psql directly)
pg_dump -h your-database-host -U username -d ecommerce_prod > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
psql -h your-database-host -U username -d ecommerce_prod < backup_file.sql

# For cloud providers (AWS RDS, Google Cloud SQL, etc.)
# Use their respective backup and restore tools
```

### Application Updates

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose --env-file .env.production up -d --build

# Clean up old images
docker system prune -f
```

### Log Management

```bash
# View application logs
docker-compose logs -f app

# View database logs
docker-compose logs -f postgres

# View all logs
docker-compose logs -f
```

## 🔍 Monitoring

### Health Checks

```bash
# Check application health
curl http://localhost:3000/api/v1/health

# Check database connection (external database)
pg_isready -h your-database-host -p 5432 -U username

# Check Redis connection (external Redis)
redis-cli -h your-redis-host -p 6379 ping
```

### Resource Usage

```bash
# View container stats
docker stats

# View disk usage
docker system df
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check database logs
   docker-compose logs postgres
   
   # Restart database
   docker-compose restart postgres
   ```

2. **Application Won't Start**
   ```bash
   # Check application logs
   docker-compose logs app
   
   # Check environment variables
   docker-compose config
   ```

3. **Port Already in Use**
   ```bash
   # Check what's using the port
   sudo netstat -tulpn | grep :3000
   
   # Kill the process
   sudo kill -9 <PID>
   ```

### Logs Location

- Application logs: `docker-compose logs app`
- Database logs: `docker-compose logs postgres`
- Redis logs: `docker-compose logs redis`

## 🔐 Security Checklist

- [ ] Strong database passwords
- [ ] Secure JWT secrets (32+ characters)
- [ ] HTTPS enabled with valid SSL certificate
- [ ] Firewall configured (only ports 80, 443, 22)
- [ ] Regular security updates
- [ ] Database backups configured
- [ ] Environment variables secured
- [ ] No sensitive data in logs
- [ ] CORS properly configured
- [ ] Rate limiting enabled (if needed)

## 📞 Support

If you encounter issues:

1. Check the logs: `docker-compose logs -f`
2. Verify environment variables: `docker-compose config`
3. Check container status: `docker-compose ps`
4. Review this guide and the main README.md

---

**Happy deploying! 🚀**
