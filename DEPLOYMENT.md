# Deployment Guide

## Prerequisites
- GitHub account
- Render account (for backend)
- Vercel account (for frontend)
- Trained model file (`model.h5`)

## Step 1: Prepare Repository
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

## Step 2: Deploy Backend to Render

1. Go to https://dashboard.render.com/
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: image-analyzer-api
   - **Root Directory**: `backend`
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

5. Add Environment Variables:
   - `PYTHON_VERSION`: 3.11.0
   - `MODEL_PATH`: model.h5
   - `ALLOWED_ORIGINS`: (leave empty for now, will update after frontend deployment)

6. Upload your `model.h5` file:
   - After deployment, go to Shell tab
   - Upload the model file to the root directory

7. Click "Create Web Service"
8. Copy the service URL (e.g., `https://image-analyzer-api.onrender.com`)

## Step 3: Deploy Frontend to Vercel

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variable:
   - **Name**: `VITE_API_URL`
   - **Value**: Your Render backend URL (from Step 2)

6. Click "Deploy"
7. Copy your Vercel deployment URL (e.g., `https://your-app.vercel.app`)

## Step 4: Update CORS Settings

1. Go back to Render dashboard
2. Navigate to your backend service
3. Update the `ALLOWED_ORIGINS` environment variable:
   - Value: `https://your-app.vercel.app,http://localhost:5173`
4. Save and redeploy

## Step 5: Test Your Deployment

1. Visit your Vercel URL
2. Upload an image
3. Verify the analysis works

## Troubleshooting

### Backend Issues
- Check logs in Render dashboard
- Verify model file is uploaded
- Test health endpoint: `https://your-backend.onrender.com/health`

### Frontend Issues
- Check browser console for errors
- Verify `VITE_API_URL` is set correctly in Vercel
- Check CORS settings in backend

### Model Not Loading
- Ensure `model.h5` is in the backend root directory
- Check file permissions
- Verify TensorFlow version compatibility

## Local Testing Before Deployment

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Updating Your Deployment

### Backend Updates
- Push changes to GitHub
- Render will auto-deploy (if enabled)
- Or manually trigger deploy from dashboard

### Frontend Updates
- Push changes to GitHub
- Vercel will auto-deploy
- Or manually trigger deploy from dashboard

## Cost Considerations

- **Render Free Tier**: 750 hours/month, spins down after inactivity
- **Vercel Free Tier**: Unlimited deployments, bandwidth limits apply
- Consider upgrading for production workloads
