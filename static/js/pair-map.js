// Action-object map: the top N pairs as a two-column network or a matrix, counted from the
// VLM video labels or the written protocols. Reads window.PAIR_DATA (static/data/pairs.js) and
// window.LAB_DATA.TASKS (static/data/lab.js). Clicking a robot task's pair opens it in the
// results browser.
(function () {
  var root = document.getElementById("pair-map");
  if (!root || !window.PAIR_DATA) return;

  var ALL = window.PAIR_DATA.pairs;  // [verb, object, VLM count, protocol count]
  var TASKS = (window.LAB_DATA && window.LAB_DATA.TASKS) || [];
  var NS = "http://www.w3.org/2000/svg";
  var BLUE = "#4a90d9", ORANGE = "#e8833a";
  var BLUES = [[239, 245, 251], [198, 219, 239], [107, 174, 214], [33, 113, 181], [8, 48, 107]];
  var chart = document.getElementById("pm-chart");
  var view = "network", src = 2, topN = 30, lastWidth = 0;

  document.getElementById("pm-total").textContent = ALL.length.toLocaleString();

  // The tooltip lives outside <body> so the page's CSS zoom doesn't offset it from the cursor.
  var tip = document.createElement("div");
  tip.className = "rb-tip";
  document.documentElement.appendChild(tip);
  function showTip(html, ev) {
    tip.innerHTML = html;
    tip.style.opacity = 1;
    tip.style.left = Math.min(ev.clientX + 14, window.innerWidth - 290) + "px";
    tip.style.top = (ev.clientY + 14) + "px";
  }
  function hideTip() { tip.style.opacity = 0; }
  window.addEventListener("scroll", hideTip, {passive: true});

  function svgEl(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function label(parent, x, y, str, attrs) {
    var t = svgEl("text", Object.assign({x: x, y: y, "font-size": 12}, attrs || {}), parent);
    t.textContent = str;
    return t;
  }
  function blues(t) {  // t in [0, 1]
    var x = Math.max(0, Math.min(1, t)) * (BLUES.length - 1), i = Math.min(Math.floor(x), BLUES.length - 2), f = x - i;
    return "rgb(" + BLUES[i].map(function (c, k) { return Math.round(c + (BLUES[i + 1][k] - c) * f); }).join(",") + ")";
  }

  var measureCtx = document.createElement("canvas").getContext("2d");
  function textWidth(str, size) {
    measureCtx.font = size + "px 'Noto Sans', sans-serif";
    return measureCtx.measureText(str).width;
  }

  function taskFor(p) {
    return TASKS.find(function (t) { return t.verb === p[0] && t.object === p[1]; });
  }
  function pairTip(p) {
    var t = taskFor(p);
    return "<strong>" + p[0] + " → " + p[1] + "</strong><br>" + p[2].toLocaleString() + " in video · " +
      p[3].toLocaleString() + " in protocols" + (t ? "<br>Learned by the robot: click for results" : "");
  }
  function bindPair(node, p) {
    node.addEventListener("mousemove", function (ev) { showTip(pairTip(p), ev); });
    node.addEventListener("mouseleave", hideTip);
    var t = taskFor(p);
    if (t) {
      node.style.cursor = "pointer";
      node.addEventListener("click", function () {
        hideTip();
        if (window.ResultsBrowser) window.ResultsBrowser.select(t.id);
        document.getElementById("results").scrollIntoView({behavior: "smooth", block: "start"});
      });
    }
  }

  function topPairs() {
    return ALL.filter(function (p) { return p[src] > 0; })
      .sort(function (a, b) { return b[src] - a[src]; }).slice(0, topN);
  }
  function totals(pairs, i) {  // [[name, total], ...] sorted by total
    var m = {};
    pairs.forEach(function (p) { m[p[i]] = (m[p[i]] || 0) + p[src]; });
    return Object.keys(m).map(function (k) { return [k, m[k]]; }).sort(function (a, b) { return b[1] - a[1]; });
  }

  function drawNetwork() {
    var pairs = topPairs(), acts = totals(pairs, 0), objs = totals(pairs, 1);
    var W = chart.clientWidth, H = Math.max(320, Math.max(acts.length, objs.length) * 24 + 50);
    var fs = W < 500 ? 11 : 13, maxR = 18;
    // leave exactly enough room for the longest label on each side
    var widest = function (list) { return Math.max.apply(null, list.map(function (n) { return textWidth(n[0], fs); })); };
    var xA = Math.min(W * 0.4, widest(acts) + maxR + 10), xO = W - Math.min(W * 0.4, widest(objs) + maxR + 10);
    var maxPair = pairs[0][src], maxNode = Math.max(acts[0][1], objs[0][1]);
    var yOf = function (i, n) { return 30 + (i + 0.5) * (H - 45) / n; };
    var aY = {}, oY = {};
    acts.forEach(function (a, i) { aY[a[0]] = yOf(i, acts.length); });
    objs.forEach(function (o, i) { oY[o[0]] = yOf(i, objs.length); });

    var svg = svgEl("svg", {width: W, height: H});
    chart.innerHTML = "";
    chart.appendChild(svg);
    label(svg, xA, 14, "ACTIONS", {"text-anchor": "middle", "font-size": 11, fill: "#888"});
    label(svg, xO, 14, "OBJECTS", {"text-anchor": "middle", "font-size": 11, fill: "#888"});

    var edgeGroup = svgEl("g", {}, svg), edges = [];
    pairs.forEach(function (p) {
      var y0 = aY[p[0]], y1 = oY[p[1]], xm = (xA + xO) / 2;
      var path = svgEl("path", {
        d: "M" + xA + "," + y0 + "C" + xm + "," + y0 + " " + xm + "," + y1 + " " + xO + "," + y1,
        fill: "none", stroke: taskFor(p) ? ORANGE : BLUE,
        "stroke-width": 0.8 + 15.2 * Math.sqrt(p[src] / maxPair), "stroke-opacity": 0.4
      }, edgeGroup);
      bindPair(path, p);
      edges.push([path, p]);
    });

    function nodes(list, x, side) {
      list.forEach(function (n) {
        var r = 4 + (maxR - 4) * Math.sqrt(n[1] / maxNode), y = side === "a" ? aY[n[0]] : oY[n[0]];
        var g = svgEl("g", {transform: "translate(" + x + "," + y + ")"}, svg);
        svgEl("circle", {r: r, fill: side === "a" ? "#2f6fb3" : "#7a8796"}, g);
        label(g, side === "a" ? -r - 6 : r + 6, 0, n[0], {"text-anchor": side === "a" ? "end" : "start", dy: "0.35em", "font-size": fs});
        g.addEventListener("mouseenter", function (ev) {
          var hit = function (p) { return side === "a" ? p[0] === n[0] : p[1] === n[0]; };
          var linked = 0;
          edges.forEach(function (e) {
            var on = hit(e[1]);
            if (on) linked++;
            e[0].setAttribute("stroke-opacity", on ? 0.85 : 0.05);
          });
          showTip("<strong>" + n[0] + "</strong>: " + linked + (side === "a" ? " objects" : " actions") + " in this view, " +
            n[1].toLocaleString() + " times " + (src === 2 ? "in video" : "in protocols"), ev);
        });
        g.addEventListener("mouseleave", function () {
          hideTip();
          edges.forEach(function (e) { e[0].setAttribute("stroke-opacity", 0.4); });
        });
      });
    }
    nodes(acts, xA, "a");
    nodes(objs, xO, "o");
  }

  function drawMatrix() {
    var pairs = topPairs();
    var acts = totals(pairs, 0).slice(0, 10).map(function (a) { return a[0]; });
    var objs = totals(pairs, 1).slice(0, 15).map(function (o) { return o[0]; });
    var index = {};
    ALL.forEach(function (p) { index[p[0] + "|" + p[1]] = p; });
    var W = Math.min(chart.clientWidth, 820), left = 110, cell = Math.floor((W - left) / acts.length);
    var rotate = cell < 64, top = rotate ? 70 : 30;
    if (rotate) cell = Math.floor((W - left - 45) / acts.length);  // room for the last tilted header
    var ch = Math.max(24, Math.round(cell * 0.55));
    var maxLog = Math.log(pairs[0][src] + 1);

    var svg = svgEl("svg", {width: W, height: top + ch * objs.length + 10});
    chart.innerHTML = "";
    chart.appendChild(svg);
    var g = svgEl("g", {transform: "translate(" + left + "," + top + ")"}, svg);
    acts.forEach(function (a, i) {
      var x = i * cell + cell / 2;
      label(g, x, -10, a, rotate ? {transform: "rotate(-40 " + x + " -10)", "text-anchor": "start"} : {"text-anchor": "middle"});
    });
    objs.forEach(function (o, j) {
      label(g, -8, j * ch + ch / 2, o, {dy: "0.35em", "text-anchor": "end"});
      acts.forEach(function (a, i) {
        var p = index[a + "|" + o], c = p ? p[src] : 0, robot = p && taskFor(p);
        var cg = svgEl("g", {transform: "translate(" + i * cell + "," + j * ch + ")"}, g);
        var t = c ? Math.log(c + 1) / maxLog : 0;
        svgEl("rect", {
          width: cell - 2, height: ch - 2, rx: 3, fill: c ? blues(0.15 + 0.85 * t) : "#f7f7f7",
          stroke: robot ? ORANGE : "none", "stroke-width": robot ? 2.5 : 0
        }, cg);
        if (c) {
          label(cg, (cell - 2) / 2, (ch - 2) / 2, c, {dy: "0.35em", "text-anchor": "middle", fill: t > 0.6 ? "#fff" : "#222", "font-size": cell < 34 ? 10 : 12});
          bindPair(cg, p);
        }
      });
    });
  }

  function draw() {
    lastWidth = chart.clientWidth;
    if (view === "network") drawNetwork(); else drawMatrix();
  }

  function segment(id, onPick) {
    var buttons = root.querySelectorAll("#" + id + " button");
    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        buttons.forEach(function (x) { x.classList.toggle("is-active", x === b); });
        onPick(b.dataset.v);
        draw();
      });
    });
  }
  segment("pm-view", function (v) { view = v; });
  segment("pm-src", function (v) { src = +v; });
  document.getElementById("pm-n").addEventListener("input", function (e) {
    topN = +e.target.value;
    document.getElementById("pm-n-val").textContent = topN;
    draw();
  });
  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { if (chart.clientWidth !== lastWidth) draw(); }, 200);
  });
  draw();
})();
