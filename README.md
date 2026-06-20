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

## 修复 `99u.xyz` 的“不安全”提示

当前站点是 GitHub Pages 自定义域名。浏览器弹出“不安全”通常不是页面 JavaScript 造成的，而是 GitHub Pages 的 HTTPS 证书没有签发完成，或仓库 Pages 设置里没有开启 **Enforce HTTPS**。

请确认 DNS 记录如下：

- 裸域名 `99u.xyz` 添加 4 条 `A` 记录：
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`
- `www.99u.xyz` 添加 `CNAME` 记录，指向 `jcyx88.github.io`
- 仓库根目录保留 `CNAME` 文件，内容为 `99u.xyz`

然后打开仓库 **Settings → Pages**：

1. 在 **Custom domain** 填写 `99u.xyz` 并保存。
2. 等待 **DNS check successful**。
3. 等 GitHub 签发 TLS 证书后，勾选 **Enforce HTTPS**。
4. 再访问 `https://99u.xyz/`，应不再出现证书/不安全提示；访问 `http://99u.xyz/` 应自动跳转到 `https://99u.xyz/`。

页面里已经加入 `upgrade-insecure-requests` 和 `block-all-mixed-content`，用于在 HTTPS 生效后阻止混合内容问题。但证书错误发生在页面加载前，必须通过 GitHub Pages 设置里的 **Enforce HTTPS** 才能彻底解决。

## 你需要改的地方
- 精选展示的 10 个游戏：在 `assets/app.js` 里改 `FEATURED_GAMES` 数组即可。
- 点击复制的内容：在 `assets/app.js` 里改 `CLICK_COPY_TEXT`。

