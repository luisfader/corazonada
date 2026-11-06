// Reproductor de Antitango (mismo que Proyecto R): lista de canciones con la letra desplegable debajo de cada una.
(function () {
  const list = window.CANCIONES || [];
  const $ = (id) => document.getElementById(id);
  const audio = $("audio");
  let current = -1;

  const fmt = (s) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60), r = Math.floor(s % 60);
    return m + ":" + String(r).padStart(2, "0");
  };
  const secs = (t) => { const [m, s] = String(t || "0:0").split(":").map(Number); return m * 60 + (s || 0); };
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // Datos del disco
  const total = list.reduce((a, c) => a + secs(c.duracion), 0);
  const grabadas = list.filter((c) => c.audio !== false).length;
  $("albumMeta").textContent = list.length + (list.length === 1 ? " canción" : " canciones") + (total ? " · " + Math.round(total / 60) + " min" : "");
  if (!grabadas) $("playAll").hidden = true;

  $("tracks").innerHTML = list.map((c, i) => `
    <li class="track" data-i="${i}">
      <div class="trow">
        <button class="tplay" type="button" aria-label="Escuchar ${esc(c.titulo)}"><span class="tnum">${i + 1}</span><span class="ticon">▶</span></button>
        <div class="tmeta">
          <span class="ttitle">${esc(c.titulo)}</span>
          <span class="tscene">${esc(c.escena || "")}</span>
        </div>
        <button class="tlyr" type="button" aria-expanded="false">Letra</button>
        <span class="tdur">${c.audio === false ? "pronto" : esc(c.duracion || "")}</span>
      </div>
      <div class="tbody" hidden>
        ${c.nota ? `<p class="tnote">${esc(c.nota)}</p>` : ""}
        <div class="lyrics-body"><p class="muted">Cargando la letra…</p></div>
      </div>
    </li>`).join("");

  const items = [...document.querySelectorAll(".track")];
  const loaded = {};

  // Letra: se quitan las indicaciones de producción («— rap rápido…») y las partes sin texto (intro, breakdown, fin).
  async function loadLyrics(i) {
    if (loaded[i]) return;
    loaded[i] = true;
    const box = items[i].querySelector(".lyrics-body");
    let html = '<p class="muted">La letra llega pronto.</p>';
    try {
      const r = await fetch("letras/" + list[i].id + ".md");
      if (r.ok) {
        const txt = (await r.text()).replace(/<!--[\s\S]*?-->/g, "").replace(/^#.*$/m, "").trim();
        const parts = txt.split(/\n\s*\n/).map((st) => {
          const lines = st.split("\n").map((l) => l.trim()).filter(Boolean);
          let label = "";
          const m = lines[0] && lines[0].match(/^\[(.+)\]$/);
          if (m) { lines.shift(); label = m[1].split(/\s+[—–-]\s+/)[0].trim(); }
          const text = lines.filter((l) => !/^\*?\(.*\)\*?$/.test(l));
          if (!text.length) return "";
          const chorus = /^(estribillo|coro)/i.test(label);
          const body = text.map(esc).join("<br>").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>");
          return `<p class="${chorus ? "chorus" : ""}">${label ? `<span class="label">${esc(label)}</span>` : ""}${body}</p>`;
        }).join("");
        if (parts) html = parts;
      }
    } catch (e) { /* abierto como archivo */ }
    box.innerHTML = html;
  }

  function openLyrics(i, open) {
    const li = items[i];
    const body = li.querySelector(".tbody");
    const show = open === undefined ? body.hidden : open;
    body.hidden = !show;
    li.classList.toggle("open", show);
    li.querySelector(".tlyr").setAttribute("aria-expanded", String(show));
    li.querySelector(".tlyr").textContent = show ? "Cerrar" : "Letra";
    if (show) loadLyrics(i);
  }

  function play(i) {
    if (i < 0 || i >= list.length) return;
    const c = list[i];
    if (i !== current) {
      if (current >= 0) openLyrics(current, false);
      current = i;
      if (c.audio === false) { audio.pause(); audio.removeAttribute("src"); }
      else audio.src = "audio/" + c.id + ".mp3";
      openLyrics(i, true);
      items[i].scrollIntoView({ behavior: "smooth", block: "start" });
    }
    $("player").hidden = false;
    $("nowTitle").textContent = c.titulo;
    const A = window.ALBUM || {};
    $("nowSub").textContent = c.audio === false ? (A.banda || "") + " · grabación pronto" : (A.banda || "") + " · «" + (A.disco || "") + "»";
    if (c.audio !== false) audio.play();
    sync();
  }

  const next = (from) => { let n = from + 1; while (n < list.length && list[n].audio === false) n++; return n; };

  function sync() {
    const playing = !audio.paused;
    document.body.classList.toggle("is-playing", playing);
    $("toggle").textContent = playing ? "⏸" : "▶";
    $("toggle").setAttribute("aria-label", playing ? "Pausar" : "Reproducir");
    items.forEach((el, i) => {
      el.classList.toggle("active", i === current);
      el.classList.toggle("playing", i === current && playing);
      el.querySelector(".ticon").textContent = i === current && playing ? "⏸" : "▶";
    });
  }

  $("tracks").addEventListener("click", (e) => {
    const li = e.target.closest(".track");
    if (!li) return;
    const i = Number(li.dataset.i);
    if (e.target.closest(".tlyr")) { openLyrics(i); return; }
    if (e.target.closest(".tbody")) return;
    if (i === current && !audio.paused) audio.pause(); else play(i);
  });
  $("playAll").addEventListener("click", () => play(next(-1)));
  $("toggle").addEventListener("click", () => (audio.paused ? play(current < 0 ? next(-1) : current) : audio.pause()));
  $("prev").addEventListener("click", () => (audio.currentTime > 3 ? (audio.currentTime = 0) : play(Math.max(0, current - 1))));
  $("next").addEventListener("click", () => play(next(current)));
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && current >= 0 && !/INPUT|BUTTON|TEXTAREA/.test(e.target.tagName)) {
      e.preventDefault(); audio.paused ? play(current) : audio.pause();
    }
  });

  audio.addEventListener("play", sync);
  audio.addEventListener("pause", sync);
  audio.addEventListener("ended", () => { const n = next(current); if (n < list.length) play(n); else sync(); });
  audio.addEventListener("timeupdate", () => {
    $("time").textContent = fmt(audio.currentTime) + " / " + fmt(audio.duration);
    if (audio.duration) $("seek").value = (audio.currentTime / audio.duration) * 100;
  });
  $("seek").addEventListener("input", (e) => {
    if (audio.duration) audio.currentTime = (e.target.value / 100) * audio.duration;
  });
})();
