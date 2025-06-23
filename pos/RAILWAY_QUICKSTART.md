# 🚂 Railway Quick Deploy Guide

## ⚡ One-Click Deploy

1. **Fork this repository** or push to your GitHub

2. **Deploy to Railway:**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

3. **Add PostgreSQL Database:**
   - In your project, click "Add Service" → "Database" → "PostgreSQL"
   - Railway will automatically set `DATABASE_URL`

4. **Configure Service Settings:**
   ```
   Service Name: pos-crm-backend
   Build Command: cd apps/backend && npm install && npx prisma generate && npm run build
   Start Command: node dist/main.js
   Root Directory: .
   ```

5. **Set Environment Variables:**
   ```
   NODE_ENV=production
   PORT=3001
   JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
   JWT_EXPIRES_IN=7d
   ```

6. **Deploy & Migrate:**
   After successful deploy, run in Railway Console:
   ```bash
   npx prisma migrate deploy
   npm run db:seed
   ```

## 🔗 Your API will be available at:
- **API:** `https://pos-crm-backend-production.up.railway.app/api`
- **Docs:** `https://pos-crm-backend-production.up.railway.app/api/docs`
- **Health:** `https://pos-crm-backend-production.up.railway.app/api`

## 🎯 Test Endpoints:
```bash
# Health check
curl https://your-domain.railway.app/api

# Ping
curl https://your-domain.railway.app/api/ping

# API documentation
open https://your-domain.railway.app/api/docs
```

## ⚙️ Post-Deploy Checklist:
- [ ] Database migrations applied
- [ ] Seed data loaded  
- [ ] Health check returns 200
- [ ] Swagger docs accessible
- [ ] Frontend CORS configured
- [ ] Environment variables set

---
📖 **Detailed instructions:** See `DEPLOY.md` 