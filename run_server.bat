@echo off
title GS Art Center v4 Local Web Server
echo =======================================================
echo   GS Art Center v4 3D Seat Sight Local Server Starting
echo =======================================================
echo.
echo  * Target Directory: %~dp0
echo  * Local URL: http://localhost:8082/index.html
echo.
echo  Press Ctrl+C in this window to stop the server at any time.
echo -------------------------------------------------------
cd /d "%~dp0"
python -m http.server 8082
