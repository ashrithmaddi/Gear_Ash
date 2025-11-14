# Environment Setup Guide for Gearup4

## 📁 Files Created

### Backend
- `env.example` - Template for backend environment variables
- `railway.json` - Railway deployment configuration
- Updated `server.js` - Enhanced CORS configuration

### Frontend
- `env.example` - Template for frontend environment variables
- `env.production` - Production environment template
- `vercel.json` - Vercel deployment configuration

### Deployment
- `DEPLOYMENT_GUIDE.md` - Complete deployment instructions
- `deploy.sh` - Automated deployment script

## 🔧 Environment Variables Required

### Backend (.env)
```bash
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/gearup4

# JWT Configuration
JWT_SECRET=your_strong_jwt_secret_key_here

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret_key

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# AWS S3 Configuration (alternative to Cloudinary)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET=your_s3_bucket_name

# CORS Configuration
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

### Frontend (.env)
```bash
# Environment
VITE_NODE_ENV=production

# API Configuration
VITE_API_BASE_URL=https://your-railway-app.railway.app

# App Configuration
VITE_APP_NAME=Gearup4

# Payment Configuration
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend
cp env.example .env
# Edit .env with your production values
```

### 2. Frontend Setup
```bash
cd frontend
cp env.example .env
# Edit .env with your production values
```

### 3. Deploy Backend to Railway
```bash
cd backend
railway login
railway init
railway up
```

### 4. Deploy Frontend to Vercel
```bash
cd frontend
vercel login
vercel --prod
```

## 📋 Important Notes

1. **Never commit `.env` files** - Add them to `.gitignore`
2. **Update CORS_ORIGIN** in backend after getting Vercel domain
3. **Use HTTPS URLs** in production
4. **Test thoroughly** after deployment
5. **Monitor logs** in both platforms

## 🔗 Next Steps

1. Read `DEPLOYMENT_GUIDE.md` for detailed instructions
2. Set up MongoDB Atlas for production database
3. Configure Razorpay for payments
4. Set up Cloudinary or AWS S3 for image storage
5. Deploy using the provided scripts or manual steps

## 🆘 Need Help?

- Check the `DEPLOYMENT_GUIDE.md` for troubleshooting
- Monitor logs in Railway and Vercel dashboards
- Ensure all environment variables are properly set
- Verify CORS configuration allows your domains 