# Raksha AI Deployment Setup

## Database Setup Commands

After setting up your .env.local file with the correct DATABASE_URL:

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with sample data
npm run db:seed
```

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Testing

```bash
# Run tests
npm test

# Build for production
npm run build
```

## Deployment Options

### Option 1: Vercel (Recommended)

1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Option 2: Manual Deployment

1. Build the application: `npm run build`
2. Start production server: `npm start`
3. Deploy to your preferred hosting service

## Environment Variables for Production

Set these in your hosting platform:

- DATABASE_URL
- NEXTAUTH_SECRET (generate a secure random string)
- NEXTAUTH_URL (your production domain)
- ADMIN_USER
- ADMIN_PASS
- TWILIO_* (optional for bot functionality)
