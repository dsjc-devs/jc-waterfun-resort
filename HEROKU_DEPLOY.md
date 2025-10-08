Heroku deployment notes (PowerShell)

1. Create Heroku app (if you don't have one):

   # Log in (interactive)

   heroku login -i

   # Create app

   heroku create your-app-name

2. Set required config vars (replace values):

   # Example: set API version, project name, DB URI and secrets

   heroku config:set API_VERSION=v1 PROJECT_NAME="JC Waterfun Resort" MONGO_URI="your_mongo_uri" JWT_SECRET="your_jwt_secret"

   # Optional service keys

   heroku config:set PAYMONGO_SECRET_KEY="..." CLOUDINARY_CLOUD_NAME="..." CLOUDINARY_API_KEY="..." CLOUDINARY_API_SECRET="..." MAIL_CONFIGS_EMAIL="..." MAIL_CONFIGS_PASSWORD="..." SEMAPHORE_API_KEY="..." CLIENT_URL="https://your-domain.com"

3. Deploy (git push to Heroku):

   git push heroku main

   # Or use GitHub integration in Heroku dashboard.

4. Watch logs:

   heroku logs --tail

5. Smoke checks (replace app name):

   # API base

   Invoke-RestMethod -Uri "https://your-app-name.herokuapp.com/api/v1" -Method GET

   # Health

   Invoke-RestMethod -Uri "https://your-app-name.herokuapp.com/health" -Method GET

   # Client (open in browser):

   https://your-app-name.herokuapp.com

Notes:

- Root `heroku-postbuild` builds the client into `client/dist` and installs server deps. The `Procfile` runs `npm start --prefix server`.
- I recommend pinning Node in `package.json` (done) to ensure ESM support and consistent runtime on Heroku.
