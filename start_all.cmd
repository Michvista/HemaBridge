@echo off
set "PATH=C:\Program Files\nodejs;C:\Windows\system32;C:\Windows"
echo ========================================================
echo   Launching Hemabridge Monolith & Mobile Application
echo ========================================================
echo.
echo [1/2] Starting NestJS TypeORM Backend on port 4000...
start "Hemabridge Backend" cmd /k "set PATH=C:\Program Files\nodejs;C:\Windows\system32;C:\Windows && cd /d C:\Users\USER\Desktop\Hemabridge\backend && npm run start:dev"

timeout /t 3 /nobreak >nul

echo [2/2] Starting React Native Mobile Application...
start "Hemabridge Mobile" cmd /k "set PATH=C:\Program Files\nodejs;C:\Windows\system32;C:\Windows && cd /d C:\Users\USER\Desktop\Hemabridge\mobile && npm start"

echo.
echo Both services launched in independent windows!
echo Backend: http://localhost:4000
echo Mobile: Expo Dev Server ready
