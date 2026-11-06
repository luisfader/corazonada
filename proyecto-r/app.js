// Reproductor de Proyecto R: lista de canciones con la letra desplegable debajo de cada una.
// Idiomas: español (original), ruso e inglés. Las letras traducidas están en letras/ru/ y letras/en/.
(function () {
  const list = window.CANCIONES || [];
  const TR = window.TRADUCCIONES || {};
  const LANGS = ["es", "ru", "en"];
  const $ = (id) => document.getElementById(id);
  const audio = $("audio");
  let current = -1;

  const UI = {
    es: {
      eyebrow: "Disco · Proyecto R", genre: "Rap apocalíptico · Argentina", playAll: "▶ Escuchar el disco",
      back: "← Las canciones de Natalia", song: "canción", songs: "canciones", min: "min",
      lyrics: "Letra", close: "Cerrar", soon: "pronto", loading: "Cargando la letra…", noLyrics: "La letra llega pronto.",
      listen: "Escuchar", prev: "Anterior", next: "Siguiente", play: "Reproducir", pause: "Pausar", seek: "Posición",
      nowAlbum: "Proyecto R · «Nuestra Utopía»", nowSoon: "Proyecto R · grabación pronto",
      albumTr: "", showOriginal: "", showTranslation: ""
    },
    ru: {
      eyebrow: "Альбом · Proyecto R", genre: "Апокалиптический рэп · Аргентина", playAll: "▶ Слушать альбом",
      back: "← Песни Натальи", song: "песня", songs: "песен", min: "мин",
      lyrics: "Текст", close: "Закрыть", soon: "скоро", loading: "Загружаем текст…", noLyrics: "Текст скоро появится.",
      listen: "Слушать", prev: "Назад", next: "Вперёд", play: "Играть", pause: "Пауза", seek: "Позиция",
      nowAlbum: "Proyecto R · «Наша Утопия»", nowSoon: "Proyecto R · запись скоро",
      albumTr: "«Наша Утопия»", showOriginal: "Оригинал (испанский)", showTranslation: "Перевод на русский"
    },
    en: {
      eyebrow: "Album · Proyecto R", genre: "Apocalyptic rap · Argentina", playAll: "▶ Play the album",
      back: "← Natalia's songs", song: "song", songs: "songs", min: "min",
      lyrics: "Lyrics", close: "Close", soon: "soon", loading: "Loading the lyrics…", noLyrics: "Lyrics coming soon.",
      listen: "Play", prev: "Previous", next: "Next", play: "Play", pause: "Pause", seek: "Position",
      nowAlbum: "Proyecto R · \"Our Utopia\"", nowSoon: "Proyecto R · recording soon",
      albumTr: "\"Our Utopia\"", showOriginal: "Original (Spanish)", showTranslation: "English translation"
    }
  };
  // Plural ruso: 1 песня, 2–4 песни, 5+ песен.
  const songsWord = (n) => {
    if (lang !== "ru") return n === 1 ? t("song") : t("songs");
    const d = n % 10, h = n % 100;
    if (d === 1 && h !== 11) return "песня";
    if (d >= 2 && d <= 4 && (h < 12 || h > 14)) return "песни";
    return "песен";
  };

  const store = {
    get() { try { return localStorage.getItem("proyectoR.lang"); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem("proyectoR.lang", v); } catch (e) { /* sin almacenamiento */ } }
  };
  function initialLang() {
    const q = new URLSearchParams(location.search).get("lang");
    if (LANGS.includes(q)) return q;
    const saved = store.get();
    if (LANGS.includes(saved)) return saved;
    const nav = (navigator.language || "es").slice(0, 2).toLowerCase();
    return LANGS.includes(nav) ? nav : "es";
  }
  let lang = initialLang();
  const t = (k) => (UI[lang] && UI[lang][k]) || UI.es[k] || "";
  const tr = (c, k) => (lang !== "es" && TR[c.id] && TR[c.id][lang] && TR[c.id][lang][k]) || "";

  const fmt = (s) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60), r = Math.floor(s % 60);
    return m + ":" + String(r).padStart(2, "0");
  };
  const secs = (x) => { const [m, s] = String(x || "0:0").split(":").map(Number); return m * 60 + (s || 0); };
  const esc = (x) => String(x).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const total = list.reduce((a, c) => a + secs(c.duracion), 0);

  $("tracks").innerHTML = list.map((c, i) => `
    <li class="track" data-i="${i}">
      <div class="trow">
        <button class="tplay" type="button"><span class="tnum">${i + 1}</span><span class="ticon">▶</span></button>
        <div class="tmeta">
          <span class="ttitle" lang="es">${esc(c.titulo)}</span>
          <span class="ttr" hidden></span>
          <span class="tscene"></span>
        </div>
        <button class="tlyr" type="button" aria-expanded="false"></button>
        <span class="tdur"></span>
      </div>
      <div class="tbody" hidden>
        <p class="tnote"></p>
        <p class="lyr-tools" hidden><button class="lyr-switch" type="button"></button></p>
        <div class="lyrics-body"></div>
      </div>
    </li>`).join("");

  const items = [...document.querySelectorAll(".track")];
  const cache = {};          // letras ya procesadas, por idioma e id
  const showing = {};        // idioma que se está mostrando en cada canción

  // Letra: se quitan las indicaciones de producción («— rap rápido…») y las partes sin texto (intro, breakdown, fin).
  function parse(txt) {
    txt = txt.replace(/<!--[\s\S]*?-->/g, "").replace(/^#.*$/m, "").trim();
    return txt.split(/\n\s*\n/).map((st) => {
      const lines = st.split("\n").map((l) => l.trim()).filter(Boolean);
      let label = "";
      const m = lines[0] && lines[0].match(/^\[(.+)\]$/);
      if (m) { lines.shift(); label = m[1].split(/\s+[—–-]\s+/)[0].trim(); }
      const text = lines.filter((l) => !/^\*?\(.*\)\*?$/.test(l));
      if (!text.length) return "";
      const chorus = /^(estribillo|coro|припев|финальный припев|chorus|final chorus)/i.test(label);
      const body = text.map(esc).join("<br>").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>");
      return `<p class="${chorus ? "chorus" : ""}">${label ? `<span class="label">${esc(label)}</span>` : ""}${body}</p>`;
    }).join("");
  }

  async function fetchLyrics(id, lg) {
    const key = lg + "/" + id;
    if (key in cache) return cache[key];
    let html = "";
    try {
      const r = await fetch("letras/" + (lg === "es" ? "" : lg + "/") + id + ".md");
      if (r.ok) html = parse(await r.text());
    } catch (e) { /* abierto como archivo */ }
    cache[key] = html;
    return html;
  }

  // Muestra la letra en el idioma pedido; si no hay traducción, queda el original.
  async function showLyrics(i, lg) {
    const c = list[i], li = items[i];
    const box = li.querySelector(".lyrics-body");
    const tools = li.querySelector(".lyr-tools");
    showing[i] = lg;
    box.innerHTML = `<p class="muted">${esc(t("loading"))}</p>`;
    let html = await fetchLyrics(c.id, lg);
    let shown = lg;
    if (!html && lg !== "es") { html = await fetchLyrics(c.id, "es"); shown = "es"; }
    if (showing[i] !== lg) return; // el usuario cambió de idioma mientras cargaba
    box.innerHTML = html || `<p class="muted">${esc(t("noLyrics"))}</p>`;
    box.setAttribute("lang", shown);
    const hasTr = lang !== "es" && !!(await fetchLyrics(c.id, lang));
    tools.hidden = !hasTr || !html;
    li.querySelector(".lyr-switch").textContent = shown === "es" ? t("showTranslation") : t("showOriginal");
    li.querySelector(".lyr-switch").dataset.to = shown === "es" ? lang : "es";
  }

  function openLyrics(i, open) {
    const li = items[i];
    const body = li.querySelector(".tbody");
    const show = open === undefined ? body.hidden : open;
    body.hidden = !show;
    li.classList.toggle("open", show);
    li.querySelector(".tlyr").setAttribute("aria-expanded", String(show));
    li.querySelector(".tlyr").textContent = show ? t("close") : t("lyrics");
    if (show && showing[i] === undefined) showLyrics(i, lang);
  }

  // Textos que dependen del idioma
  function applyLang() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll("[data-only]").forEach((el) => { el.hidden = el.dataset.only !== lang; });
    document.querySelectorAll(".langs button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    $("albumTr").textContent = t("albumTr");
    $("albumTr").hidden = !t("albumTr");
    $("albumMeta").textContent = list.length + " " + songsWord(list.length) + " · " + Math.round(total / 60) + " " + t("min");
    $("prev").setAttribute("aria-label", t("prev"));
    $("next").setAttribute("aria-label", t("next"));
    $("seek").setAttribute("aria-label", t("seek"));

    list.forEach((c, i) => {
      const li = items[i];
      const title = tr(c, "titulo");
      const trEl = li.querySelector(".ttr");
      trEl.textContent = title;
      trEl.hidden = !title;
      trEl.setAttribute("lang", lang);
      li.querySelector(".tscene").textContent = tr(c, "escena") || c.escena || "";
      const note = tr(c, "nota") || c.nota || "";
      li.querySelector(".tnote").textContent = note;
      li.querySelector(".tnote").hidden = !note;
      li.querySelector(".tplay").setAttribute("aria-label", t("listen") + " " + c.titulo);
      li.querySelector(".tdur").textContent = c.audio === false ? t("soon") : (c.duracion || "");
      const open = !li.querySelector(".tbody").hidden;
      li.querySelector(".tlyr").textContent = open ? t("close") : t("lyrics");
      delete showing[i];
      if (open) showLyrics(i, lang);
    });
    if (current >= 0) setNow();
    sync();
  }

  function setLang(lg) {
    if (!LANGS.includes(lg) || lg === lang) return;
    lang = lg;
    store.set(lg);
    const u = new URL(location.href);
    if (lg === "es") u.searchParams.delete("lang"); else u.searchParams.set("lang", lg);
    history.replaceState(null, "", u);
    applyLang();
  }

  function setNow() {
    const c = list[current];
    $("nowTitle").textContent = c.titulo;
    $("nowSub").textContent = c.audio === false ? t("nowSoon") : (tr(c, "titulo") ? tr(c, "titulo") + " · " : "") + t("nowAlbum");
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
    setNow();
    if (c.audio !== false) audio.play();
    sync();
  }

  const next = (from) => { let n = from + 1; while (n < list.length && list[n].audio === false) n++; return n; };

  function sync() {
    const playing = !audio.paused;
    document.body.classList.toggle("is-playing", playing);
    $("toggle").textContent = playing ? "⏸" : "▶";
    $("toggle").setAttribute("aria-label", playing ? t("pause") : t("play"));
    items.forEach((el, i) => {
      el.classList.toggle("active", i === current);
      el.classList.toggle("playing", i === current && playing);
      el.querySelector(".ticon").textContent = i === current && playing ? "⏸" : "▶";
    });
  }

  document.querySelector(".langs").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-lang]");
    if (b) setLang(b.dataset.lang);
  });
  $("tracks").addEventListener("click", (e) => {
    const li = e.target.closest(".track");
    if (!li) return;
    const i = Number(li.dataset.i);
    const sw = e.target.closest(".lyr-switch");
    if (sw) { showLyrics(i, sw.dataset.to); return; }
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

  applyLang();
})();
