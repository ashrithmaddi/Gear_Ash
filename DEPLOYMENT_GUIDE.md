# Deployment Guide for Gearup4

This guide will help you deploy your backend to Railway and frontend to Vercel.

## 🚀 Backend Deployment (Railway)

### Prerequisites
1. Create a Railway account at [railway.app](https://railway.app)
2. Install Railway CLI: `npm install -g @railway/cli`
3. MongoDB Atlas account (for production database)

### Step 1: Prepare Backend
1. Navigate to backend directory: `cd backend`
2. Create a `.env` file based on `env.example`:
   ```bash
   cp env.example .env
   ```
3. Update the `.env` file with your production values:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A strong secret key
   - `RAZORPAY_KEY_ID` & `RAZORPAY_SECRET`: Your Razorpay credentials
   - `CLOUDINARY_*` or `AWS_*`: Your image storage credentials

### Step 2: Deploy to Railway
1. Login to Railway: `railway login`
2. Initialize Railway project: `railway init`
3. Deploy: `railway up`
4. Get your app URL: `railway status`

### Step 3: Set Environment Variables in Railway
1. Go to your Railway dashboard
2. Select your project
3. Go to Variables tab
4. Add all environment variables from your `.env` file

### Step 4: Update CORS
Update your backend CORS configuration to allow your Vercel frontend domain.

## 🌐 Frontend Deployment (Vercel)

### Prerequisites
1. Create a Vercel account at [vercel.com](https://vercel.com)
2. Install Vercel CLI: `npm install -g vercel`

### Step 1: Prepare Frontend
1. Navigate to frontend directory: `cd frontend`
2. Create a `.env` file based on `env.example`:
   ```bash
   cp env.example .env
   ```
3. Update the `.env` file with your production values:
   - `VITE_API_BASE_URL`: Your Railway backend URL

### Step 2: Deploy to Vercel
1. Login to Vercel: `vercel login`
2. Deploy: `vercel --prod`
3. Follow the prompts to configure your project

### Step 3: Set Environment Variables in Vercel
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add all environment variables from your `.env` file

## 🔧 Environment Variables Summary

### Backend (.env)
```bash
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/gearup4
JWT_SECRET=your_strong_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

### Frontend (.env)
```bash
VITE_NODE_ENV=production
VITE_API_BASE_URL=https://your-railway-app.railway.app
VITE_APP_NAME=Gearup4
VITE_RAZORPAY_KEY_ID=your_razorpay_key
```

## 📝 Important Notes

1. **Never commit `.env` files** to version control
2. **Update CORS** in backend to allow your Vercel domain
3. **Use HTTPS** URLs in production
4. **Test thoroughly** after deployment
5. **Monitor logs** in both Railway and Vercel dashboards

## 🚨 Troubleshooting

### Common Issues:
1. **CORS errors**: Ensure backend CORS allows your Vercel domain
2. **Database connection**: Check MongoDB Atlas network access
3. **Environment variables**: Verify all variables are set in both platforms
4. **Build errors**: Check build logs in Vercel dashboard

### Useful Commands:
```bash
# Railway
railway logs
railway status
railway up

# Vercel
vercel logs
vercel --prod
```

## 🔗 Useful Links

- [Railway Documentation](https://docs.railway.app/)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [Razorpay Documentation](https://razorpay.com/docs/) 