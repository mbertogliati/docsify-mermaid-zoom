const Z = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M17 17l-2.5 -2.5"></path>
        <path d="M10 5l2 -2l2 2"></path>
        <path d="M19 10l2 2l-2 2"></path>
        <path d="M5 10l-2 2l2 2"></path>
        <path d="M10 19l2 2l2 -2"></path>
    </svg>
`, B = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M21 21l-6 -6"></path>
        <path d="M3.268 12.043a7.017 7.017 0 0 0 6.634 4.957a7.012 7.012 0 0 0 7.043 -6.131a7 7 0 0 0 -5.314 -7.672a7.021 7.021 0 0 0 -8.241 4.403"></path>
        <path d="M3 4v4h4"></path>
    </svg>
`, H = (o = 1, r = 5, n = !0) => (s) => {
  // Resolve target: accept ID string or SVG element
  let a = null;
  if (typeof s === "string") {
    a = document.querySelector(`#${s}`);
  } else if (s && s.tagName && s.tagName.toLowerCase() === "svg") {
    a = s;
  }
  if (!a) return;

  // Find the best container for the overlay menu (.mermaid if available)
  const l = a.closest && a.closest('.mermaid') ? a.closest('.mermaid') : a.parentNode;
  const i = d3.select(a);

  // Prevent double-initialization on the same SVG
  if (a.dataset.mermaidZoomInitialized === "true") {
    return;
  }

  // Wrap inner content in a single <g> if not already wrapped
  const firstChild = a.firstElementChild;
  if (!(firstChild && firstChild.tagName && firstChild.tagName.toLowerCase() === "g")) {
    i.html("<g>" + i.html() + "</g>")
  }

  const c = i.select("g");
  const u = d3.zoom()
    // Ignore zoom interactions that originate from within the zoom menu
    .filter((evt) => {
      const target = evt && evt.target;
      return !(target && target.closest && target.closest('.docsify-mermaid-zoom-menu'));
    });

  const f = () => {
    u.on("zoom", (e) => c.attr("transform", e.transform)).scaleExtent([o, r]);
    i.call(u);
  };

  const g = () => {
    i.on(".zoom", null);
  };

  const v = () => {
    // Reset by directly setting the transform to identity to avoid NaN issues
    c.transition().attr('transform', 'translate(0,0) scale(1)');
    // Rebind zoom cleanly so user can interact again
    i.on('.zoom', null);
    u.on('zoom', (e) => c.attr('transform', e.transform)).scaleExtent([o, r]);
    i.call(u);
  };

  const k = (e) => {
    const t = e.getBoundingClientRect();
    return (
      t.top >= 0 &&
      t.left >= 0 &&
      t.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      t.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  // Single click handler per SVG to enable zoom on demand
  a.addEventListener("click", () => f(), { once: true });

  // Reset zoom when diagram scrolls out of view
  document.addEventListener(
    "scroll",
    () => {
      k(l) || (g(), v());
    },
    { passive: !0 }
  );

  // Optional zoom menu on container
  n && ((e) => {
    var x;
    if (((x = e.dataset) == null ? void 0 : x.mermaidZoomMenu) === "true") return;
    const t = document.createElement("div");
    t.className = 'docsify-mermaid-zoom-menu';
    const b = getComputedStyle(e).position;
    (!b || b === "static") && (e.style.position = "relative");
    t.style.position = "relative";
    t.style.width = "fit-content";
    t.style.top = "8px";
    t.style.right = "8px";
    t.style.zIndex = "1000";
    t.style.display = "flex";
    t.style.gap = "6px";
    t.style.alignItems = "center";
    t.style.background = "rgba(255,255,255,0.85)";
    t.style.border = "1px solid rgba(0,0,0,0.1)";
    t.style.borderRadius = "6px";
    t.style.padding = "4px";
    t.style.boxShadow = "0 2px 8px rgba(0,0,0,0.12)";
    // Prevent selection/dragging behavior on the menu itself
    t.style.userSelect = 'none';
    t.style.webkitUserSelect = 'none';
    t.style.touchAction = 'manipulation';
    const isNoHover = window.matchMedia && window.matchMedia('(hover: none)').matches;
    if (isNoHover) {
      // Always visible on touch/no-hover environments
      t.style.visibility = "visible";
      t.style.opacity = "1";
    } else {
      t.style.visibility = "hidden";
      t.style.opacity = "0";
      t.style.transition = "visibility 0s linear 0.15s, opacity 0.15s";
      e.addEventListener("mouseover", () => {
        t.style.visibility = "visible";
        t.style.opacity = "1";
        t.style.transition = "opacity 0.15s";
      });
      e.addEventListener("mouseleave", () => {
        t.style.opacity = "0";
        t.style.transition = "visibility 0s linear 0.15s, opacity 0.15s";
        setTimeout(() => {
          t.style.visibility = "hidden";
        }, 150);
      });
    }
    // Stop propagation on the entire menu to ensure drag/zoom does not engage when interacting with it
    const stopEvents = [
      'mousedown','mousemove','mouseup','click','wheel',
      'touchstart','touchmove','touchend','pointerdown','pointermove','pointerup',
      'dblclick','contextmenu'
    ];
    stopEvents.forEach((type) => {
      t.addEventListener(type, (ev) => {
        ev.stopPropagation();
      }, { capture: true });
    });

    const M = (E, S) => {
      const d = document.createElement("button");
      d.innerHTML = S;
      d.style.backgroundColor = "transparent";
      d.style.border = "none";
      d.style.cursor = "pointer";
      d.draggable = false;
      d.addEventListener('dragstart', (e) => e.preventDefault());
      d.addEventListener('mousedown', (e) => e.preventDefault(), { capture: true });
      d.style.userSelect = 'none';
      d.style.webkitUserSelect = 'none';
      d.style.touchAction = 'manipulation';
      d.addEventListener("click", () => E());
      return d;
    };
    const z = M(f, Z);
    const C = M(v, B);
    t.appendChild(z);
    t.appendChild(C);
    e.appendChild(t);
    e.dataset.mermaidZoomMenu = "true";
  })(l);

  // Mark this SVG as initialized to avoid duplicate work on future route changes
  a.dataset.mermaidZoomInitialized = "true";
}, { mermaidZoom: p = {}, mermaidConfig: m = {} } = window.$docsify, y = {
  ...p,
  zoomMenu: typeof p.zoomMenu == "boolean" ? p.zoomMenu : (
      // fallback to legacy name if present
      p.zoomPannel ?? !0
  )
}, h = H(
    y.minimumScale ?? 1,
    y.maximumScale ?? 5,
    y.zoomMenu ?? !0
);
// Ensure docsify-mermaid reads the mermaidConfig, but don't overwrite if already defined
if (!window.$docsify.mermaidConfig) {
  window.$docsify.mermaidConfig = m;
}
// Ensure at least a default selector exists for docsify-mermaid
if (!window.$docsify.mermaidConfig.querySelector && !window.$docsify.mermaidConfig.selector) {
  window.$docsify.mermaidConfig.querySelector = '.mermaid';
}
const L = (o) => {
  if (window.mermaid && typeof window.mermaid.run == "function") {
    o();
    return;
  }
  const r = 3e3, n = Date.now(), s = setInterval(() => {
    (window.mermaid && typeof window.mermaid.run == "function" || Date.now() - n > r) && (clearInterval(s), o());
  }, 50);
};

// Helper: resolve the selector string for Mermaid containers
const getMermaidSelector = () => {
  const cfg = (window.$docsify && window.$docsify.mermaidConfig) || m || {};
  if (typeof cfg.querySelector === 'string') return cfg.querySelector;
  if (typeof cfg.selector === 'string') return cfg.selector;
  return '.mermaid';
};

// Initialize zoom for all rendered Mermaid SVGs, after waiting for render
const initAllMermaidZoom = () => {
  const n = getMermaidSelector();
  const start = Date.now();
  const maxWait = 3000;
  let lastCount = -1;
  let stableFrames = 0;
  const tick = () => {
    const svgList = document.querySelectorAll([
      `${n} svg`,
      '.mermaid svg',
      'pre[data-lang="mermaid"] svg',
      'code.language-mermaid svg'
    ].join(','));
    // Wait until the number of SVGs stabilizes for a few frames to avoid race with mermaid.run replacing nodes
    if (svgList.length === lastCount && svgList.length > 0) {
      stableFrames += 1;
    } else {
      stableFrames = 0;
      lastCount = svgList.length;
    }

    if ((svgList.length > 0 && stableFrames >= 3) || Date.now() - start > maxWait) {
      svgList.forEach((svg) => {
        if (!svg.id) {
          svg.id = `mermaid-${Math.random().toString(36).slice(2, 10)}`;
        }
        try {
          h(svg);
          // Enable zoom immediately so users can zoom with wheel/drag without clicking first
          try { svg.dispatchEvent(new Event('click')); } catch (_) {}
        } catch (err) {
          console.warn("docsify-mermaid-zoom: zoom init failed for", svg, err);
        }
      });
    } else {
      requestAnimationFrame(tick);
    }
  };
  requestAnimationFrame(tick);
};

// Prevent duplicate registration if this script is evaluated more than once
if (!window.__mermaidZoomPluginInstalled) {
  window.__mermaidZoomPluginInstalled = true;
  window.$docsify.plugins = [].concat(window.$docsify.plugins || [], function(o) {
    o.doneEach(() => {
      L(() => {
        try {
          // Do not call mermaid.run here; rely on docsify-mermaid. Only init zoom after SVGs are present.
          initAllMermaidZoom();
        } catch (err) {
          console.warn("docsify-mermaid-zoom: init failed", err);
        }
      });
    });
  });
}

// Fallbacks for initial load and hash-based routing (Docsify SPA)
window.addEventListener('DOMContentLoaded', () => {
  L(() => initAllMermaidZoom());
});
window.addEventListener('hashchange', () => {
  L(() => initAllMermaidZoom());
});
