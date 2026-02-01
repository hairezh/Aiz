async function loadSkins(){
  const grid = document.getElementById("skinsGrid");
  if(!grid) return;

  try{
    const res = await fetch("data/skins.json", { cache: "no-store" });
    if(!res.ok) throw new Error(`HTTP ${res.status}`);

    const skins = await res.json();

    grid.innerHTML = skins.map((s, idx) => {
      const previews = Array.isArray(s.previews) ? s.previews.filter(Boolean).slice(0,4) : [];
      const first = previews[0] || s.thumb || "";

      const dots = previews.map((_, i) =>
        `<div class="previewDot ${i === 0 ? "active" : ""}" data-i="${i}"></div>`
      ).join("");

      return `
        <div class="card">
          <div class="previewWrap">
            <img
              class="thumb js-preview"
              src="${escapeAttr(first)}"
              alt=""
              data-skin="${idx}"
              data-i="0"
            >
            ${previews.length > 1 ? `
              <div class="previewArrow left" data-dir="-1">◀</div>
              <div class="previewArrow right" data-dir="1">▶</div>
            ` : ``}
          </div>

          <div class="cardBody">
            <div class="cardTitle">${escapeHtml(s.name || "Untitled")}</div>

            <div class="cardActions">
              <a class="small" href="${escapeAttr(s.download || "#")}" download>Download</a>
            </div>
          </div>
        </div>
      `;
    }).join("");

    function setPreview(img, targetIndex){
      const skinIndex = Number(img.dataset.skin);
      const s = skins[skinIndex];
      const previews = Array.isArray(s?.previews) ? s.previews.filter(Boolean).slice(0,4) : [];

      if(previews.length === 0) return;

      const i = ((targetIndex % previews.length) + previews.length) % previews.length;
      img.dataset.i = String(i);
      img.src = previews[i];

      const wrap = img.closest(".previewWrap");
      const dots = wrap?.querySelectorAll(".previewDot") || [];
      dots.forEach(d => d.classList.toggle("active", Number(d.dataset.i) === i));
    }

    // One listener for everything (image click, arrows, dots)
    grid.addEventListener("click", (e) => {
      const arrow = e.target.closest(".previewArrow");
      const dot = e.target.closest(".previewDot");
      const img = e.target.closest(".js-preview");

      // If clicking arrow
      if(arrow){
        const wrap = arrow.closest(".previewWrap");
        const imgEl = wrap?.querySelector(".js-preview");
        if(!imgEl) return;

        const dir = Number(arrow.dataset.dir || 1);
        const current = Number(imgEl.dataset.i || 0);
        setPreview(imgEl, current + dir);
        return;
      }

      // If clicking dot
      if(dot){
        const wrap = dot.closest(".previewWrap");
        const imgEl = wrap?.querySelector(".js-preview");
        if(!imgEl) return;

        const target = Number(dot.dataset.i || 0);
        setPreview(imgEl, target);
        return;
      }

      // If clicking the image itself → next
      if(img){
        const current = Number(img.dataset.i || 0);
        setPreview(img, current + 1);
        return;
      }
    });

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
