# NES 网页模拟器

基于 [jsnes](https://github.com/bfirsh/jsnes) 的浏览器 NES 模拟器：游戏库列表 + 单游戏游玩页，使用 React、TypeScript 与 Vite 构建。

## 技术栈

- React 19、TypeScript、Vite 8  
- 路由：`react-router-dom`  
- 模拟器：`jsnes`（`Browser` API，画布与音频由库处理）  
- 图标：`lucide-react`

## 本地运行

需要 Node.js（建议当前 LTS）。

```bash
npm install
npm run dev
```

浏览器访问终端里提示的本地地址（一般为 `http://localhost:5173`）。

```bash
npm run build    # 生产构建
npm run preview  # 预览构建结果
npm run lint     # ESLint
```

## 游戏库配置

在 `src/data/roms.ts` 中维护列表项：`id`、`title`、`cover`（封面图 URL）、`romUrl`（ROM 地址）。

- **本地资源**：将文件放在 `public/` 下，使用以 `/` 开头的路径，例如 `/roms/foo.nes`、`/covers/foo.png`。  
- **网络地址**：封面与 ROM 均可使用 `https://...`。ROM 若跨域加载，需资源服务器返回正确的 CORS，否则浏览器会拦截请求。

请仅使用你有权使用的 ROM（例如自有卡带备份）；本项目不包含任何商业游戏 ROM。

## 目录说明（节选）

| 路径 | 说明 |
|------|------|
| `src/data/roms.ts` | 游戏列表与 ROM / 封面地址 |
| `src/pages/RomList.tsx` | 游戏库页 |
| `src/pages/GamePage.tsx` | 游玩页，挂载 jsnes 容器 |
| `public/roms/` | 可选：本地 `.nes` 放置位置 |
| `public/covers/` | 可选：封面图 |

## 模拟器说明

画面由 jsnes 在页面中的容器节点内创建 `<canvas>`，内部分辨率为 NES 的 256×240，显示尺寸随容器通过库的 `fitInParent()` 缩放。游玩页使用 `ResizeObserver` 在容器尺寸变化时重新适配。

## 许可证

应用代码以你仓库为准。依赖 [jsnes](https://github.com/bfirsh/jsnes) 为 Apache-2.0，使用时请遵守其许可证。
