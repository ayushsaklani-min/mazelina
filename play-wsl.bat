@echo off
REM Get the current directory path in WSL format
set "CURRENT_DIR=%CD%"
set "WSL_PATH=%CURRENT_DIR:\=/%"
set "WSL_PATH=%WSL_PATH:C:=/mnt/c%"

if "%1"=="" (
    echo Usage: play-wsl.bat [command]
    echo.
    echo Commands:
    echo   join              - Join the game
    echo   move [Direction]  - Move Up/Down/Left/Right
    echo   query             - Check game state
    echo   wallet            - Show wallet address
    echo   info              - Show deployment info
    echo.
    echo Examples:
    echo   play-wsl.bat join
    echo   play-wsl.bat move Right
    echo   play-wsl.bat query
    exit /b
)

wsl -d Ubuntu-24.04 -- bash -c "cd '%WSL_PATH%' && ./play.sh %*"
