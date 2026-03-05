@echo off
echo ========================================
echo Installing New Dependencies
echo ========================================
echo.

cd backend
echo Installing winston and qrcode...
call npm install winston qrcode
echo.

echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo New features added:
echo - Winston Logger (Production-grade logging)
echo - QR Code Service (Event check-in system)
echo.
pause
