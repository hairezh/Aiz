async function loadSkins(){
  const grid = document.getElementById("skinsGrid");
  if(!grid) return;

  try{
    const res = await fetch("data/skins.json", { cache: "no-store" });
    if(!res.ok) throw new Error(`HTTP ${res.status}`);

    const skins = await res.json();

    grid.innerHTML = skins.map(s => `
      <div class="card">
        <img class="thumb" src="${escapeAttr(s.thumb || "")}" alt="">
        <div class="cardBody">
          <div class="cardTitle">${escapeHtml(s.name || "Untitled")}</div>

          <div class="meta">
            <span>Mode: ${escapeHtml(s.mode || "-")}</span>
            <span>Made: ${escapeHtml(s.made || "-")}</span>
          </div>

          <div class="cardActions">
            <a class="small" href="${escapeAttr(s.download || "#")}" download>
              Download
            </a>
          </div>
        </div>
      </div>
    `).join("");

  }catch(e){
    grid.innerHTML = `<div class="mini">Couldn’t load skins.json</div>`;
  }
}

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, m => ({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#39;"
  }[m]));
}
function escapeAttr(str){ return escapeHtml(str); }

loadSkins();
