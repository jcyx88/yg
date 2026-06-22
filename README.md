# 杨过游戏目录（GitHub Pages 部署版）

## 目录结构
- `index.html`：主页
- `assets/style.css`：样式
- `assets/app.js`：交互逻辑（可改“精选10个游戏”）
- `assets/images/complete-package-payment.png`：完整包主图，支持微信和支付宝，建议优先使用支付宝
- `assets/images/complete-package-backup-qr.png`：微信备用图，微信方式不稳定时使用
- `assets/images/experience-package.jpg`：基础体验包商品说明图
- `assets/images/experience-package-qr.jpg`：基础体验包购买位置二维码
- `data/games.json`：游戏目录
- `server.js`：本地/Node 托管时使用的咨询后端接口
- `weixin-qr.png` / `alipay-qr.png`：联系二维码图片（放在仓库根目录）

## 本地运行带咨询后端的版本

仓库不需要安装第三方依赖，电脑已安装 Node.js 后可直接运行：

```bash
npm start
```

默认访问：

```text
http://localhost:3000
```

前端咨询弹窗会请求 `POST /api/consult`。如果页面部署在 GitHub Pages 上，Pages 只能托管静态文件，不能运行 `server.js`；这种情况下咨询弹窗会自动使用前端兜底回复。要让真实后端生效，需要把这个仓库部署到支持 Node 的服务器或平台。

当前主推商品：

- 完整包：39 元，包含 6000+ 款游戏、资料整理、持续更新、快速检索、人工服务和 1 年售后
- 完整包购买后加入 QQ 群：`1080034594`
- 基础体验包：18 元，包含 30 款经典游戏体验内容，一次性提取，不包含售后
- 基础体验包购买后加入 QQ 群：`769014453`
- 主图支持微信和支付宝，建议优先使用支付宝；如微信方式不稳定，请使用备用图。

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

不要在 GitHub Pages 的 HTTPS 证书生效前强制升级页面子资源。如果站点仍通过 `http://99u.xyz/` 打开，过早升级会导致 CSS、JavaScript、JSON 和图片全部加载失败。

## 你需要改的地方
- 精选展示的 10 个游戏：在 `assets/app.js` 里改 `FEATURED_GAMES` 数组即可。
- 完整包 QQ 群、基础体验包 QQ 群、价格和操作提示：在 `assets/app.js` 里改 `CONTACT_TEXT`、`COMPLETE_GROUP`、`EXPERIENCE_GROUP`、`PACKAGE_PRICE`、`BACKUP_PAYMENT_TEXT`。
- 后端咨询回复规则：在 `server.js` 里改 `consultReply()`。

