# 杨过游戏中心（GitHub Pages 部署版）

## 目录结构
- `index.html`：主页
- `assets/style.css`：样式
- `assets/app.js`：交互逻辑（可改“精选10个游戏”）
- `data/games.json`：全量游戏库（由原 HTML 的 `GAMES` 数组拆出来）
- `weixin-qr.png` / `alipay-qr.png`：你的二维码图片（放在仓库根目录）

## 部署到 GitHub Pages（项目站点）
1. 新建仓库（或用现有仓库），把以上文件按目录上传到仓库根目录。
2. 打开仓库 **Settings → Pages**
3. **Build and deployment**
   - Source：选择 **Deploy from a branch**
   - Branch：选择 `main`（或 `master`）和 `/ (root)`
4. 保存后，Pages 会给你一个网址。

> 注意：页面里的资源全部使用相对路径（例如 `./assets/...`、`./data/...`），适配“项目站点 /repo/”这种路径。

## 你需要改的地方
- 精选展示的 10 个游戏：在 `assets/app.js` 里改 `FEATURED_GAMES` 数组即可。
- 点击复制的内容：在 `assets/app.js` 里改 `CLICK_COPY_TEXT`。

