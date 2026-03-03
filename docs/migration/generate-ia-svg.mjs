/**
 * GPTers IA Sitemap — SVG Generator v2
 * 고정 폭 그리드 기반 레이아웃으로 피그마 호환 SVG 생성
 * Usage: node docs/migration/generate-ia-svg.mjs
 */
import { writeFileSync } from 'fs';

// ── Colors ──
const C = {
  primary: '#EF6020', darkBrown: '#9B5A3C', midOrange: '#D4561A',
  lightOrange: '#E8955A', futureOrange: '#D4A07A', bg: '#FFF8F0',
  white: '#FFFFFF', newBg: '#FFF5EE', text: '#333333',
  sub: '#555555', muted: '#999999', border: '#E8C5A8',
};

let lines = [];
const a = s => lines.push(s);

// ── Helpers ──
function R(x,y,w,h,f,s='none',sw=0,rx=6,dash=false) {
  a(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${f}"${s!=='none'?` stroke="${s}" stroke-width="${sw}"`:''}${dash?' stroke-dasharray="6,3"':''}/>`);
}
function T(x,y,str,sz,fw,fill,anchor='middle') {
  // XML 특수문자 이스케이프 + dy로 수직 중앙 정렬
  const safe = str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  a(`<text x="${x}" y="${y}" dy="0.38em" font-size="${sz}" font-weight="${fw}" fill="${fill}" text-anchor="${anchor}" font-family="-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo','Pretendard',sans-serif">${safe}</text>`);
}
function L(x1,y1,x2,y2,c,w=2) {
  a(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}"/>`);
}

// ════════════════════════════════════
// DATA
// ════════════════════════════════════
const site = [
  { name:'탐색(Explore)', url:'/explore', kids:[
    {n:'전체 피드',u:'/explore/feed'},
    {n:'카테고리별',u:'/explore/category/…', sub:['AI활용법','프롬프트','자동화/노코드','개발/코딩','비즈니스','AI뉴스']},
    {n:'인기글',u:'/explore/trending'},
    {n:'게시글 상세',u:'/posts/{slug}'},
  ]},
  { name:'스터디(Study)', url:'/study', kids:[
    {n:'모집 중',u:'/study?recruiting'},
    {n:'진행 중',u:'/study?ongoing'},
    {n:'스터디 상세',u:'/study/{slug}', sub:['소개','커리큘럼','후기','FAQ']},
    {n:'체크아웃',u:'/checkout/{id}'},
    {n:'내 스터디',u:'/study/my'},
  ]},
  { name:'커뮤니티', url:'/community', kids:[
    {n:'피드',u:'/community/feed',nw:1},
    {n:'자유게시판',u:'/community/free'},
    {n:'Q&A',u:'/community/qna'},
    {n:'이벤트/모임',u:'/community/events'},
    {n:'모각AI',u:'/community/mogak-ai',nw:1},
    {n:'AI토크',u:'/community/ai-talk',nw:1},
  ]},
  { name:'AI 이력서', url:'/profile/{user}', kids:[
    {n:'개요',u:'/profile/{user}'},
    {n:'스터디 이력',u:'…/studies'},
    {n:'작성글',u:'…/posts'},
    {n:'포트폴리오',u:'…/portfolio'},
    {n:'포인트/뱃지',u:'…/badges',nw:1},
  ]},
  { name:'검색', url:'/search', kids:[
    {n:'통합 검색',u:'/search?q=…', sub:['게시글','스터디','사용자']},
  ]},
  { name:'메시지', url:'/messages', kids:[
    {n:'받은 메시지',u:'/messages/inbox',nw:1},
    {n:'보낸 메시지',u:'/messages/sent',nw:1},
    {n:'자동 알림',u:'/messages/noti',nw:1},
  ]},
  { name:'글쓰기', url:'/write', kids:[
    {n:'피드 포스트',u:'/write?type=feed',nw:1},
    {n:'사례 게시글',u:'/write?type=case'},
    {n:'임시저장',u:'/write/drafts'},
  ]},
  { name:'인증', url:'/auth', kids:[
    {n:'로그인',u:'/auth/login'},
    {n:'회원가입',u:'/auth/register'},
    {n:'비밀번호 재설정',u:'/auth/reset'},
  ]},
  { name:'설정', url:'/settings', kids:[
    {n:'내 정보',u:'/settings/profile'},
    {n:'구매내역',u:'/settings/orders'},
    {n:'쿠폰',u:'/settings/coupons'},
    {n:'알림 설정',u:'/settings/noti'},
  ]},
  { name:'채용(예정)', url:'/jobs', fut:true, kids:[
    {n:'구인',u:'/jobs/hiring',fut:1},
    {n:'구직',u:'/jobs/seeking',fut:1},
  ]},
];

const admin = [
  ['대시보드','통계·빠른작업·최근활동'],['게시글 관리','검색·필터·카테고리이동'],
  ['스터디 관리','기수필터·상태변경·토글'],['배너 관리','히어로·피드·하단 3탭'],
  ['상품/쿠폰','상품CRUD·가격단계·쿠폰'],['텍스트 관리','인라인편집·미리보기'],
  ['기수 관리','기수CRUD·타임라인'],['세션 관리','세션CRUD·캘린더'],
  ['결제/주문','주문검색·환불처리'],['수료/환급','수료판정·수료증·환급'],
  ['회원 관리','검색·권한부여'],['분류 관리','카테고리·태그'],
  ['뱃지/포인트','뱃지CRUD·포인트'],['DM/알림','템플릿·알림규칙'],
  ['신고/모더레이션','신고큐·처리액션'],['리포트','기수별·콘텐츠·CSV'],
];

const lmsStudent = [
  ['수강생 대시보드','내스터디·할일·진도'],['스터디 학습','주차별·출석·과제'],
  ['VOD 다시보기','내/다른스터디'],['과제 현황','주차별 과제상태'],
  ['청강 VOD','전체스터디 VOD'],['수강 이력','기수별 참여이력'],
  ['수료 현황','수료증 조회·다운로드'],
];

const lmsLeader = [
  ['스터디장 대시보드','빠른설정·수강생요약'],['수강생 현황','출석·과제 매트릭스'],
  ['VOD 관리','주차별 VOD등록'],['공지 관리','멤버·세션 공지'],
];

// ════════════════════════════════════
// LAYOUT
// ════════════════════════════════════
const COL_W = 160;    // 각 섹션 컬럼 폭
const COL_GAP = 12;   // 컬럼 간격
const N = site.length;
const SITE_W = N * COL_W + (N-1) * COL_GAP;
const MX = 50;        // 좌우 마진
const SVG_W = SITE_W + MX * 2;

const L1_W = COL_W - 10;
const L1_H = 38;
const L2_W = COL_W - 20;
const L2_H = 26;
const L3_W = COL_W - 36;
const L3_H = 22;
const CONN = 12;      // 연결선 높이
const SUB_CONN = 8;

// Y positions
const HDR_Y = 30;
const ROOT_Y = 110;
const ROOT_H = 42;
const HLINE_Y = ROOT_Y + ROOT_H + 30;
const L1_Y = HLINE_Y + 28;

// Column centers
const centers = [];
for (let i = 0; i < N; i++) {
  centers.push(MX + i * (COL_W + COL_GAP) + COL_W / 2);
}

// Calc children height per section
function childrenH(sec) {
  let h = 0;
  for (const k of sec.kids) {
    h += CONN + L2_H;
    if (k.sub) h += k.sub.length * (SUB_CONN + L3_H);
  }
  return h;
}

const maxChildH = Math.max(...site.map(childrenH));
const CHILD_START = L1_Y + L1_H + 6;

// Area boxes
const AREA_Y = CHILD_START + maxChildH + 60;

// Admin grid
const A_COLS = 4;
const A_ITEM_W = 148;
const A_ITEM_H = 44;
const A_GAP = 8;
const A_ROWS = Math.ceil(admin.length / A_COLS);
const A_BOX_W = A_COLS * A_ITEM_W + (A_COLS-1) * A_GAP + 40;
const A_BOX_H = A_ROWS * (A_ITEM_H + A_GAP) + 60;

// LMS grid
const L_COLS = 4;
const L_ITEM_W = 148;
const L_ITEM_H = 44;
const L_ROWS_S = Math.ceil(lmsStudent.length / L_COLS);
const L_ROWS_L = Math.ceil(lmsLeader.length / L_COLS);
const L_BOX_W = L_COLS * L_ITEM_W + (L_COLS-1) * A_GAP + 40;
const L_BOX_H = (L_ROWS_S + L_ROWS_L) * (L_ITEM_H + A_GAP) + 90;

const AREA_GAP = 24;
const AREAS_W = A_BOX_W + L_BOX_W + AREA_GAP;
const AREAS_X = (SVG_W - AREAS_W) / 2;

const LEGEND_Y = AREA_Y + Math.max(A_BOX_H, L_BOX_H) + 40;
const SVG_H = LEGEND_Y + 70;

// ════════════════════════════════════
// DRAW
// ════════════════════════════════════
a(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SVG_W} ${SVG_H}" width="${SVG_W}" height="${SVG_H}">`);
a(`<defs><style>text{letter-spacing:-0.3px;}</style></defs>`);
R(0,0,SVG_W,SVG_H,C.bg,undefined,undefined,0);

// ── Header ──
const logoW = 150, logoH = 42;
R((SVG_W-logoW)/2, HDR_Y, logoW, logoH, C.primary, 'none', 0, 10);
a(`<circle cx="${(SVG_W-logoW)/2+26}" cy="${HDR_Y+logoH/2}" r="5" fill="${C.white}"/>`);
T(SVG_W/2+8, HDR_Y+logoH/2, 'GPTers', 20, 800, C.white);
T(SVG_W/2, HDR_Y+logoH+14, 'Information Architecture — Site Map', 12, 500, C.darkBrown);

// ── Root ──
const rootW = 120;
R((SVG_W-rootW)/2, ROOT_Y, rootW, ROOT_H, C.primary, 'none', 0, 8);
T(SVG_W/2, ROOT_Y+15, 'Home', 15, 700, C.white);
T(SVG_W/2, ROOT_Y+31, '/', 10, 400, 'rgba(255,255,255,0.7)');

// Root → Hline connector
L(SVG_W/2, ROOT_Y+ROOT_H, SVG_W/2, HLINE_Y, C.primary);

// Horizontal line
L(centers[0], HLINE_Y, centers[N-1], HLINE_Y, C.primary);

// ── Site Sections ──
for (let i = 0; i < N; i++) {
  const s = site[i];
  const cx = centers[i];

  // Vertical connector to L1
  L(cx, HLINE_Y, cx, L1_Y, C.primary);

  // L1 node
  const l1x = cx - L1_W/2;
  const l1Fill = s.fut ? C.futureOrange : C.primary;
  R(l1x, L1_Y, L1_W, L1_H, l1Fill, 'none', 0, 7);
  T(cx, L1_Y+13, s.name, 11, 700, C.white);
  T(cx, L1_Y+28, s.url, 8, 400, 'rgba(255,255,255,0.65)');

  // Children
  let cy = CHILD_START;
  for (const k of s.kids) {
    // Connector
    L(cx, cy, cx, cy+CONN, C.midOrange, 1.5);
    cy += CONN;

    const nx = cx - L2_W/2;
    const isNew = !!k.nw;
    const isFut = !!k.fut;
    const fill = isNew ? C.newBg : C.white;
    const stroke = isFut ? C.futureOrange : (isNew ? C.midOrange : C.primary);
    R(nx, cy, L2_W, L2_H, fill, stroke, 1.5, 5, isFut);
    T(cx, cy+L2_H/2, k.n, 10, 600, isFut ? C.muted : C.text);

    // NEW badge
    if (isNew) {
      const bx = nx+L2_W-16, by = cy-6;
      R(bx,by,28,13, C.primary,'none',0,3);
      T(bx+14, by+6.5, 'NEW', 7, 700, C.white);
    }

    cy += L2_H;

    // Sub children (L3)
    if (k.sub) {
      for (const sub of k.sub) {
        L(cx, cy, cx, cy+SUB_CONN, C.lightOrange, 1);
        cy += SUB_CONN;
        const sx = cx - L3_W/2;
        R(sx, cy, L3_W, L3_H, C.white, C.lightOrange, 1.2, 4);
        T(cx, cy+L3_H/2, sub, 9, 500, C.sub);
        cy += L3_H;
      }
    }
  }
}

// ══════════════════════════════════════
// AREA BOXES
// ══════════════════════════════════════

// ── Admin ──
const ax = AREAS_X;
R(ax, AREA_Y, A_BOX_W, A_BOX_H, C.white, C.darkBrown, 2, 12);

// Admin badge
const abw = 160;
R(ax+(A_BOX_W-abw)/2, AREA_Y+14, abw, 28, C.darkBrown, 'none', 0, 6);
T(ax+A_BOX_W/2, AREA_Y+28, 'Admin (관리자)', 12, 700, C.white);
T(ax+A_BOX_W/2, AREA_Y+52, '/admin — 운영자 전용 Flat 대시보드', 9, 400, C.muted);

const agx = ax + 20;
const agy = AREA_Y + 66;
for (let i = 0; i < admin.length; i++) {
  const [label, desc] = admin[i];
  const col = i % A_COLS;
  const row = Math.floor(i / A_COLS);
  const ix = agx + col * (A_ITEM_W + A_GAP);
  const iy = agy + row * (A_ITEM_H + A_GAP);

  R(ix, iy, A_ITEM_W, 20, C.darkBrown, 'none', 0, 4);
  T(ix+A_ITEM_W/2, iy+10, label, 9, 700, C.white);
  R(ix, iy+22, A_ITEM_W, 20, C.bg, C.border, 1, 4);
  T(ix+A_ITEM_W/2, iy+32, desc, 8, 400, C.sub);
}

// ── LMS ──
const lx = AREAS_X + A_BOX_W + AREA_GAP;
R(lx, AREA_Y, L_BOX_W, L_BOX_H, C.white, C.midOrange, 2, 12);

const lbw = 160;
R(lx+(L_BOX_W-lbw)/2, AREA_Y+14, lbw, 28, C.midOrange, 'none', 0, 6);
T(lx+L_BOX_W/2, AREA_Y+28, 'LMS (학습 관리)', 12, 700, C.white);
T(lx+L_BOX_W/2, AREA_Y+52, '수강생 / 스터디장 전용', 9, 400, C.muted);

// Student items
const lgx = lx + 20;
let lgy = AREA_Y + 72;
T(lgx, lgy-4, '수강생', 9, 600, C.midOrange, 'start');

for (let i = 0; i < lmsStudent.length; i++) {
  const [label, desc] = lmsStudent[i];
  const col = i % L_COLS;
  const row = Math.floor(i / L_COLS);
  const ix = lgx + col * (L_ITEM_W + A_GAP);
  const iy = lgy + row * (L_ITEM_H + A_GAP);

  R(ix, iy, L_ITEM_W, 20, C.midOrange, 'none', 0, 4);
  T(ix+L_ITEM_W/2, iy+10, label, 9, 700, C.white);
  R(ix, iy+22, L_ITEM_W, 20, C.bg, C.lightOrange, 1, 4);
  T(ix+L_ITEM_W/2, iy+32, desc, 8, 400, C.sub);
}

// Leader items
const leaderY = lgy + L_ROWS_S * (L_ITEM_H + A_GAP) + 14;
T(lgx, leaderY-4, '스터디장', 9, 600, '#B54E1A', 'start');

for (let i = 0; i < lmsLeader.length; i++) {
  const [label, desc] = lmsLeader[i];
  const col = i % L_COLS;
  const row = Math.floor(i / L_COLS);
  const ix = lgx + col * (L_ITEM_W + A_GAP);
  const iy = leaderY + row * (L_ITEM_H + A_GAP);

  R(ix, iy, L_ITEM_W, 20, '#B54E1A', 'none', 0, 4);
  T(ix+L_ITEM_W/2, iy+10, label, 9, 700, C.white);
  R(ix, iy+22, L_ITEM_W, 20, C.bg, '#B54E1A', 1, 4);
  T(ix+L_ITEM_W/2, iy+32, desc, 8, 400, C.sub);
}

// ══════════════════════════════════════
// LEGEND
// ══════════════════════════════════════
const legendData = [
  ['GNB 메뉴', C.primary, 'none', false],
  ['하위 페이지', C.white, C.primary, false],
  ['NEW 신규', C.newBg, C.midOrange, false],
  ['향후 예정', C.white, C.futureOrange, true],
  ['어드민', C.darkBrown, 'none', false],
  ['LMS', C.midOrange, 'none', false],
];

const lw = legendData.length * 140;
const lsx = (SVG_W - lw) / 2;
for (let i = 0; i < legendData.length; i++) {
  const [label, fill, stroke, dash] = legendData[i];
  const x = lsx + i * 140;
  R(x, LEGEND_Y, 22, 14, fill, stroke !== 'none' ? stroke : 'none', stroke !== 'none' ? 1.5 : 0, 3, dash);
  T(x+30, LEGEND_Y+7, label, 10, 400, '#666666', 'start');
}

T(SVG_W/2, LEGEND_Y+40, 'GPTers IA — 2026.02', 10, 400, '#bbbbbb');

a('</svg>');

// Write
const out = new URL('./ia-sitemap.svg', import.meta.url).pathname;
writeFileSync(out, lines.join('\n'), 'utf-8');
console.log(`Done: ${out} (${SVG_W}x${SVG_H})`);
