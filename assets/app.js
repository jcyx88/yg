const FEATURED_GAMES = [
  "亚洲之子：东方之乡",
  "极品采花郎",
  "特工17v25.9",
  "美德v17",
  "凤凰v15.2",
  "永恒世界0.95",
  "麻豆：爱的初体验",
  "隔壁的美艳人妻",
  "我的幸福人生ver1.7",
  "日不落帝国"
];

const CONTACT_TEXT = "完整包 QQ 群：1080034594";
const COMPLETE_GROUP = "1080034594";
const EXPERIENCE_GROUP = "769014453";
const PACKAGE_NAME = "完整包";
const PACKAGE_PRICE = "¥39.00";
const BACKUP_PAYMENT_TEXT = "主支付码支持微信和支付宝，建议优先使用支付宝；微信付款失败后请扫微信备用支付图。";
const COMPLETE_PACKAGE_SUMMARY = "39 元完整包包含 6000+ 款游戏、资料整理、持续更新、快速检索、人工服务和 1 年售后。";
const EXPERIENCE_PACKAGE_SUMMARY = `基础体验包 18 元包含 30 款经典游戏体验内容，一次性提取，不包含售后，QQ群 ${EXPERIENCE_GROUP}。`;

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

let ALL_GAMES = [];
let ALL_GAMES_SET = new Set();
let lastFocusedElement = null;

function normalize(value){
  return (value || "").toString().trim().toLowerCase();
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

function showToast(msg){
  const toast = $("#toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove("show"), 1600);
}

async function copyToClipboard(text){
  try{
    await navigator.clipboard.writeText(text);
    return true;
  }catch(_error){
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    try{
      const ok = document.execCommand("copy");
      document.body.removeChild(textarea);
      return ok;
    }catch(error){
      document.body.removeChild(textarea);
      return false;
    }
  }
}

function selectedGameName(){
  return $("#gameSelect")?.value || "";
}

function renderFeatured(){
  const list = $("#gameList");
  list.innerHTML = "";

  FEATURED_GAMES.forEach((name, idx) => {
    const exists = ALL_GAMES_SET.has(name);
    const imgSrc = `assets/images/games/game${idx + 1}.jpg`;
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <img class="game-thumb" src="${imgSrc}" alt="${escapeHtml(name)}游戏封面图" loading="lazy" onerror="this.style.display='none'" />
      <div class="card-body">
        <span class="game-tag">${exists ? "目录内" : "可咨询"}</span>
        <h3>${escapeHtml(name)}</h3>
        <p>咨询资料版本、领取方式，以及完整包是否包含该游戏。</p>
        <div class="card-actions">
          <button class="btn secondary" type="button" data-copy-game="${escapeHtml(name)}">复制咨询</button>
          <button class="btn primary js-consult" type="button" data-topic="我想咨询 ${escapeHtml(name)} 的商品情况">咨询</button>
        </div>
      </div>
    `;
    list.appendChild(card);
  });

  $$("[data-copy-game]").forEach((button) => {
    button.addEventListener("click", async () => {
      const name = button.getAttribute("data-copy-game");
      const text = `${CONTACT_TEXT}\n基础体验包 QQ 群：${EXPERIENCE_GROUP}\n我想咨询游戏：${name}\n${COMPLETE_PACKAGE_SUMMARY}\n${EXPERIENCE_PACKAGE_SUMMARY}\n${BACKUP_PAYMENT_TEXT}`;
      const ok = await copyToClipboard(text);
      showToast(ok ? "已复制咨询信息" : "复制失败，请手动复制 QQ 群号");
    });
  });

  wireConsultButtons();
}

function populateSelect(games){
  const select = $("#gameSelect");
  select.innerHTML = `<option value="" selected>选择游戏进行搜索</option>`;
  const fragment = document.createDocumentFragment();

  games.forEach((game) => {
    const option = document.createElement("option");
    option.value = game;
    option.textContent = game;
    fragment.appendChild(option);
  });

  select.appendChild(fragment);
}

function applyKeywordFilter(){
  const keyword = normalize($("#keyword").value);
  if(!keyword){
    populateSelect(ALL_GAMES);
    return;
  }

  const filtered = ALL_GAMES.filter((game) => normalize(game).includes(keyword));
  populateSelect(filtered);
}

function fallbackConsultReply(message){
  const text = normalize(message);
  const isExperienceInquiry = text.includes("基础") || text.includes("体验包") || text.includes("18") || text.includes(EXPERIENCE_GROUP);

  if(isExperienceInquiry){
    return `${EXPERIENCE_PACKAGE_SUMMARY}付款后请加入 QQ 群 ${EXPERIENCE_GROUP} 领取。`;
  }

  if(text.includes("微信") || text.includes("失败") || text.includes("付款") || text.includes("支付") || text.includes("支付宝") || text.includes("银行卡") || text.includes("备用")){
    return `完整包主支付码支持微信和支付宝，建议优先使用支付宝；如果微信付款失败，请扫页面中的“微信备用支付图”。付款后请加入 QQ 群 ${COMPLETE_GROUP} 领取。`;
  }

  if(text.includes("群") || text.includes("领取") || text.includes("qq")){
    return `购买完整包后请加入 QQ 群 ${COMPLETE_GROUP}，群内人工核验后提供完整资料、下载说明、安装教程和持续更新提醒，并享受 1 年售后服务。`;
  }

  if(text.includes("购买") || text.includes("位置") || text.includes("扫码") || text.includes("哪里")){
    return `请在页面标注“付款后进QQ群${COMPLETE_GROUP}”的区域扫码付款，价格为 ${PACKAGE_PRICE}。建议优先使用支付宝；微信失败后扫备用支付图。付款后请加入 QQ 群 ${COMPLETE_GROUP}。`;
  }

  if(text.includes("内容") || text.includes("包含") || text.includes("资料")){
    return `${COMPLETE_PACKAGE_SUMMARY}${EXPERIENCE_PACKAGE_SUMMARY}`;
  }

  if(text.includes("价格") || text.includes("多少钱") || text.includes("39") || text.includes("18")){
    return `${COMPLETE_PACKAGE_SUMMARY}${EXPERIENCE_PACKAGE_SUMMARY}`;
  }

  const game = selectedGameName();
  return `可以咨询完整包内容、完整包QQ群${COMPLETE_GROUP}、基础体验包QQ群${EXPERIENCE_GROUP}、微信失败后的备用支付图，以及具体游戏的资料版本和更新情况。${game ? `你当前选择的是「${game}」，可以直接询问它的版本和领取方式。` : "也可以先在下拉框选择一个游戏再咨询。"}`;
}

function renderMessage(role, text){
  const messages = $("#chatMessages");
  const row = document.createElement("div");
  row.className = `message ${role}`;
  row.innerHTML = `<div class="bubble">${escapeHtml(text)}</div>`;
  messages.appendChild(row);
  messages.scrollTop = messages.scrollHeight;
}

function setChatLoading(isLoading){
  const form = $("#chatForm");
  const button = form.querySelector("button[type='submit']");
  button.disabled = isLoading;
  button.textContent = isLoading ? "发送中" : "发送";
}

async function askBackend(message){
  const response = await fetch("/api/consult", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({
      message,
      selectedGame:selectedGameName(),
      packageName:PACKAGE_NAME,
      packagePrice:PACKAGE_PRICE
    })
  });

  if(!response.ok){
    throw new Error("consult request failed");
  }

  const data = await response.json();
  return data.reply || fallbackConsultReply(message);
}

async function sendConsultMessage(message){
  const clean = message.trim();
  if(!clean) return;

  renderMessage("user", clean);
  setChatLoading(true);

  try{
    const reply = await askBackend(clean);
    renderMessage("assistant", reply);
  }catch(_error){
    renderMessage("assistant", fallbackConsultReply(clean));
  }finally{
    setChatLoading(false);
  }
}

function openChat(prefill = ""){
  const modal = $("#chatModal");
  const input = $("#chatInput");
  lastFocusedElement = document.activeElement;
  modal.hidden = false;
  document.body.classList.add("chat-open");

  if(!$("#chatMessages").children.length){
    renderMessage("assistant", `你好，我可以帮你了解${PACKAGE_NAME}内容、${PACKAGE_PRICE}付款方式、完整包QQ群${COMPLETE_GROUP}、基础体验包QQ群${EXPERIENCE_GROUP}。${COMPLETE_PACKAGE_SUMMARY}${EXPERIENCE_PACKAGE_SUMMARY}建议优先使用支付宝；微信付款失败后，请扫微信备用支付图。`);
  }

  if(prefill){
    input.value = prefill;
  }

  setTimeout(() => input.focus(), 0);
}

function closeChat(){
  $("#chatModal").hidden = true;
  document.body.classList.remove("chat-open");
  if(lastFocusedElement && typeof lastFocusedElement.focus === "function"){
    lastFocusedElement.focus();
  }
}

function wireConsultButtons(){
  $$(".js-consult").forEach((button) => {
    if(button.dataset.boundConsult === "true") return;
    button.dataset.boundConsult = "true";
    button.addEventListener("click", () => {
      openChat(button.getAttribute("data-topic") || "");
    });
  });
}

function wireChat(){
  $("#closeChatBtn").addEventListener("click", closeChat);
  $("[data-close-chat]").addEventListener("click", closeChat);

  $("#chatForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = $("#chatInput");
    const message = input.value;
    input.value = "";
    await sendConsultMessage(message);
  });

  $$(".quick-replies button").forEach((button) => {
    button.addEventListener("click", () => {
      sendConsultMessage(button.getAttribute("data-question") || button.textContent);
    });
  });

  document.addEventListener("keydown", (event) => {
    if(event.key === "Escape" && !$("#chatModal").hidden){
      closeChat();
    }
  });
}

function wireEvents(){
  $("#keyword").addEventListener("input", () => {
    clearTimeout(wireEvents._timer);
    wireEvents._timer = setTimeout(applyKeywordFilter, 90);
  });

  $("#resetBtn").addEventListener("click", () => {
    $("#keyword").value = "";
    $("#gameSelect").value = "";
    populateSelect(ALL_GAMES);
    showToast("已重置筛选");
  });

  $("#gameSelect").addEventListener("change", async () => {
    const name = selectedGameName();
    if(!name) return;
    const ok = await copyToClipboard(`${CONTACT_TEXT}\n基础体验包 QQ 群：${EXPERIENCE_GROUP}\n我想咨询游戏：${name}\n${PACKAGE_NAME}：${PACKAGE_PRICE}\n${EXPERIENCE_PACKAGE_SUMMARY}\n${BACKUP_PAYMENT_TEXT}`);
    showToast(ok ? "已复制所选游戏咨询信息" : "复制失败，请手动复制 QQ 群号");
  });

  $("#copyGroupBtn").addEventListener("click", async () => {
    const ok = await copyToClipboard(COMPLETE_GROUP);
    showToast(ok ? "已复制 QQ 群号" : `复制失败，请手动复制 ${COMPLETE_GROUP}`);
  });

  wireConsultButtons();
  wireChat();
}

async function boot(){
  try{
    const response = await fetch("./data/games.json", { cache:"force-cache" });
    ALL_GAMES = await response.json();
    ALL_GAMES_SET = new Set(ALL_GAMES);
    $("#totalCount").textContent = String(ALL_GAMES.length);
    populateSelect(ALL_GAMES);
    renderFeatured();
    wireEvents();
  }catch(error){
    console.error(error);
    $("#totalCount").textContent = "加载失败";
    showToast("games.json 加载失败，请确认 data/games.json 已上传到仓库");
  }
}

boot();
