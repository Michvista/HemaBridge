@echo off
set "PATH=C:\Program Files\nodejs;C:\Windows\system32;C:\Windows"
cd /d "C:\Users\USER\Desktop\Hemabridge\backend"
echo === Starting npm install for NestJS ===
call npm install --no-audit --no-fund
echo === npm install completed with code %ERRORLEVEL% ===
echo === Building backend ===
call npm run build
echo === Build completed with code %ERRORLEVEL% ===
