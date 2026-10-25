# ==============================================================================
# BỘ CÀI ĐẶT TỰ ĐỘNG SKILL /congpc CHO WINDOWS (POWERSHELL)
# Tác giả: CONGPC - AegisOps Suite
# ==============================================================================

Write-Host ""
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "🚀 ĐANG CÀI ĐẶT SKILL /congpc TRÊN WINDOWS POWERSHELL" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

$CurrentDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ScriptDir = (Get-Item $CurrentDir).Parent.Parent.FullName

$TargetPaths = @(
    "$env:USERPROFILE\.gemini\antigravity-cli\skills\congpc",
    "$env:USERPROFILE\.agents\skills\congpc",
    "$env:USERPROFILE\.codex\skills\congpc",
    "$env:USERPROFILE\.claude\skills\congpc"
)

$Installed = $false

foreach ($Target in $TargetPaths) {
    $Parent = Split-Path -Parent $Target
    if (Test-Path $Parent) {
        Write-Host "[+] Phát hiện thư mục AI Agents tại: $Parent" -ForegroundColor Green
        if (-not (Test-Path "$Target\tools")) {
            New-Item -ItemType Directory -Force -Path "$Target\tools" | Out-Null
        }
        Copy-Item "$ScriptDir\SKILL.md" -Destination "$Target\SKILL.md" -Force
        Copy-Item "$ScriptDir\tools\*" -Destination "$Target\tools\" -Recurse -Force
        Write-Host "    [✓] Đã cài đặt thành công vào: $Target" -ForegroundColor Yellow
        $Installed = $true
    }
}

if (-not $Installed) {
    $DefaultTarget = "$env:USERPROFILE\.gemini\antigravity-cli\skills\congpc"
    New-Item -ItemType Directory -Force -Path "$DefaultTarget\tools" | Out-Null
    Copy-Item "$ScriptDir\SKILL.md" -Destination "$DefaultTarget\SKILL.md" -Force
    Copy-Item "$ScriptDir\tools\*" -Destination "$DefaultTarget\tools\" -Recurse -Force
    Write-Host "[✓] Đã khởi tạo thư mục Antigravity mặc định tại: $DefaultTarget" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "======================================================================" -ForegroundColor Green
Write-Host "🎉 CÀI ĐẶT HOÀN TẤT! Gõ '/congpc' trong Antigravity để bắt đầu." -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Green
Write-Host ""
