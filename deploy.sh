# 1) Set variables
export PROJECT_ID="YOUR_GCP_PROJECT"
export REGION="us-central1"

gcloud auth login
gcloud config set project $PROJECT_ID

# 2) Build & deploy backend to Cloud Run
gcloud builds submit --tag gcr.io/$PROJECT_ID/checksync-backend ./backend
gcloud run deploy checksync-backend \
  --image gcr.io/$PROJECT_ID/checksync-backend \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080

# 3) Get backend URL
BACKEND_URL=$(gcloud run services describe checksync-backend --platform managed --region $REGION --format 'value(status.url)')
echo "Backend URL: $BACKEND_URL"

# 4) Build frontend image with the backend URL embedded, push and deploy
docker build --build-arg VITE_API_URL="$BACKEND_URL" -t gcr.io/$PROJECT_ID/checksync-frontend ./frontend
docker push gcr.io/$PROJECT_ID/checksync-frontend

gcloud run deploy checksync-frontend \
  --image gcr.io/$PROJECT_ID/checksync-frontend \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080
