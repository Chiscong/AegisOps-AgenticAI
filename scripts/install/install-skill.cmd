@echo off
REM ==============================================================================
REM BỘ CÀI ĐẶT TỰ ĐỘNG SKILL /congpc CHO WINDOWS (CMD / BATCH)
REM Tác giả: CONGPC - AegisOps Suite
REM ==============================================================================

chcp 65001 >nul
echo.
echo ======================================================================
echo 🚀 ĐANG TIẾN HÀNH CÀI ĐẶT SKILL /congpc TRÊN HỆ THỐNG WINDOWS
echo ======================================================================
echo.

for %%I in ("%~dp0..\..") do set SCRIPT_DIR=%%~fI

set INSTALLED=0

REM 1. Kiểm tra thư mục Antigravity trên Windows
set AGY_DIR=%USERPROFILE%\.gemini\antigravity-cli\skills\congpc
if exist "%USERPROFILE%\.gemini\antigravity-cli\skills" (
    echo [+] Phát hiện Antigravity CLI tại: %USERPROFILE%\.gemini\antigravity-cli\skills
    if not exist "%AGY_DIR%\tools" mkdir "%AGY_DIR%\tools"
    copy /Y "%SCRIPT_DIR%\SKILL.md" "%AGY_DIR%\SKILL.md" >nul
    xcopy /Y /E /I "%SCRIPT_DIR%\tools\*" "%AGY_DIR%\tools\" >nul
    echo     [✓] Đã cài đặt thành công skill vào: %AGY_DIR%
    set INSTALLED=1
)

REM 2. Kiểm tra thư mục .agents trên Windows
set AGENTS_DIR=%USERPROFILE%\.agents\skills\congpc
if exist "%USERPROFILE%\.agents\skills" (
    echo [+] Phát hiện môi trường Agents tại: %USERPROFILE%\.agents\skills
    if not exist "%AGENTS_DIR%\tools" mkdir "%AGENTS_DIR%\tools"
    copy /Y "%SCRIPT_DIR%\SKILL.md" "%AGENTS_DIR%\SKILL.md" >nul
    xcopy /Y /E /I "%SCRIPT_DIR%\tools\*" "%AGENTS_DIR%\tools\" >nul
    echo     [✓] Đã cài đặt thành công skill vào: %AGENTS_DIR%
    set INSTALLED=1
)

REM 3. Nếu chưa có, tự tạo thư mục chuẩn Antigravity
if "%INSTALLED%"=="0" (
    echo [+] Khởi tạo thư mục kỹ năng Antigravity mặc định...
    if not exist "%AGY_DIR%\tools" mkdir "%AGY_DIR%\tools"
    copy /Y "%SCRIPT_DIR%\SKILL.md" "%AGY_DIR%\SKILL.md" >nul
    xcopy /Y /E /I "%SCRIPT_DIR%\tools\*" "%AGY_DIR%\tools\" >nul
    echo     [✓] Đã cài đặt thành công skill vào: %AGY_DIR%
)

echo.
echo ======================================================================
echo 🎉 HOÀN THÀNH CÀI ĐẶT SKILL /congpc TRÊN WINDOWS!
echo Bây giờ trong Antigravity hoặc Cursor/Codex, bạn chỉ cần gõ:
echo    /congpc
echo để kích hoạt ngay bộ kỹ năng DevSecOps của CONGPC!
echo ======================================================================
echo.
pause
