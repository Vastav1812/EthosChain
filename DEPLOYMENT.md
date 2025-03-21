# Deployment Guide for EthosChain

This document provides step-by-step instructions for setting up continuous deployment for EthosChain.

## Prerequisites

- A GitHub account
- A Netlify account
- Git installed on your local machine

## GitHub Repository Setup

1. The repository is already set up at: https://github.com/Vastav1812/EthosChain

## Netlify Setup

1. Log in to your Netlify account
2. Click "Add new site" > "Import an existing project"
3. Connect to GitHub and select the EthosChain repository
4. Configure the build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click "Deploy site"

## Setting Up GitHub Secrets for CI/CD

After deploying your site on Netlify, you'll need to add the Netlify authentication token and site ID to your GitHub repository secrets:

1. Get your Netlify authentication token:
   - Go to Netlify user settings (click on your avatar > User settings)
   - Go to Applications > Personal access tokens
   - Create a new personal access token and copy it

2. Get your Netlify site ID:
   - Go to your site settings on Netlify
   - The site ID is in the Site information section

3. Add these as secrets in your GitHub repository:
   - Go to your GitHub repository > Settings > Secrets and variables > Actions
   - Add a new repository secret named `NETLIFY_AUTH_TOKEN` with your Netlify authentication token
   - Add another secret named `NETLIFY_SITE_ID` with your Netlify site ID

## How the CI/CD Pipeline Works

The CI/CD pipeline is defined in `.github/workflows/deploy.yml` and performs the following steps:

1. When code is pushed to the main branch, GitHub Actions automatically triggers the workflow
2. The workflow checks out the code, sets up Node.js, and installs dependencies
3. It builds the frontend application
4. Finally, it deploys the built assets to Netlify

## Manual Deployment

If you need to deploy manually:

1. Build the frontend:
   ```
   cd frontend
   npm run build
   ```

2. Deploy to Netlify using the CLI:
   ```
   netlify deploy --prod
   ```

## Troubleshooting

- **Build failures**: Check the GitHub Actions logs for details on what went wrong.
- **Deployment issues**: Verify that your Netlify secrets are correctly set up in GitHub.
- **Frontend not updating**: Make sure your code is pushed to the main branch.

## Environment Variables

If your application requires environment variables:

1. Add them to your Netlify site:
   - Go to Site settings > Build & deploy > Environment
   - Add variables like `VITE_WALLET_CONNECT_PROJECT_ID` and `VITE_CONTRACT_ADDRESS`

2. For local development, create a `.env` file in the frontend directory:
   ```
   VITE_WALLET_CONNECT_PROJECT_ID=your_project_id
   VITE_CONTRACT_ADDRESS=your_contract_address
   ``` 