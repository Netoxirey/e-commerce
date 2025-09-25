# Separate Deployment Guide

This guide explains how to deploy the frontend on Vercel and the backend on Render.

## 🚀 Frontend Deployment (Vercel)

### 1. Prepare Frontend for Vercel

1. **Navigate to the client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Test locally:**
   ```bash
   npm run dev
   ```

### 2. Deploy to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from client directory:**
   ```bash
   cd client
   vercel
   ```

4. **Set Environment Variables in Vercel Dashboard:**
   - Go to your project settings
   - Add environment variable:
     - `NEXT_PUBLIC_API_URL` = `https://your-render-app.onrender.com/api/v1`

### 3. Alternative: Deploy via GitHub

1. **Push your code to GitHub**
2. **Connect Vercel to your GitHub repository**
3. **Set the root directory to `client`**
4. **Add environment variables in Vercel dashboard**

## 🔧 Backend Deployment (Render)

### 1. Prepare Backend for Render

1. **Create a render.yaml file in the root directory:**
   ```yaml
   services:
     - type: web
       name: ecommerce-backend
       env: node
       plan: free
       buildCommand: cd server && npm install && npm run build
       startCommand: cd server && npm run start:prod
       envVars:
         - key: NODE_ENV
           value: production
         - key: DATABASE_URL
           fromDatabase:
             name: your-database-name
             property: connectionString
         - key: REDIS_URL
           fromService:
             type: redis
             name: your-redis-name
             property: connectionString
         - key: JWT_SECRET
           generateValue: true
         - key: JWT_REFRESH_SECRET
           generateValue: true
         - key: CORS_ORIGIN
           value: https://your-vercel-app.vercel.app
         - key: FRONTEND_URL
           value: https://your-vercel-app.vercel.app
   ```

### 2. Deploy to Render

1. **Connect your GitHub repository to Render**
2. **Create a new Web Service**
3. **Set the following:**
   - **Root Directory:** `server`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start:prod`
   - **Environment:** `Node`

### 3. Set Environment Variables in Render

Add these environment variables in Render dashboard:

```
NODE_ENV=production
DATABASE_URL=your-database-connection-string
REDIS_URL=your-redis-connection-string
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=https://your-vercel-app.vercel.app
FRONTEND_URL=https://your-vercel-app.vercel.app
API_PREFIX=api/v1
```

## 🔄 Update Frontend API URL

After deploying the backend to Render, update the frontend environment variable:

1. **In Vercel Dashboard:**
   - Go to your project settings
   - Update `NEXT_PUBLIC_API_URL` to your Render backend URL
   - Example: `https://your-render-app.onrender.com/api/v1`

2. **Redeploy the frontend** (Vercel will automatically redeploy)

## 🧪 Testing the Deployment

1. **Test Backend API:**
   ```bash
   curl https://your-render-app.onrender.com/api/v1/health
   ```

2. **Test Frontend:**
   - Visit your Vercel URL
   - Check that API calls work correctly

## 📝 Environment Variables Summary

### Frontend (Vercel)
- `NEXT_PUBLIC_API_URL` - Your Render backend URL

### Backend (Render)
- `NODE_ENV` - production
- `DATABASE_URL` - Your database connection string
- `REDIS_URL` - Your Redis connection string
- `JWT_SECRET` - Your JWT secret key
- `JWT_REFRESH_SECRET` - Your refresh token secret
- `CORS_ORIGIN` - Your Vercel frontend URL
- `FRONTEND_URL` - Your Vercel frontend URL

## 🚨 Important Notes

1. **CORS Configuration:** The backend is configured to allow Vercel domains
2. **HTTPS Required:** Both services use HTTPS in production
3. **Environment Variables:** Make sure all required variables are set
4. **Database:** Use external database services (not included in deployment)
5. **Redis:** Use external Redis services (not included in deployment)

## 🔧 Local Development

For local development, you can still use Docker for the backend:

```bash
# Start only the backend
docker-compose up backend
```

And run the frontend locally:

```bash
cd client
npm run dev
```

Make sure to set `NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1` in your local environment.
