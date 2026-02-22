# Image Analyzer Full Stack App

## Local Development

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

The backend runs on http://localhost:8000 and frontend on http://localhost:5173

## Deployment

### Backend (Render)
1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New +" → "Web Service"
4. Connect your repository
5. Configure:
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add your `model.h5` file to the backend directory before deploying
7. Deploy and copy the service URL

### Frontend (Vercel)
1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New" → "Project"
4. Import your repository
5. Configure:
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add Environment Variable:
   - Name: `VITE_API_URL`
   - Value: Your Render backend URL (e.g., `https://your-app.onrender.com`)
7. Deploy

### Important Notes
- Update CORS origins in `backend/main.py` with your Vercel domain for production
- Place your trained `model.h5` file in the backend directory
- The model file should be committed or uploaded separately to Render

