#!/bin/bash
# design-rules.md 위반 탐지 스크립트
# Usage: ./lint-design-rules.sh [file_path]

FILE_PATH=""
VIOLATIONS=0

# 색상 출력
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 파일이 components/ 내부인지 확인
if [[ ! "$FILE_PATH" == *"components/"* ]]; then
  exit 0
fi

echo "🔍 Design Rules 검증: $FILE_PATH"
echo "---"

# 1. 텍스트 아이콘/이모지 탐지 (규칙 2.7)
# 유니코드 심볼 (curly quotes "" 포함)
TEXT_ICONS=$(grep -E '[""]|[✓✔✅⚠️❌✕✖×▼▾⌄›❯←→ℹ🔍📋📌📝💡⬆⬇⬅➡◀▶●○■□★☆♥♦]' "$FILE_PATH" 2>/dev/null || true)
if [ -n "$TEXT_ICONS" ]; then
  echo -e "${RED}❌ [2.7 위반] 텍스트 아이콘/이모지 사용 금지${NC}"
  echo "$TEXT_ICONS"
  echo "   → SVG 아이콘으로 교체 필요 (lucide-react 권장)"
  echo ""
  VIOLATIONS=$((VIOLATIONS + 1))
fi

# 2. 하드코딩 색상 탐지 (규칙 2.2)
HARDCODED_COLORS=$(grep -E "(#[0-9a-fA-F]{3,8}|rgb\(|rgba\(|hsl\()" "$FILE_PATH" 2>/dev/null | grep -v "var(--" || true)
if [ -n "$HARDCODED_COLORS" ]; then
  echo -e "${RED}❌ [2.2 위반] 하드코딩 색상 사용 금지${NC}"
  echo "$HARDCODED_COLORS"
  echo "   → var(--color-*) 토큰으로 교체 필요"
  echo ""
  VIOLATIONS=$((VIOLATIONS + 1))
fi

# 3. 하드코딩 간격 탐지 (규칙 2.1)
HARDCODED_SPACING=$(grep -oE "(padding|margin|gap|top|right|bottom|left):\s*[0-9]+px" "$FILE_PATH" 2>/dev/null || true)
if [ -n "$HARDCODED_SPACING" ]; then
  echo -e "${YELLOW}⚠️ [2.1 주의] 하드코딩 간격 발견${NC}"
  echo "$HARDCODED_SPACING"
  echo "   → var(--spacing-*) 토큰 사용 권장"
  echo ""
fi

# 4. Anti-Pattern: border-left/right px 탐지 (규칙 0.1)
BORDER_PX=$(grep -E "border-(left|right):\s*[0-9]+px" "$FILE_PATH" 2>/dev/null || true)
if [ -n "$BORDER_PX" ]; then
  echo -e "${RED}❌ [0.1 위반] border-left/right px 금지${NC}"
  echo "$BORDER_PX"
  echo "   → border 토큰 사용 필요"
  echo ""
  VIOLATIONS=$((VIOLATIONS + 1))
fi

# 5. 불필요한 shadow 탐지 (규칙 2.8)
COMPONENT_NAME=$(basename "$(dirname "$FILE_PATH")")
if [[ ! "$COMPONENT_NAME" =~ ^(Modal|Dropdown|Toast|Popover|Tooltip)$ ]]; then
  SHADOW_USAGE=$(grep -E "box-shadow|boxShadow" "$FILE_PATH" 2>/dev/null || true)
  if [ -n "$SHADOW_USAGE" ]; then
    echo -e "${RED}❌ [2.8 위반] Shadow 사용 금지 (해당 컴포넌트)${NC}"
    echo "$SHADOW_USAGE"
    echo "   → border로 대체하거나 제거 필요"
    echo ""
    VIOLATIONS=$((VIOLATIONS + 1))
  fi
fi

# 6. page.tsx에서 로컬 컴포넌트 정의 탐지
if [[ "$FILE_PATH" == *"page.tsx"* ]]; then
  LOCAL_COMPONENTS=$(grep -E "^(export )?(const|function) [A-Z]" "$FILE_PATH" \
    | grep -v "Page" | grep -v "export default" || true)
  if [ -n "$LOCAL_COMPONENTS" ]; then
    echo -e "${RED}❌ page.tsx에서 컴포넌트 직접 정의 금지${NC}"
    echo "$LOCAL_COMPONENTS"
    echo "   → @components/ 또는 @gpters-internal/ui에서 import하세요"
    echo ""
    VIOLATIONS=$((VIOLATIONS + 1))
  fi
fi

# 결과 출력
echo "---"
if [ $VIOLATIONS -eq 0 ]; then
  echo -e "✅ Design Rules 검증 통과"
else
  echo -e "${RED}❌ $VIOLATIONS개 위반 발견 - 수정 필요${NC}"
fi

exit $VIOLATIONS
