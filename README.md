# ENGICONVERT

This project includes a static frontend and a Node.js + Express backend with SQLite history storage.

## Run locally

```bash
cd backend
npm install
npm start
```

Then open:

- http://localhost:3000/
- http://localhost:3000/api/health

## Deploy to Google Cloud Run

1. Log in to Google Cloud:

```bash
gcloud auth login
```

2. Set your project:

```bash
gcloud config set project YOUR_PROJECT_ID
```

3. Build and deploy the container:

```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/engiconvert .
gcloud run deploy engiconvert --image gcr.io/YOUR_PROJECT_ID/engiconvert --platform managed --region us-central1 --allow-unauthenticated
```

The app will be available at the URL returned by Cloud Run.

## Notes

- The backend listens on `PORT` from the environment; Cloud Run supplies this automatically.
- The frontend is served by Express from the project root.
- Conversion history is stored in SQLite in `backend/data.db`.
