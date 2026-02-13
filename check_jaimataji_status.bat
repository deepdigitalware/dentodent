@echo off
echo Jaimataji Jewellers - Quick Verification
echo =====================================
echo.

echo Checking if all required files exist...
if exist "c:\Users\deepd\D\DOD\dns_setup_guide.md" (
    echo ✅ DNS Setup Guide: Found
) else (
    echo ❌ DNS Setup Guide: Missing
)

if exist "c:\Users\deepd\D\DOD\monitor_dns_setup.py" (
    echo ✅ DNS Monitor Script: Found
) else (
    echo ❌ DNS Monitor Script: Missing
)

if exist "c:\Users\deepd\D\DOD\complete_jaimataji_ssl_setup.py" (
    echo ✅ SSL Setup Script: Found
) else (
    echo ❌ SSL Setup Script: Missing
)

if exist "c:\Users\deepd\D\DOD\final_verification_fixed.py" (
    echo ✅ Verification Script: Found
) else (
    echo ❌ Verification Script: Missing
)

echo.
echo Current Status Check:
echo ===================
python c:\Users\deepd\D\DOD\final_verification_fixed.py

echo.
echo Next Steps:
echo ===========
echo 1. Set up DNS records using dns_setup_guide.md
echo 2. Run monitor_dns_setup.py to verify DNS propagation
echo 3. Run complete_jaimataji_ssl_setup.py after DNS is working
echo.
pause