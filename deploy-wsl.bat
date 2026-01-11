@echo off
echo Starting WSL deployment...
echo.

REM Get the current directory path in WSL format
set "CURRENT_DIR=%CD%"
set "WSL_PATH=%CURRENT_DIR:\=/%"
set "WSL_PATH=%WSL_PATH:C:=/mnt/c%"

echo Navigating to: %WSL_PATH%
echo.

wsl -d Ubuntu-24.04 -- bash -c "cd '%WSL_PATH%' && chmod +x deploy.sh play.sh && ./deploy.sh"

echo.
echo Deployment complete! Check deployment-info.txt for details.
pause
