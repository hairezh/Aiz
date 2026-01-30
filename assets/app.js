async function loadSkins(){
  const grid = document.getElementById("skinsGrid");
  if(!grid) return;

  try{
    const res = await fetch("data/skins.json", { cache: "no-store" });
    if(!res.ok) throw new Error(`HTTP ${res.status}`);

    const skins = await res.json();

    grid.innerHTML = skins.map((s, idx) => {
      const previews = Array.isArray(s.previews) ? s.previews.filter(Boolean) : [];
      const first = previews[0] || s.thumb || ""; // fallback

      return `
        <div class="card">
          <img
            class="thumb js-preview"
            src="${escapeAttr(first)}"
            alt=""
            data-skin="${idx}"
            data-i="0"
          >
          <div class="cardBody">
            <div class="cardTitle">${escapeHtml(s.name || "Untitled")}</div>

            <div class="meta">
              <span>Mode: ${escapeHtml(s.mode || "-")}</span>
              <span>Made: ${escapeHtml(s.made || "-")}</span>
            </div>

            <div class="cardActions">
              <a class="small" href="${escapeAttr(s.download || "#")}" download>Download</a>
            </div>
          </div>
        </div>
      `;
    }).join("");

    // Click to cycle previews
    grid.addEventListener("click", (e) => {
      const img = e.target.closest(".js-preview");
      if(!img) return;

      const skinIndex = Number(img.dataset.skin);
      const skinsData = skins[skinIndex];
      const previews = Array.isArray(skinsData?.previews) ? skinsData.previews.filter(Boolean) : [];

      // If no previews array, do nothing
      if(previews.length <= 1) return;

      const current = Number(img.dataset.i || 0);
      const next = (current + 1) % Math.min(4, previews.length);

      img.dataset.i = String(next);
      img.src = previews[next];
    });

  }catch(e){
    grid.innerHTML = `<div class="mini">Couldn’t load skins.json</div>`;
  }
}

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[m]));
}
function escapeAttr(str){ return escapeHtml(str); }

loadSkins();
