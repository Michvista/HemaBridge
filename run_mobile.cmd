@echo off
set "PATH=C:\Program Files\nodejs;C:\Windows\system32;C:\Windows"
cd /d "C:\Users\USER\Desktop\Hemabridge\mobile"
echo === Starting npm install for React Native and NativeWind ===
call npm install --no-audit --no-fund --legacy-peer-deps
echo === Mobile npm install completed with code %ERRORLEVEL% ===
