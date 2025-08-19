@echo off
echo Safe Build and Push Script
echo This script helps safely build and push code without exposing sensitive credentials
echo.

:: Check if .env files are being tracked by git
for /f "tokens=*" %%a in ('git ls-files .env .env.*') do (
    if not "%%a"==".env.example" (
        echo WARNING: The following environment file is tracked by git: %%a
        set /p confirmation=Do you want to remove this file from git tracking? (y/n): 
        if /i "!confirmation!"=="y" (
            git rm --cached "%%a"
            echo Removed %%a from git tracking
        ) else (
            echo Aborted. Please manually remove sensitive files from git tracking.
            exit /b 1
        )
    )
)

:: Run build
echo Running npm build...
call npm run build

if %ERRORLEVEL% neq 0 (
    echo Build failed. Please fix the errors and try again.
    exit /b 1
)

:: Commit changes if needed
git status
set /p commitConfirmation=Do you want to commit these changes? (y/n): 
if /i "%commitConfirmation%"=="y" (
    set /p commitMessage=Enter commit message: 
    git add .
    git commit -m "%commitMessage%"
    echo Changes committed
) else (
    echo Skipping commit
)

:: Push changes
set /p pushConfirmation=Do you want to push your changes? (y/n): 
if /i "%pushConfirmation%"=="y" (
    for /f "tokens=*" %%b in ('git rev-parse --abbrev-ref HEAD') do set branch=%%b
    git push origin %branch%
    
    if %ERRORLEVEL% neq 0 (
        echo Push failed. Please check the error message above.
    ) else (
        echo Changes pushed successfully
    )
) else (
    echo Push skipped
)

echo Script completed