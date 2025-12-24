// ====== 可自定义：中间区域展示的“精选游戏” ======
// 微信/支付宝均可付款，保存到手机扫码支付
const FEATURED_GAMES = [
  "亚洲之子：东方之乡",
  "极品采花郎",
  "特工17v25.9",
  "美德v17",
  "凤凰v15.2",
  "永恒世界0.86",
  "麻豆：爱的初体验",
  "隔壁的美艳人妻",
  "我的幸福人生ver1.7",
  "日不落帝国"
];

// ====== 可自定义：点击卡片时复制的“联系信息/口令/下载提示” ======
const CLICK_COPY_TEXT = "1061234049";

// ====== 工具函数 ======
const $ = (sel) => document.querySelector(sel);

function normalize(s){
  return (s || "").toString().trim().toLowerCase();
}

function showToast(msg){
  const toast = $("#toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 1400);
}

async function copyToClipboard(text){
  try{
    await navigator.clipboard.writeText(text);
    return true;
  }catch(_e){
    // 兼容老浏览器/非 https 的情况
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try{
      document.execCommand("copy");
      document.body.removeChild(ta);
      return true;
    }catch(e){
      document.body.removeChild(ta);
      return false;
    }
  }
}

// ====== 主逻辑 ======
let ALL_GAMES = [];

function renderFeatured(){
  const list = $("#gameList");
  list.innerHTML = "";
  FEATURED_GAMES.forEach((name, idx) => {
    const exists = ALL_GAMES_SET.has(name);
    // 约定：第 1~10 个精选游戏对应 assets/images/games/game1.jpg ~ game10.jpg
    const imgSrc = `assets/images/games/game${idx + 1}.jpg`;
    const card = document.createElement("article");
    card.className = "card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `复制联系信息：${name}`);
    card.innerHTML = `
      <img class="game-thumb" src="${imgSrc}" alt="${escapeHtml(name)}" loading="lazy" onerror="this.style.display='none'" />
      <h3>${escapeHtml(name)}</h3>
      <p>${exists ? "已收录（点击复制联系方式）" : "已收录（点击复制联系方式）"}</p>
    `;
    const onClick = async () => {
      const ok = await copyToClipboard(CLICK_COPY_TEXT);
      showToast(ok ? "已复制到剪贴板 ✅" : "复制失败：请手动复制QQ群 1061234049");
    };
    card.addEventListener("click", onClick);
    card.addEventListener("keydown", (e) => {
      if(e.key === "Enter" || e.key === " "){
        e.preventDefault();
        onClick();
      }
    });
    list.appendChild(card);
  });
}

function escapeHtml(str){
  return (str || "").replace(/[&<>"']/g, (m) => ({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#39;"
  }[m]));
}

function populateSelect(games){
  const sel = $("#gameSelect");
  sel.innerHTML = `<option value="" selected>选择游戏进行搜索</option>`;
  const frag = document.createDocumentFragment();
  games.forEach((g) => {
    const opt = document.createElement("option");
    opt.value = g;
    opt.textContent = g;
    frag.appendChild(opt);
  });
  sel.appendChild(frag);
}

function applyKeywordFilter(){
  const kw = normalize($("#keyword").value);
  if(!kw){
    populateSelect(ALL_GAMES);
    return;
  }
  const filtered = ALL_GAMES.filter((g) => normalize(g).includes(kw));
  populateSelect(filtered);
}

let ALL_GAMES_SET = new Set();

function wireEvents(){
  $("#keyword").addEventListener("input", () => {
    // 轻量防抖
    clearTimeout(wireEvents._t);
    wireEvents._t = setTimeout(applyKeywordFilter, 80);
  });

  $("#resetBtn").addEventListener("click", () => {
    $("#keyword").value = "";
    $("#gameSelect").value = "";
    populateSelect(ALL_GAMES);
    showToast("已重置 ✅");
  });

  $("#gameSelect").addEventListener("change", async () => {
    const name = $("#gameSelect").value;
    if(!name) return;
    const ok = await copyToClipboard(`${CLICK_COPY_TEXT}\n你选择的游戏：${name}`);
    showToast(ok ? "已复制（含游戏名）✅" : "复制失败：请手动复制QQ群 1061234049");
  });

  $("#copyBtn").addEventListener("click", async () => {
    const ok = await copyToClipboard(CLICK_COPY_TEXT);
    showToast(ok ? "已复制联系方式 ✅" : "复制失败：QQ群 1061234049");
  });

  $("#toTopBtn").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

async function boot(){
  try{
    const res = await fetch("./data/games.json", { cache: "force-cache" });
    ALL_GAMES = await res.json();
    ALL_GAMES_SET = new Set(ALL_GAMES);
    $("#totalCount").textContent = String(ALL_GAMES.length);

    populateSelect(ALL_GAMES);
    renderFeatured();
    wireEvents();
  }catch(e){
    console.error(e);
    $("#totalCount").textContent = "加载失败";
    showToast("games.json 加载失败：请确认 data/games.json 已上传到仓库");
  }
}

boot();
