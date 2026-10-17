// Biblioteca de estudio - motor compartido: indice, busqueda, progreso y filtros.
// Cada tema lo enlaza con <script src="_motor.js"></script>.
// Expone window.__guiaUtil para las herramientas propias de cada tema.


(function () {
  "use strict";

  /* ============================================================
     0. Utilidades
     ============================================================ */
  function escapeHtml(t) {
    return String(t).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function rxEsc(t) {
    return t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  function normalize(t) {
    return String(t).replace(/\s+/g, " ").trim();
  }
  function hex2(n) {
    return n.toString(16).toUpperCase().padStart(2, "0");
  }
  function hexPad(n, width) {
    return n.toString(16).toUpperCase().padStart(width || 2, "0");
  }

  /* ============================================================
     0.3 Scroll propio para saltos internos (reemplaza el nativo
     "scroll-behavior: smooth", que en documentos largos se siente
     lento y sin control sobre la curva de animación).
     ============================================================ */
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }
  function smoothScrollTo(targetY, duration) {
    var startY = window.scrollY || document.documentElement.scrollTop || 0;
    var diff = targetY - startY;
    duration = duration || 420;
    if (Math.abs(diff) < 2) return;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / duration);
      window.scrollTo(0, startY + diff * easeOutCubic(p));
      if (p < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }
  Array.prototype.forEach.call(document.querySelectorAll('a[href^="#"]'), function (a) {
    var id = a.getAttribute("href").slice(1);
    if (!id) return;
    a.addEventListener("click", function (e) {
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 12;
      smoothScrollTo(top);
      if (window.history && window.history.pushState) {
        window.history.pushState(null, "", "#" + id);
      }
    });
  });

  /* ============================================================
     0.4 Índice como panel deslizable en móvil (abre/cierra #side)
     ============================================================ */
  var side = document.getElementById("side");
  var tocBtn = document.getElementById("tocBtn");
  var sideOverlay = document.getElementById("sideOverlay");
  var sideClose = document.getElementById("sideClose");

  if (side && tocBtn && sideOverlay) {
    var openSide = function () {
      side.classList.add("open");
      sideOverlay.classList.add("open");
      tocBtn.setAttribute("aria-expanded", "true");
    };
    var closeSide = function () {
      side.classList.remove("open");
      sideOverlay.classList.remove("open");
      tocBtn.setAttribute("aria-expanded", "false");
    };
    tocBtn.addEventListener("click", function () {
      if (side.classList.contains("open")) closeSide(); else openSide();
    });
    sideOverlay.addEventListener("click", closeSide);
    if (sideClose) sideClose.addEventListener("click", closeSide);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeSide();
    });
    Array.prototype.forEach.call(document.querySelectorAll("#toc a"), function (a) {
      a.addEventListener("click", closeSide);
    });
  }

  /* ============================================================
     0.5 Tablas responsivas: en móvil hacen scroll horizontal propio
     en vez de desbordar toda la página.
     ============================================================ */
  Array.prototype.forEach.call(document.querySelectorAll("main table"), function (t) {
    if (t.parentNode.classList.contains("tbl-scroll")) return;
    var wrap = document.createElement("div");
    wrap.className = "tbl-scroll";
    t.parentNode.insertBefore(wrap, t);
    wrap.appendChild(t);
  });

  /* ============================================================
     1. Barra de progreso, botón "volver arriba" y sección activa
     ============================================================ */
  var prog = document.getElementById("prog");
  var topBtn = document.getElementById("top");

  var sections = Array.prototype.slice.call(
    document.querySelectorAll("main section[id]")
  );

  var tocLinks = {};
  Array.prototype.forEach.call(document.querySelectorAll("#toc a"), function (a) {
    var href = a.getAttribute("href") || "";
    if (href.charAt(0) === "#") tocLinks[href.slice(1)] = a;
  });

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;

      var y = window.scrollY || document.documentElement.scrollTop || 0;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      prog.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";

      topBtn.style.display = y > 700 ? "block" : "none";

      var current = null;
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].getBoundingClientRect().top <= 130) current = sections[i].id;
      }
      if (current && tocLinks[current] && !tocLinks[current].classList.contains("on")) {
        Array.prototype.forEach.call(document.querySelectorAll("#toc a.on"), function (x) {
          x.classList.remove("on");
        });
        tocLinks[current].classList.add("on");
      }
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  topBtn.addEventListener("click", function () {
    smoothScrollTo(0);
  });

  /* ============================================================
     2. Filtro del índice lateral
     ============================================================ */
  var tocFilter = document.getElementById("tocFilter");
  tocFilter.addEventListener("input", function () {
    var q = tocFilter.value.trim().toLowerCase();
    Array.prototype.forEach.call(document.querySelectorAll("#toc a"), function (a) {
      var hit = !q || a.textContent.toLowerCase().indexOf(q) !== -1;
      a.style.display = hit ? "" : "none";
    });
    Array.prototype.forEach.call(document.querySelectorAll("#toc .grp"), function (g) {
      var n = g.nextElementSibling, any = false;
      while (n && n.tagName === "A") {
        if (n.style.display !== "none") any = true;
        n = n.nextElementSibling;
      }
      g.style.display = any ? "" : "none";
    });
  });

  /* ============================================================
     3. Filtro del glosario
     ============================================================ */
  var glossFilter = document.getElementById("glossFilter");
  if (glossFilter) {
    glossFilter.addEventListener("input", function () {
      var q = glossFilter.value.trim().toLowerCase();
      Array.prototype.forEach.call(document.querySelectorAll("#glosario .ge"), function (el) {
        var hit = !q || el.textContent.toLowerCase().indexOf(q) !== -1;
        el.classList.toggle("hide", !hit);
      });
      Array.prototype.forEach.call(document.querySelectorAll("#glosario .gl-letter"), function (h) {
        var n = h.nextElementSibling, any = false;
        while (n && !n.classList.contains("gl-letter")) {
          if (n.querySelector && n.querySelector(".ge:not(.hide)")) any = true;
          n = n.nextElementSibling;
        }
        h.classList.toggle("hide", !!q && !any);
      });
    });
  }

  /* ============================================================
     4. Buscador global de la guía
     ============================================================ */
  var docSearch = document.getElementById("docSearch");
  var docResults = document.getElementById("docResults");

  var index = sections.map(function (s) {
    var h = s.querySelector("h2");
    return {
      id: s.id,
      title: h ? normalize(h.textContent) : s.id,
      text: normalize(s.textContent)
    };
  });

  document.body.appendChild(docResults);
  docResults.style.position = "fixed";

  function hideResults() {
    docResults.style.display = "none";
    docResults.innerHTML = "";
  }

  docSearch.addEventListener("input", function () {
    var q = docSearch.value.trim().toLowerCase();
    if (q.length < 2) { hideResults(); return; }

    var hits = [];
    for (var i = 0; i < index.length && hits.length < 24; i++) {
      var item = index[i];
      var pos = item.text.toLowerCase().indexOf(q);
      var inTitle = item.title.toLowerCase().indexOf(q) !== -1;
      if (pos === -1 && !inTitle) continue;
      var raw = pos === -1
        ? item.text.slice(0, 140)
        : item.text.slice(Math.max(0, pos - 55), pos + q.length + 85);
      hits.push({ id: item.id, title: item.title, raw: raw, pos: pos });
    }

    if (!hits.length) {
      docResults.innerHTML = '<div><span class="r-t">Sin resultados para "' +
        escapeHtml(docSearch.value) + '"</span></div>';
    } else {
      docResults.innerHTML = hits.map(function (h) {
        var rx = new RegExp("(" + rxEsc(q) + ")", "gi");
        var parts = h.raw.split(rx);
        var snip = parts.map(function (p, j) {
          return (j % 2) ? "<mark>" + escapeHtml(p) + "</mark>" : escapeHtml(p);
        }).join("");
        return '<div data-goto="' + h.id + '"><div class="r-t">' +
          escapeHtml(h.title) + '</div><div class="r-s">…' + snip + '…</div></div>';
      }).join("");
    }

    var r = docSearch.getBoundingClientRect();
    docResults.style.left = Math.max(8, r.left) + "px";
    docResults.style.top = (r.bottom + 6) + "px";
    docResults.style.display = "block";
  });

  docResults.addEventListener("click", function (e) {
    var row = e.target.closest("[data-goto]");
    if (!row) return;
    var id = row.getAttribute("data-goto");
    hideResults();
    docSearch.value = "";
    var target = document.getElementById(id);
    if (target) {
      var top = target.getBoundingClientRect().top + window.scrollY - 12;
      smoothScrollTo(top);
    }
  });

  document.addEventListener("click", function (e) {
    if (!docResults.contains(e.target) && e.target !== docSearch) hideResults();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") hideResults();
  });

    window.__guiaUtil = { escapeHtml: escapeHtml, rxEsc: rxEsc, normalize: normalize, hex2: hex2, hexPad: hexPad };

/* ============================================================
     8. Tecla "/" para saltar al buscador (comodidad)
     ============================================================ */
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && document.activeElement.tagName !== "INPUT" &&
        document.activeElement.tagName !== "TEXTAREA") {
      e.preventDefault();
      docSearch.focus();
    }
  });
})();
