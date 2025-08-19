# Safe Build and Push Script
# This script helps safely build and push code without exposing sensitive credentials

# Check if .env files are being tracked by git
$envTracked = git ls-files .env .env.* | Where-Object { $_ -ne ".env.example" }
if ($envTracked) {
    Write-Host "WARNING: The following environment files are tracked by git:" -ForegroundColor Red
    Write-Host $envTracked -ForegroundColor Red
    Write-Host "These files may contain sensitive information and should not be committed." -ForegroundColor Red
    
    $confirmation = Read-Host "Do you want to remove these files from git tracking? (y/n)"
    if ($confirmation -eq 'y') {
        foreach ($file in $envTracked) {
            git rm --cached $file
            Write-Host "Removed $file from git tracking" -ForegroundColor Green
        }
        Write-Host "Files removed from git tracking. They will remain in your local directory." -ForegroundColor Green
    } else {
        Write-Host "Aborted. Please manually remove sensitive files from git tracking." -ForegroundColor Yellow
        exit 1
    }
}

# Ensure .gitignore is properly configured
$gitignoreContent = Get-Content .gitignore
if (-not ($gitignoreContent -contains ".env" -and $gitignoreContent -contains ".env.*")) {
    Write-Host "Updating .gitignore to exclude environment files..." -ForegroundColor Yellow
    Add-Content .gitignore "`n# Environment files`n.env`n.env.*`n!.env.example"
    Write-Host ".gitignore updated" -ForegroundColor Green
}

# Run build
Write-Host "Running npm build..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed. Please fix the errors and try again." -ForegroundColor Red
    exit 1
}

# Commit changes if needed
$status = git status --porcelain
if ($status) {
    Write-Host "Uncommitted changes detected:" -ForegroundColor Yellow
    git status
    
    $commitConfirmation = Read-Host "Do you want to commit these changes? (y/n)"
    if ($commitConfirmation -eq 'y') {
        $commitMessage = Read-Host "Enter commit message"
        git add .
        git commit -m $commitMessage
        Write-Host "Changes committed" -ForegroundColor Green
    } else {
        Write-Host "Skipping commit" -ForegroundColor Yellow
    }
}

# Push changes
$pushConfirmation = Read-Host "Do you want to push your changes? (y/n)"
if ($pushConfirmation -eq 'y') {
    $branch = git rev-parse --abbrev-ref HEAD
    git push origin $branch
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Push failed. Please check the error message above." -ForegroundColor Red
    } else {
        Write-Host "Changes pushed successfully" -ForegroundColor Green
    }
} else {
    Write-Host "Push skipped" -ForegroundColor Yellow
}

Write-Host "Script completed" -ForegroundColor Green