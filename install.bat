@echo off
echo ========================================
echo EventNexus - Automated Setup Script
echo ========================================
echo.

echo [1/4] Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Backend installation failed!
    pause
    exit /b 1
)
echo Backend dependencies installed successfully!
echo.

echo [2/4] Installing Frontend Dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Frontend installation failed!
    pause
    exit /b 1
)
echo Frontend dependencies installed successfully!
echo.

echo [3/4] Setup Complete!
echo.
echo ========================================
echo NEXT STEPS:
echo ========================================
echo 1. Run database schema in Supabase:
echo    - Go to: https://supabase.com/dashboard
echo    - Open SQL Editor
echo    - Run: backend\database\schema.sql
echo.
echo 2. Start Backend (in new terminal):
echo    cd backend
echo    npm start
echo.
echo 3. Start Frontend (in new terminal):
echo    cd frontend
echo    npm run dev
echo.
echo 4. Open browser:
echo    http://localhost:5173
echo.
echo 5. Login as admin:
echo    Email: admin@eventnexus.com
echo    Password: admin123
echo.
echo ========================================
echo.

pause
