# Render Deployment Notes for StudyStack Backend

## Root Directory
- Set Render root directory to: `Backend/StudyStack`

## Build Command
- `npm install`

## Start Command
- `npm start`

## Environment Variables
Add the following in Render service settings:
- `DATABASE` = your MongoDB Atlas connection string
- `JWT_SECRET` = your auth secret
- `PORT` = `5000` (optional)
- `FRONTEND_URL` = your frontend URL if you want CORS restricted

## MongoDB Atlas
- Ensure Atlas IP access list includes Render outbound IPs.
- For quick testing, add `0.0.0.0/0` temporarily.

## Notes
- The backend currently uses `process.env.DATABASE` and `process.env.JWT_SECRET`.
- The frontend uses `VITE_API_URL` for API base URL.
