@echo off
echo ============================================
echo TEAM REQUEST FEATURE - SETUP INSTRUCTIONS
echo ============================================
echo.
echo The 500 errors you're seeing are because the database tables don't exist yet.
echo.
echo STEP 1: Create Database Tables
echo -------------------------------
echo 1. Open your Supabase Dashboard in browser
echo 2. Click "SQL Editor" in the left sidebar
echo 3. Open the file: SETUP_TEAM_REQUESTS.sql
echo 4. Copy ALL the content
echo 5. Paste into Supabase SQL Editor
echo 6. Click "RUN" button
echo.
echo STEP 2: Restart Backend Server
echo -------------------------------
echo Press Ctrl+C in the backend terminal to stop it
echo Then run: npm start
echo.
echo STEP 3: Refresh Browser
echo -------------------------------
echo Refresh your EventNexus page
echo The 500 errors should be gone!
echo.
echo ============================================
echo.
echo Press any key to open the SQL file location...
pause > nul
explorer /select,"%~dp0SETUP_TEAM_REQUESTS.sql"
