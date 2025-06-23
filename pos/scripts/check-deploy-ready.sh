#!/bin/bash

echo "🔍 Checking deployment readiness for Railway..."

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 exists"
        return 0
    else
        echo -e "${RED}✗${NC} $1 missing"
        return 1
    fi
}

# Function to check if directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 directory exists"
        return 0
    else
        echo -e "${RED}✗${NC} $1 directory missing"
        return 1
    fi
}

# Counter for failed checks
failed_checks=0

echo -e "\n📁 Checking required files..."

# Check Railway configuration files
check_file "railway.json" || ((failed_checks++))
check_file "nixpacks.toml" || ((failed_checks++))

# Check backend files
check_file "apps/backend/package.json" || ((failed_checks++))
check_file "apps/backend/prisma/schema.prisma" || ((failed_checks++))
check_file "apps/backend/src/main.ts" || ((failed_checks++))
check_file "apps/backend/src/app.module.ts" || ((failed_checks++))
check_file "apps/backend/src/app.controller.ts" || ((failed_checks++))

# Check migration files
check_dir "apps/backend/prisma/migrations" || ((failed_checks++))
check_file "apps/backend/prisma/migrations/migration_lock.toml" || ((failed_checks++))
check_file "apps/backend/prisma/seed-permissions.ts" || ((failed_checks++))

echo -e "\n📦 Checking package.json scripts..."

if [ -f "apps/backend/package.json" ]; then
    # Check for required scripts
    if grep -q '"build"' apps/backend/package.json; then
        echo -e "${GREEN}✓${NC} build script found"
    else
        echo -e "${RED}✗${NC} build script missing"
        ((failed_checks++))
    fi
    
    if grep -q '"start:prod"' apps/backend/package.json; then
        echo -e "${GREEN}✓${NC} start:prod script found"
    else
        echo -e "${YELLOW}⚠${NC} start:prod script not found (optional)"
    fi
    
    if grep -q '"db:migrate"' apps/backend/package.json; then
        echo -e "${GREEN}✓${NC} db:migrate script found"
    else
        echo -e "${RED}✗${NC} db:migrate script missing"
        ((failed_checks++))
    fi
    
    if grep -q '"db:seed"' apps/backend/package.json; then
        echo -e "${GREEN}✓${NC} db:seed script found"
    else
        echo -e "${RED}✗${NC} db:seed script missing"
        ((failed_checks++))
    fi
fi

echo -e "\n🔧 Checking environment configuration..."

# Check if JWT_SECRET is mentioned in code
if grep -r "JWT_SECRET" apps/backend/src/ > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} JWT_SECRET is used in code"
else
    echo -e "${YELLOW}⚠${NC} JWT_SECRET not found in code"
fi

# Check if DATABASE_URL is used
if grep -r "DATABASE_URL" apps/backend/ > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} DATABASE_URL is configured"
else
    echo -e "${RED}✗${NC} DATABASE_URL not configured"
    ((failed_checks++))
fi

echo -e "\n🗄️ Checking Prisma configuration..."

if [ -f "apps/backend/prisma/schema.prisma" ]; then
    if grep -q "postgresql" apps/backend/prisma/schema.prisma; then
        echo -e "${GREEN}✓${NC} PostgreSQL provider configured"
    else
        echo -e "${RED}✗${NC} PostgreSQL provider not configured"
        ((failed_checks++))
    fi
fi

echo -e "\n📋 Deployment Summary:"
echo "================================"

if [ $failed_checks -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed! Project is ready for Railway deployment.${NC}"
    echo ""
    echo -e "${GREEN}Next steps:${NC}"
    echo "1. Commit and push your code to GitHub"
    echo "2. Go to railway.app and create a new project"
    echo "3. Connect your GitHub repository"
    echo "4. Add PostgreSQL database service"
    echo "5. Configure environment variables"
    echo "6. Deploy!"
    echo ""
    echo -e "${YELLOW}Don't forget to set these environment variables:${NC}"
    echo "- NODE_ENV=production"
    echo "- PORT=3001"
    echo "- JWT_SECRET=your-super-secret-key-min-32-chars"
    echo "- JWT_EXPIRES_IN=7d"
    echo "- FRONTEND_URL=https://your-frontend-domain.com"
    exit 0
else
    echo -e "${RED}❌ $failed_checks check(s) failed. Please fix the issues above before deploying.${NC}"
    exit 1
fi 