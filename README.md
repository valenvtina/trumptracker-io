# Trump Tracker

Track and analyze Trump's Agenda 47 promises with AI-powered insights.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

## Deployment

The app is automatically deployed to Netlify when changes are pushed to the main branch. The deployment process is handled by GitHub Actions.

### Required Secrets

Set these secrets in your GitHub repository:

- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID`
- `VITE_OPENAI_API_KEY`
- Firebase configuration secrets (see `.env.example`)

## License

MIT