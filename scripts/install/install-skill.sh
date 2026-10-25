#!/usr/bin/env bash
# ==============================================================================
# BỘ CÀI ĐẶT TỰ ĐỘNG SKILL /congpc CHO LINUX & MACOS
# Tác giả: CONGPC - AegisOps Suite
# ==============================================================================

set -e

echo ""
echo "======================================================================"
echo "🚀 ĐANG TIẾN HÀNH CÀI ĐẶT SKILL /congpc VÀO HỆ THỐNG ANTIGRAVITY / AGENTS"
echo "======================================================================"
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_SOURCE="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Danh sách các thư mục skill tiêu chuẩn của Antigravity và AI Agents
TARGET_DIRS=(
    "$HOME/.gemini/antigravity-cli/skills/congpc"
    "$HOME/.agents/skills/congpc"
    "$HOME/.codex/skills/congpc"
    "$HOME/.claude/skills/congpc"
)

INSTALLED_COUNT=0

for TARGET in "${TARGET_DIRS[@]}"; do
    PARENT_DIR="$(dirname "$TARGET")"
    if [ -d "$PARENT_DIR" ]; then
        echo "[+] Phát hiện môi trường AI Agent tại: $PARENT_DIR"
        mkdir -p "$TARGET/tools"
        
        # Sao chép SKILL.md
        cp "$SKILL_SOURCE/SKILL.md" "$TARGET/SKILL.md"
        
        # Sao chép các công cụ thực thi
        if [ -d "$SKILL_SOURCE/tools" ]; then
            cp -r "$SKILL_SOURCE/tools/"* "$TARGET/tools/"
            chmod +x "$TARGET/tools/"*.py 2>/dev/null || true
        fi
        
        echo "    [✓] Đã cài đặt thành công skill vào: $TARGET"
        INSTALLED_COUNT=$((INSTALLED_COUNT + 1))
    fi
done

# Cài đặt cục bộ vào .agent/skills/congpc nếu đang ở trong workspace
if [ -d ".agent" ]; then
    mkdir -p ".agent/skills/congpc/tools"
    cp "$SKILL_SOURCE/SKILL.md" ".agent/skills/congpc/SKILL.md"
    cp -r "$SKILL_SOURCE/tools/"* ".agent/skills/congpc/tools/" 2>/dev/null || true
    chmod +x ".agent/skills/congpc/tools/"*.py 2>/dev/null || true
    echo "    [✓] Đã cài đặt vào Workspace hiện tại: .agent/skills/congpc"
    INSTALLED_COUNT=$((INSTALLED_COUNT + 1))
fi

echo ""
if [ "$INSTALLED_COUNT" -gt 0 ]; then
    echo "======================================================================"
    echo "🎉 HOÀN THÀNH CÀI ĐẶT XUẤT SẮC!"
    echo "Bây giờ trong Antigravity hoặc AI Agent, bạn chỉ cần gõ:"
    echo "   /congpc <target-url>"
    echo "Hệ thống sẽ lập tức kích hoạt bộ não DevSecOps của CONGPC!"
    echo "======================================================================"
else
    # Nếu chưa tìm thấy thư mục nào, tự tạo thư mục mặc định Antigravity
    DEFAULT_DIR="$HOME/.gemini/antigravity-cli/skills/congpc"
    mkdir -p "$DEFAULT_DIR/tools"
    cp "$SKILL_SOURCE/SKILL.md" "$DEFAULT_DIR/SKILL.md"
    cp -r "$SKILL_SOURCE/tools/"* "$DEFAULT_DIR/tools/"
    chmod +x "$DEFAULT_DIR/tools/"*.py
    echo "    [✓] Đã khởi tạo thư mục Antigravity mặc định tại: $DEFAULT_DIR"
    echo "🎉 Cài đặt hoàn tất! Bạn có thể sử dụng lệnh /congpc ngay bây giờ."
fi
echo ""
