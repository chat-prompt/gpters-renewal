import { chromium } from "playwright";
import { mkdirSync } from "fs";

const BASE = "http://localhost:3000";
const OUT = "docs/design/screenshots";

mkdirSync(OUT, { recursive: true });

const pages = [
  // 사이트 핵심
  { name: "01-홈", path: "/" },
  { name: "02-탐색", path: "/explore/feed" },
  { name: "03-커뮤니티", path: "/community/feed" },
  { name: "04-게시글상세", path: "/posts/claude-marketing" },
  { name: "05-글쓰기", path: "/write" },
  { name: "06-검색", path: "/search?q=Claude" },
  { name: "07-메시지", path: "/messages" },
  { name: "08-태그", path: "/tag/Claude" },
  // 스터디
  { name: "09-스터디상세", path: "/study/ai-automation" },
  { name: "10-체크아웃", path: "/checkout/ai-automation" },
  // LMS 수강생
  { name: "11-내스터디", path: "/study/my" },
  { name: "12-학습", path: "/study/ai-automation/learn" },
  { name: "13-과제", path: "/study/ai-automation/learn/tasks" },
  { name: "14-VOD", path: "/study/ai-automation/learn/vod" },
  { name: "15-수강이력", path: "/study/my/history" },
  { name: "16-청강", path: "/study/my/audit" },
  { name: "17-수료증", path: "/study/my/certificates" },
  // 스터디장 관리
  { name: "18-스터디관리", path: "/study/manage/ai-automation" },
  { name: "19-수강생현황", path: "/study/manage/ai-automation/members" },
  { name: "20-공지관리", path: "/study/manage/ai-automation/notices" },
  { name: "21-VOD관리", path: "/study/manage/ai-automation/vod" },
  // 프로필/설정
  { name: "22-프로필", path: "/profile/honggildong" },
  { name: "23-설정", path: "/settings" },
  // 어드민
  { name: "24-어드민대시보드", path: "/admin" },
  { name: "25-어드민게시글", path: "/admin/posts" },
  { name: "26-어드민스터디", path: "/admin/studies" },
  { name: "27-어드민배너", path: "/admin/banners" },
  { name: "28-어드민텍스트", path: "/admin/texts" },
  { name: "29-어드민회원", path: "/admin/users" },
  { name: "30-어드민기수", path: "/admin/cohorts" },
  { name: "31-어드민세션", path: "/admin/sessions" },
  { name: "32-어드민수료환급", path: "/admin/completion" },
  { name: "33-어드민분류", path: "/admin/taxonomy" },
  { name: "34-어드민신고", path: "/admin/moderation" },
];

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});

for (const p of pages) {
  const page = await context.newPage();
  try {
    await page.goto(`${BASE}${p.path}`, { waitUntil: "networkidle", timeout: 10000 });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `${OUT}/${p.name}.png`,
      fullPage: true,
    });
    console.log(`✓ ${p.name}`);
  } catch (e) {
    console.log(`✗ ${p.name}: ${e.message.split("\n")[0]}`);
  }
  await page.close();
}

await browser.close();
console.log("\nDone!");
