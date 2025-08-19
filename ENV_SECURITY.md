# Environment Variables and Security Guidelines

## Overview

This document provides guidelines for managing environment variables and sensitive information in this project. Following these practices will help prevent accidental exposure of credentials and API keys.

## Environment Files

The project uses the following environment files:

- `.env`: Main environment file for local development
- `.env.local`: Local overrides for environment variables
- `.env.development`: Development-specific environment variables
- `.env.production`: Production-specific environment variables
- `.env.example`: Example template with placeholder values (safe to commit)

**IMPORTANT: Never commit actual environment files containing real credentials to the repository.**

## Security Best Practices

1. **Use Environment Variables**: Always access sensitive information through `process.env` variables.

2. **Keep .env Files Local**: All `.env` files (except `.env.example`) should remain on your local machine only.

3. **Use .env.example**: Maintain an up-to-date `.env.example` file with placeholder values to guide other developers.

4. **Check .gitignore**: Ensure `.gitignore` properly excludes all environment files except `.env.example`.

5. **Verify Before Committing**: Always check `git status` before committing to ensure no sensitive files are included.

6. **Use the Safe Build Script**: Use the provided `scripts/safe-build-push.ps1` script to safely build and push your code.

## GitHub Push Protection

GitHub has push protection enabled for this repository, which scans commits for potential secrets. If you encounter a push protection error:

1. **Remove the secret**: Remove the sensitive information from your commit history
2. **Use environment variables**: Replace hardcoded credentials with environment variables
3. **Update .gitignore**: Ensure sensitive files are properly excluded

## Using the Safe Build and Push Script

We've created a PowerShell script to help safely build and push your code:

```powershell
./scripts/safe-build-push.ps1
```

This script will:
1. Check for tracked environment files and offer to remove them from git tracking
2. Ensure .gitignore is properly configured
3. Run the build process
4. Help commit and push changes safely

## Setting Up Environment Variables

1. Copy `.env.example` to `.env`:
   ```
   cp .env.example .env
   ```

2. Fill in your actual credentials in the `.env` file

3. Never commit the `.env` file with real credentials

## Deployment Considerations

For deployment platforms (Vercel, Netlify, etc.), set environment variables through their respective dashboards or CLI tools rather than committing `.env` files.