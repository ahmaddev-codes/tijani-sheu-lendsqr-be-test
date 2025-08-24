# Heroku Deployment Guide

## Prerequisites

1. **Install Heroku CLI**: Download from https://devcenter.heroku.com/articles/heroku-cli
2. **Git**: Make sure your project is in a Git repository
3. **Heroku Account**: Sign up at https://heroku.com

## Step-by-Step Deployment

### 1. Login to Heroku

```bash
heroku login
```

### 2. Create a Heroku App

```bash
heroku create your-app-name
```

### 3. Add ClearDB MySQL Add-on

```bash
heroku addons:create cleardb:ignite
```

### 4. Get Database URL

```bash
heroku config:get CLEARDB_DATABASE_URL
```

This will show something like: `mysql://username:password@hostname/database_name?reconnect=true`

### 5. Set Environment Variables

```bash
# Set Node environment
heroku config:set NODE_ENV=production

# Set Adjutor Karma API URL
heroku config:set ADJUTOR_KARMA_URL=https://adjutor.lendsqr.com/v2/verification/karma

# If you have an API key for Adjutor
heroku config:set ADJUTOR_API_KEY=your_actual_api_key
```

### 6. Deploy Your Code

```bash
# Make sure all changes are committed
git add .
git commit -m "Prepare for Heroku deployment"

# Deploy to Heroku
git push heroku main
```

### 7. Run Database Migrations

```bash
# You'll need to run your SQL migrations on Heroku
# Option 1: Use Heroku's MySQL console
heroku addons:open cleardb

# Option 2: Connect directly and run migrations.sql
# Get database credentials first:
heroku config
# Then connect using your preferred MySQL client
```

### 8. Open Your App

```bash
heroku open
```

## Important Notes

- **Database**: The app is configured to automatically use `CLEARDB_DATABASE_URL` when available
- **Port**: Heroku automatically sets the `PORT` environment variable
- **Logs**: View logs with `heroku logs --tail`
- **Scale**: The app starts with 1 dyno, scale with `heroku ps:scale web=1`

## Post-Deployment

1. Test all endpoints:

   - `POST /api/users` - Create user
   - `POST /api/wallet/fund` - Fund wallet
   - `POST /api/wallet/transfer` - Transfer funds
   - `POST /api/wallet/withdraw` - Withdraw funds

2. Monitor with:
   ```bash
   heroku logs --tail
   heroku ps
   ```

## Troubleshooting

- **Build Fails**: Check `heroku logs --tail` for errors
- **Database Connection**: Verify `CLEARDB_DATABASE_URL` is set
- **App Crashes**: Check if all environment variables are set
- **Port Issues**: Heroku automatically sets PORT, don't override it

Your app URL will be: `https://your-app-name.herokuapp.com`
