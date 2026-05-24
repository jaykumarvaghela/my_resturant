@echo off
echo.
echo  Starting QuickBite...
echo.

echo  Starting Backend API...
start "QuickBite API" cmd /k "cd apps\api && npx tsx src/server.ts"

timeout /t 3 /nobreak > nul

echo  Starting Frontend...
start "QuickBite Web" cmd /k "cd apps\web && pnpm dev"

echo.
echo  Both are starting!
echo  Frontend: http://localhost:5173
echo  Backend:  http://localhost:3001
echo.
pause
