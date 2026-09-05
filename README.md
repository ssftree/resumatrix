# Terminal Portfolio

一个由 React + Vite 构建的交互式开发者作品集。同一份履历数据可以切换为 Terminal、Cloud IDE、Bento Grid、Retro OS、Telemetry、Swiss Brutalism 和 Academic CV 七种展示形式。

## 预览

| Terminal | Bento Grid | Telemetry |
| --- | --- | --- |
| ![Terminal 模板截图](./public/assets/screenshots/terminal.png) | ![Bento Grid 模板截图](./public/assets/screenshots/bento.png) | ![Telemetry 模板截图](./public/assets/screenshots/telemetry.png) |

## 功能概览

- 可交互终端：命令历史、补全、虚拟文件系统、项目详情和多套主题
- 七种作品集模板，通过顶部切换器即时切换
- 浏览器内资料编辑器，支持预设、实时保存及 JSON 导入/导出
- 简历查看与浏览器打印/PDF
- CRT、Matrix、机械键盘音效和分栏预览等增强效果
- 面向桌面与移动设备的响应式布局

## 本地运行

需要 Node.js 20 或更高版本。

```bash
npm install
npm run dev
```

开发服务器默认使用 `http://localhost:3000`；端口被占用时 Vite 会自动选择下一个可用端口。

当前应用完全运行在浏览器中，不需要 API key，也不需要环境变量；`.env.example` 仅保留这一约定的说明。

## 常用命令

```bash
npm run dev      # 启动开发服务器
npm run lint     # TypeScript 静态检查
npm test         # 运行 Vitest 回归测试
npm run build    # 生成生产构建到 dist/
npm run preview  # 本地预览生产构建
npm run clean    # 删除生成的 dist/ 和 server.js
```

自动化测试覆盖配置恢复、跨模板数据一致性、外链、弹窗键盘行为、全屏同步、终端路径和 favicon。修改视觉交互后仍应配合真实浏览器验证。

## 定制作品集

推荐直接修改 `src/portfolio.config.ts` 中的 `DEFAULT_PORTFOLIO_CONFIG`，它是部署时默认资料的唯一来源。主要字段包括：

- `profile`：姓名、标题、简介、状态和关键指标
- `contact`：邮箱、GitHub、LinkedIn、X、博客和位置
- `skills`：技能分组与熟练度
- `experience`：任职经历与成果
- `projects`：项目、标签、链接和亮点
- `education`：教育背景
- `system`：终端和 Telemetry 模板使用的模拟系统信息

页面右上角的 **Customize** 会把编辑结果保存到当前浏览器的 `localStorage`，键名为 `portfolio_config_v2`。这适合预览或个人浏览器持久化，但不会修改源码。

JSON 下载文件目前只是备份/迁移格式。将 `portfolio.config.json` 放到仓库根目录不会自动参与构建；如需修改线上默认内容，仍需更新 `src/portfolio.config.ts`。

如果本地配置导致页面异常，可在浏览器控制台清除它：

```js
localStorage.removeItem('portfolio_config_v2');
location.reload();
```

## 终端体验

输入 `help` 查看完整命令。常用命令包括：

```text
about                 个人简介
skills                技术能力
projects              项目列表
project <id|name>     项目详情
exp                    工作经历
contact                联系方式
resume                 打开简历
ls / cat / cd / pwd   浏览虚拟文件系统
theme <name>           切换终端主题
template <name>        切换展示模板
matrix / crt / sound   切换增强效果
config                 打开资料编辑器
```

终端提供 `Tab` 补全、上下方向键历史、`Ctrl+L` 清屏和 `Ctrl+C` 清除当前输入。

## 项目结构

```text
src/
├── App.tsx                         全局状态与终端命令路由
├── portfolio.config.ts             默认资料与预设
├── types.ts                        领域类型
├── components/
│   ├── templates/                  七套展示模板
│   ├── ConfigCustomizerModal.tsx   资料编辑与导入导出
│   ├── ResumeModal.tsx             简历弹窗
│   └── Terminal*.tsx               终端界面
├── data/portfolioData.ts           ASCII/虚拟文件系统及待迁移旧数据
└── utils/                          配置校验、URL 安全处理、主题和程序化音效
```

架构、数据流、设计约束及已知缺口详见 [DESIGN.md](./DESIGN.md)。开发代理约定见 [AGENTS.md](./AGENTS.md) 与 [CLAUDE.md](./CLAUDE.md)。

## 构建与部署

```bash
npm run build
```

将 `dist/` 部署到任意静态托管服务即可。站点没有客户端路由，因此不需要额外的 SPA rewrite 规则。

上线前建议补充：

- Open Graph/Twitter 分享图片及对应 meta 标签
- 真实域名的 canonical URL
- 对 `src/portfolio.config.ts` 中示例资料和外链的逐项核验

## 当前技术债务

虚拟文件系统中的个人资料文本仍是静态 fixture，终端命令元数据分布在三个文件中，Retro 窗口交互与打印结果尚缺完整自动化覆盖。边界与后续方向详见 `DESIGN.md`。
