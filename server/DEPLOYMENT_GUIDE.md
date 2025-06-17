# Vercel Deployment Guide for Blog App Server

## Issues Fixed:

1. **Database Connection**: Fixed connection pooling for serverless functions
2. **Environment Variables**: Added validation for required variables
3. **Error Handling**: Improved error handling for production
4. **CORS Configuration**: Refined CORS settings for Vercel
5. **Vercel Configuration**: Updated vercel.json for better compatibility

## Required Environment Variables in Vercel:

Set these in your Vercel dashboard (Project Settings > Environment Variables):

### Essential Variables:
- `MONGODB_URI` - Your MongoDB connection string
- `NODE_ENV` - Set to "production"
- `CLIENT_URL` - Your frontend URL (e.g., https://your-app.vercel.app)

### Authentication (if using JWT):
- `JWT_SECRET` - A secure random string for JWT signing
- `JWT_EXPIRES_IN` - Token expiration time (e.g., "7d")

### Cloudinary (for image uploads):
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### Email (if using nodemailer):
- `EMAIL_USER`
- `EMAIL_PASS`

### Optional:
- `PRODUCTION_DOMAINS` - Comma-separated list of allowed domains

## Common Vercel Deployment Issues and Solutions:

### 1. Function Timeout
- Vercel has a 10s timeout on Hobby plan, 30s on Pro
- Current config sets maxDuration to 30s

### 2. Cold Starts
- Database connections are now optimized for serverless
- Connection pooling is properly handled

### 3. CORS Issues
- Updated CORS configuration to handle Vercel's serverless environment
- Added proper origin handling for production

### 4. Environment Variables
- Added validation to catch missing variables early
- Proper error handling in serverless environment

## Deployment Steps:

1. **Push to GitHub**: Make sure all changes are committed and pushed

2. **Connect to Vercel**:
   - Go to vercel.com
   - Import your GitHub repository
   - Select the `server` folder as the root directory

3. **Set Environment Variables**:
   - In Vercel dashboard, go to Project Settings > Environment Variables
   - Add all required variables listed above

4. **Deploy**:
   - Vercel will automatically deploy
   - Check the deployment logs for any errors

## Testing Your Deployment:

1. Visit `https://your-project.vercel.app/health` - Should return status info
2. Test API endpoints: `https://your-project.vercel.app/api/auth/...`
3. Check Vercel function logs for any errors

## Common Error Solutions:

### "Module not found" errors:
- Ensure all imports use `.js` extensions (already done)
- Check that all files are committed to Git

### Database connection errors:
- Verify MONGODB_URI is correctly set in Vercel
- Check MongoDB Atlas allows connections from all IPs (0.0.0.0/0)

### CORS errors:
- Update CLIENT_URL to match your frontend domain
- Add additional domains to PRODUCTION_DOMAINS if needed

### Function timeout:
- Check for long-running operations
- Optimize database queries
- Consider upgrading to Vercel Pro for longer timeouts

## File Structure Verification:
Your server should be structured as:
```
server/
├── server.js (main entry point)
├── vercel.json (deployment config)
├── package.json
└── src/
    ├── config/
    ├── controllers/
    ├── models/
    ├── routes/
    └── utils/
```

## Next Steps After Deployment:
1. Update your frontend's API base URL to point to your Vercel deployment
2. Test all functionality end-to-end
3. Monitor Vercel function logs for any issues
4. Set up proper error monitoring (optional)
