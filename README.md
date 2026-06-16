# 香水推荐助手

一个基于 Next.js App Router 的智能香水推荐应用。用户可以用自然语言描述偏好、场景、季节或预算，系统会通过 Gemini 生成结构化香水推荐，并在前端展示香调、价格、购买渠道、成分分析和详情页。

当前项目定位是可继续扩展的 MVP：推荐链路、详情页、图片兜底、测试和 GitHub Actions CI 已搭建完成。

## 功能特性

- 自然语言香水推荐：例如“推荐一款适合夏天通勤的男士香水”。
- 结构化推荐结果：品牌、名称、描述、图片、价格、香调、成分分析、购买渠道、适用性别、浓度、留香和扩散度。
- 推荐弹窗对话体验：用户输入和推荐结果以聊天形式展示。
- 详情页展示：点击推荐卡片进入 `/perfume/[id]` 查看完整香水信息。
- 对话状态恢复：从详情页返回时，会回到刚刚的推荐弹窗，并保留对话记录。
- 图片兜底：外部图片 403、404 或热链失败时，自动展示本地渲染的香水瓶占位图。
- 无 API key fallback：本地、CI 或构建环境缺少 `GOOGLE_API_KEY` 时，会返回 mock 推荐数据，避免应用直接崩溃。
- 自动化测试：包含后端 schema/API/service 测试和 Playwright E2E 测试。
- CI/CD：已配置 GitHub Actions，覆盖 lint、后端测试、E2E 测试和生产构建。

## 技术栈

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- LangChain
- Google Gemini via `@langchain/google-genai`
- Zod structured output parser
- Playwright
- GitHub Actions

## 项目结构

```text
app/
  api/recommend/route.ts              # 推荐 API 路由
  page.tsx                            # 首页和推荐弹窗入口
  layout.tsx                          # 全局布局和 metadata
  globals.css                         # 全局样式
  perfume/[id]/page.tsx               # 香水详情页 server wrapper
  perfume/[id]/perfumeDetailClient.tsx# 香水详情页客户端交互

components/
  RecommendationDialog.tsx            # 推荐聊天弹窗
  PerfumeCard.tsx                     # 香水卡片组件
  PerfumeImage.tsx                    # 外部图片加载和兜底组件

services/
  perfumeAgent.ts                     # Gemini 推荐服务和 mock fallback
  schema.ts                           # LLM 结构化输出 Zod schema

types/
  index.ts                            # 业务类型定义

tests/
  backend/recommendation.backend.spec.ts # 后端/schema/API 测试
  e2e/recommendation.e2e.spec.ts         # Playwright 前端流程测试

.github/workflows/
  ci.yml                              # GitHub Actions CI
```

## 环境变量

本地开发可创建 `.env`：

```env
GOOGLE_API_KEY=你的_google_gemini_api_key
```

注意：

- 不要使用 `NEXT_PUBLIC_GOOGLE_API_KEY`。
- `GOOGLE_API_KEY` 只能在服务端读取，当前读取位置在 `services/perfumeAgent.ts`。
- 如果没有配置 `GOOGLE_API_KEY`，推荐服务会返回 mock 数据，方便本地和 CI 运行。

## 本地开发

安装依赖：

```bash
npm install
```

启动开发服务：

```bash
npm run dev
```

访问：

```text
http://localhost:3000
```

## 常用脚本

```bash
npm run dev
```

启动 Next.js 开发服务。

```bash
npm run lint
```

运行 ESLint。

```bash
npm run security:audit
```

运行 npm 依赖安全审计，检查 high 及以上级别漏洞。

```bash
npm run test:backend
```

运行后端测试，覆盖 schema、推荐服务 fallback 和 API 参数校验。

```bash
npm run test:e2e
```

运行 Playwright E2E 测试。该命令会启动本地 Next dev server。

```bash
npm test
```

依次运行后端测试和 E2E 测试。

```bash
npm run build
```

运行生产构建。

## Playwright 浏览器安装

首次运行 E2E 前需要安装 Chromium：

```bash
npx playwright install chromium
```

在 CI 中使用：

```bash
npx playwright install --with-deps chromium
```

## 推荐流程

1. 用户在首页点击“开始推荐”。
2. `RecommendationDialog` 打开聊天弹窗。
3. 用户输入自然语言需求。
4. 前端请求 `POST /api/recommend`。
5. `app/api/recommend/route.ts` 校验请求参数。
6. `services/perfumeAgent.ts` 调用 Gemini 生成推荐。
7. `services/schema.ts` 使用 Zod schema 约束结构化输出。
8. API 返回 `Perfume[]`。
9. 前端展示推荐卡片。
10. 点击卡片后，将香水对象写入 `sessionStorage` 并跳转详情页。
11. 详情页从 `sessionStorage` 读取香水信息并展示。

## 对话状态恢复

为了让用户从详情页返回时继续刚刚的推荐上下文，当前使用 `sessionStorage` 保存：

- `recommendationDialogOpen`
- `recommendationDialogMessages`
- `perfume:{id}`

行为说明：

- 点击推荐卡片进入详情页时，不清空对话。
- 详情页顶部“返回”按钮会跳转到 `/?recommendation=open`。
- 首页检测到该参数或 session 标记后自动打开推荐弹窗。
- 弹窗关闭按钮会清空对话记录。

## 图片兜底策略

LLM 返回的图片链接可能存在以下问题：

- 链接失效
- 403 防盗链
- 404
- 图片服务阻止跨站加载
- 返回的不是图片资源

因此项目统一使用 `components/PerfumeImage.tsx`：

- 优先加载 `perfume.imageUrl`
- 加载失败时显示本地渲染的香水瓶占位图
- 避免页面出现破图或空白区域

## API 说明

### `GET /api/recommend`

健康检查接口。

响应示例：

```json
{
  "success": true,
  "message": "Perfume recommendation API is running",
  "timestamp": "2026-06-13T00:00:00.000Z"
}
```

### `POST /api/recommend`

请求体：

```json
{
  "query": "推荐一款适合夏天通勤的男士香水",
  "count": 3
}
```

成功响应：

```json
{
  "success": true,
  "perfumes": [],
  "query": "推荐一款适合夏天通勤的男士香水",
  "timestamp": "2026-06-13T00:00:00.000Z"
}
```

错误响应：

```json
{
  "success": false,
  "error": "Invalid request",
  "message": "Query parameter is required and must be a string"
}
```

## 数据模型

核心类型定义在 `types/index.ts`：

```ts
interface Perfume {
  id: string;
  name: string;
  brand: string;
  description: string;
  imageUrl: string;
  price: number;
  currency: string;
  scentNotes: {
    top: string[];
    middle: string[];
    base: string[];
  };
  ingredientAnalysis: {
    mainIngredients: string[];
    naturalIngredients: boolean;
    syntheticIngredients: boolean;
    allergyInfo: string[];
    veganFriendly: boolean;
    crueltyFree: boolean;
  };
  purchaseOptions: PurchaseOption[];
  gender: "unisex" | "men" | "women";
  concentration: string;
  longevity: string;
  sillage: string;
}
```

LLM 输出必须匹配 `services/schema.ts` 中的 Zod schema，否则会进入 fallback。

## 测试

### 后端测试

文件：

```text
tests/backend/recommendation.backend.spec.ts
```

覆盖点：

- schema 接受正确的推荐结构
- schema 拒绝旧的错误字段结构
- `GOOGLE_API_KEY` 缺失时服务返回 mock 数据
- `POST /api/recommend` 能正确拒绝空 query

运行：

```bash
npm run test:backend
```

### 前端 E2E 测试

文件：

```text
tests/e2e/recommendation.e2e.spec.ts
```

覆盖点：

- 首页打开推荐弹窗
- 输入推荐需求
- mock `/api/recommend` 响应
- 展示推荐卡片
- 外部图片 404 时展示 fallback
- 点击卡片进入详情页
- 从详情页返回后恢复推荐弹窗和对话记录

运行：

```bash
npm run test:e2e
```

## CI/CD

GitHub Actions 配置文件：

```text
.github/workflows/ci.yml
.github/workflows/security.yml
```

触发条件：

- Pull Request
- Push 到 `main`
- Push 到 `master`

CI 步骤：

1. Checkout
2. Setup Node.js 24
3. `npm ci`
4. `npm run security:audit`，阻断 high 及以上级别依赖漏洞
5. `npx playwright install --with-deps chromium`
6. `npm run lint`
7. `npm run test:backend`
8. `npm run test:e2e`
9. `npm run build`
10. 失败时上传 Playwright traces/report

安全检查：

- CodeQL：对 TypeScript/JavaScript 代码执行静态安全扫描，覆盖 PR、main/master push 和每周定时任务。
- Dependency Review：在 PR 中审查依赖变更，新增 high 及以上级别风险时阻断合并。
- npm audit：在 CI 中阻断 high 及以上级别依赖漏洞；本地可通过 `npm run security:audit` 手动运行。

## Vercel 部署

在 Vercel 项目中配置环境变量：

```text
GOOGLE_API_KEY=你的_google_gemini_api_key
```

配置路径：

```text
Vercel Project -> Settings -> Environment Variables
```

建议至少启用：

- Production
- Preview

配置后需要重新部署，已部署版本不会自动读取新环境变量。

## 设计取舍

- 当前详情页数据来自 `sessionStorage`，适合 MVP 和短会话体验。后续如果要支持分享详情页、刷新后仍保留数据、SEO 或历史记录，应引入数据库或服务端查询。
- 当前图片不强依赖真实图片源，而是提供稳定 fallback。后续可以接入品牌官网、香水时代、Fragrantica 或自建图片缓存服务。
- 当前购买渠道和价格由模型生成，可信度有限。正式产品应接入真实电商/品牌数据源，并在 UI 中展示来源和更新时间。
- 当前 CI 不需要真实 `GOOGLE_API_KEY`，因为推荐服务会 fallback 到 mock 数据。真实 LLM 集成测试建议单独加可选 workflow，并使用 GitHub Secrets。

## 后续建议

- 增加真实香水资料源和引用来源字段。
- 将推荐结果持久化到数据库，支持详情页直接访问。
- 增加用户偏好画像，例如季节、预算、性别、场景、喜欢/不喜欢的香调。
- 增加推荐理由和相似香水。
- 增加错误监控和 API rate limit。
- 增加更完整的移动端视觉回归测试。
