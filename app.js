/* Scene + page behaviour. No build step: three.js from a CDN, everything else vanilla. */

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------ data */

  var PROJECTS = [
    {
      name: "TreadCheck",
      kind: "Computer vision · live app",
      text: "A smartphone-based tyre-condition screening system. Photograph a tyre and it reports whether the surface shows wear, cracking or perished rubber. I started from a classical computer-vision approach, found that one of the original features was reacting to image resolution rather than the tyre, reworked the pipeline around that, and deployed it. 91.2% balanced accuracy on 1,695 images, backed by 183 automated tests.",
      tech: ["Python", "OpenCV", "scikit-learn", "FastAPI", "React", "TypeScript"],
      live: "https://tyre-tread-analysis-one.vercel.app/",
      code: "https://github.com/MRC005/tyre-tread-analysis"
    },
    {
      name: "Oil-Well Model & Predictive Controller",
      kind: "Honeywell Hackathon · process control",
      text: "A mathematical model of an oil well's flow and pressures, fitted from step-test data (oil-rate RMSE 3.10 bbl/hr on held-out data), driving a predictive controller across three operating scenarios with zero safety-limit violations. Results presented in a Streamlit dashboard and technical report.",
      tech: ["Python", "NumPy", "SciPy", "Pandas", "Streamlit"],
      code: "https://github.com/MRC005/Autonomous-Production-Choke-Controller"
    },
    {
      name: "Adaptive Emotional Digital Twin",
      kind: "Research · NLP",
      text: "A system that interprets a user's text against their own history, using a RoBERTa model running in the browser via ONNX. Evaluated on 35,348 reports from 218 participants over 4.8 years with leakage-controlled, participant-disjoint splits and bootstrap confidence intervals.",
      tech: ["Python", "Transformers (RoBERTa)", "ONNX", "Statistics"]
    },
    {
      name: "Cross-Lingual Semantic Role Labeling",
      kind: "NLP · zero-shot transfer",
      text: "Labelling who did what to whom in a sentence, in languages the model was never trained on: fine-tuned multilingual BERT (mBERT) on English Universal PropBank data and tested zero-shot transfer to other languages.",
      tech: ["Python", "PyTorch", "Hugging Face Transformers", "mBERT"],
      code: "https://github.com/MRC005/Cross-Lingual-Semantic-Role-Labeling-via-Zero-Shot-Transfer",
      extra: { label: "Model", url: "https://huggingface.co/MRC005/cross-lingual-srl" }
    },
    {
      name: "MinuteMeals",
      kind: "Full-stack · MERN",
      text: "A food-ordering platform built on my own from the database schema up to the deployed site: menu browsing, cart, orders, live order status, and an admin side for managing menus and the order lifecycle.",
      tech: ["React", "Node.js", "Express", "MongoDB", "REST APIs"],
      live: "https://minutemeals-client.onrender.com/",
      code: "https://github.com/MRC005/MinuteMeals",
      extra: { label: "Admin", url: "https://minutemeals-dashboard.onrender.com/" },
      logo: "placeholder-images/logo_icon.png"
    },
    {
      name: "Autonomous Cloud Cost Governor",
      kind: "Java · cloud simulation",
      text: "A simulated multi-VM datacenter where an agent watches CPU, RAM and bandwidth telemetry and predicts which workloads are about to get expensive — catching cost problems before the bill rather than after it.",
      tech: ["Java 17", "CloudSim Plus", "Maven", "Pandas"],
      code: "https://github.com/MRC005/cloudsim-autonomous-cost-governor"
    },
    {
      name: "Real-Time Precision Cooling",
      kind: "Embedded · control systems",
      text: "A four-mode closed-loop temperature controller on an Arduino, with tuned PID gains, anti-windup clamping and a hybrid AUTO mode that switches strategy on error thresholds. Rotary-encoder interface on a 16×2 I2C LCD.",
      tech: ["Embedded C++", "PID control", "DS18B20", "I2C"],
      code: "https://github.com/MRC005/Real-Time-Precision-Cooling-System-An-Arduino-Based-Multi-Mode-Fan-Controller-with-PID-Integration"
    },
    {
      name: "DomoticsHub",
      kind: "IoT · team project",
      text: "A home-automation dashboard bringing lighting, climate, security and appliances under one interface, with remote access and energy monitoring. Built with two teammates as DomoticDynamos.",
      tech: ["React.js", "Python", "JavaScript", "IoT protocols"],
      live: "https://mrc005.github.io/DOMOTICSHUB-HOME_AUTOMATION/index.html",
      code: "https://github.com/MRC005/DOMOTICSHUB-HOME_AUTOMATION",
      logo: "placeholder-images/logo.png"
    }
  ];

  var SKILLS = [
    ["Languages", ["Java", "Python", "C++", "C", "JavaScript", "SQL", "TypeScript"]],
    ["Frontend", ["React.js", "HTML5", "CSS3", "Responsive UI"]],
    ["Backend & data", ["Node.js", "Express.js", "REST APIs", "MongoDB", "JSON", "FastAPI"]],
    ["ML & vision", ["OpenCV", "scikit-learn", "NumPy", "Pandas", "Matplotlib", "SVM", "NLP", "Hugging Face Transformers", "PyTorch", "ONNX"]],
    ["Cloud & deployment", ["Vercel", "Render", "GitHub Pages", "CloudSim Plus", "Data pipelines", "Streamlit"]],
    ["Embedded", ["Arduino", "Embedded C++", "PID control", "DS18B20", "I2C"]],
    ["Tools & foundations", ["Git", "GitHub", "Maven", "Postman", "VS Code", "Linux", "MATLAB", "DSA", "OOP", "DBMS", "OS", "Networks", "pytest", "Vitest"]]
  ];

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* ------------------------------------------------------------- build DOM */

  var workEl = document.querySelector(".work");
  PROJECTS.forEach(function (p, i) {
    var a = document.createElement("article");
    a.className = "proj reveal";
    a.id = "p" + i;
    var links = "";
    if (p.live) links += '<a class="lead" href="' + esc(p.live) + '" target="_blank" rel="noopener">Live</a>';
    if (p.code) links += '<a href="' + esc(p.code) + '" target="_blank" rel="noopener">Source</a>';
    if (p.extra) links += '<a href="' + esc(p.extra.url) + '" target="_blank" rel="noopener">' + esc(p.extra.label) + "</a>";
    a.innerHTML =
      '<p class="proj__no">' + String(i + 1).padStart(2, "0") + "</p>" +
      (p.logo ? '<img class="proj__logo" src="' + esc(p.logo) + '" alt="" loading="lazy" decoding="async">' : "") +
      "<h3>" + esc(p.name) + "</h3>" +
      '<p class="proj__kind">' + esc(p.kind) + "</p>" +
      '<p class="proj__text">' + esc(p.text) + "</p>" +
      '<p class="proj__tech">' + p.tech.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") + "</p>" +
      '<p class="proj__links">' + links + "</p>";
    workEl.appendChild(a);
  });

  var skillsEl = document.querySelector(".skills");
  SKILLS.forEach(function (g) {
    var d = document.createElement("div");
    d.className = "skills__group reveal";
    d.innerHTML = "<h3>" + esc(g[0]) + "</h3><ul>" +
      g[1].map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ul>";
    skillsEl.appendChild(d);
  });

  /* ---------------------------------------------------------- scroll reveal */

  var targets = [].slice.call(document.querySelectorAll(".reveal"));
  function showAll() { targets.forEach(function (t) { t.classList.add("in"); }); }

  if (reduced || !("IntersectionObserver" in window)) {
    showAll();
  } else {
    targets.forEach(function (t) {
      if (t.getBoundingClientRect().top < window.innerHeight * 0.92) t.classList.add("in");
    });
    var seen = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        // only a real intersection counts: the observer's first call always
        // reports every element, and that must not satisfy the failsafe below
        seen = true;
        e.target.classList.add("in");
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });
    targets.forEach(function (t) { io.observe(t); });
    // never let content stay invisible if the observer silently does nothing
    setTimeout(function () { if (!seen) { io.disconnect(); showAll(); } }, 2000);
  }

  /* --------------------------------------------------- active nav + tilt ---- */

  var navLinks = [].slice.call(document.querySelectorAll(".topbar__nav a"));
  var sections = navLinks.map(function (a) { return document.querySelector(a.getAttribute("href")); }).filter(Boolean);
  if (sections.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  if (!reduced && window.matchMedia("(hover: hover)").matches) {
    [].slice.call(document.querySelectorAll(".proj")).forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = "rotateY(" + (px * 7).toFixed(2) + "deg) rotateX(" +
          (-py * 7).toFixed(2) + "deg) translateZ(14px)";
      });
      card.addEventListener("mouseleave", function () { card.style.transform = ""; });
    });
  }

  /* -------------------------------------------------------------- the scene */

  function webglOK() {
    try {
      var c = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
    } catch (e) { return false; }
  }

  var canvas = document.getElementById("scene");
  if (typeof THREE === "undefined" || !webglOK()) { canvas.remove(); return; }

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.z = 26;

  var GREEN = 0x4fae6d;

  // the core: a slowly turning wireframe shell with a faint solid inside
  var core = new THREE.Group();
  scene.add(core);

  // keep the geometry off to one side, and tuck it further out on small screens
  // so it never drifts across the headline
  var layout = { x: 7.5, y: 0.5, scale: 1 };
  function placeCore() {
    var w = window.innerWidth;
    layout = w < 700 ? { x: 6.4, y: 6.2, scale: 0.62 }
      : w < 1100 ? { x: 7.0, y: 1.6, scale: 0.82 }
        : { x: 7.5, y: 0.5, scale: 1 };
    core.position.set(layout.x, layout.y, 0);
  }
  placeCore();

  core.add(new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(6.2, 1)),
    new THREE.LineBasicMaterial({ color: GREEN, transparent: true, opacity: 0.42 })
  ));
  core.add(new THREE.Mesh(
    new THREE.IcosahedronGeometry(6.0, 1),
    new THREE.MeshBasicMaterial({ color: 0x0f1a13, transparent: true, opacity: 0.55 })
  ));
  core.add(new THREE.Points(
    new THREE.IcosahedronGeometry(6.2, 2),
    new THREE.PointsMaterial({ color: GREEN, size: 0.1, transparent: true, opacity: 0.75 })
  ));

  // one orbiting node per project
  var nodes = [];
  var nodeGeo = new THREE.SphereGeometry(0.34, 18, 18);
  PROJECTS.forEach(function (p, i) {
    var m = new THREE.Mesh(nodeGeo, new THREE.MeshBasicMaterial({ color: GREEN }));
    m.userData = {
      name: p.name,
      target: "#p" + i,
      radius: 8.8 + (i % 3) * 1.25,
      speed: 0.12 + i * 0.016,
      phase: (i / PROJECTS.length) * Math.PI * 2,
      tilt: -0.5 + (i % 4) * 0.33
    };
    core.add(m);
    nodes.push(m);
  });

  // drifting dust, so the background keeps a sense of depth all the way down
  var dustN = 900, pos = new Float32Array(dustN * 3);
  for (var i = 0; i < dustN; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 95;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 70;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 55 - 12;
  }
  var dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  var dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
    color: 0x9fb6a4, size: 0.085, transparent: true, opacity: 0.5
  }));
  scene.add(dust);

  /* --------- pointer: parallax, plus hover/click on the project nodes ------ */

  var ray = new THREE.Raycaster();
  var ndc = new THREE.Vector2(-5, -5);
  var mx = 0, my = 0, px = 0, py = 0;
  var label = document.getElementById("node-label");
  var hovered = null;

  window.addEventListener("pointermove", function (e) {
    mx = (e.clientX / window.innerWidth) * 2 - 1;
    my = (e.clientY / window.innerHeight) * 2 - 1;
    ndc.set(mx, -my);
    label.style.left = e.clientX + "px";
    label.style.top = e.clientY + "px";
  });

  window.addEventListener("click", function () {
    if (hovered) document.querySelector(hovered.userData.target)
      .scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
  });

  /* ------------------------------------------------------------------ loop */

  var clock = new THREE.Clock();
  var scrollY = 0;
  window.addEventListener("scroll", function () { scrollY = window.scrollY; }, { passive: true });

  var visible = true;
  document.addEventListener("visibilitychange", function () { visible = !document.hidden; });

  function frame() {
    requestAnimationFrame(frame);
    if (!visible) return;

    var dt = Math.min(clock.getDelta(), 0.05);
    var t = clock.elapsedTime;
    var vh = window.innerHeight || 1;
    var depth = Math.min(scrollY / vh, 1);          // 0 at the top, 1 after one screen

    if (!reduced) {
      core.rotation.y += dt * 0.12;
      core.rotation.x = Math.sin(t * 0.18) * 0.1;
      dust.rotation.y += dt * 0.008;
    }

    // the core recedes and fades as the page scrolls past the hero
    core.position.y = layout.y + depth * 9;
    core.scale.setScalar(layout.scale * (1 - depth * 0.42));
    core.visible = depth < 0.995;

    nodes.forEach(function (n) {
      var d = n.userData;
      var a = reduced ? d.phase : d.phase + t * d.speed;
      n.position.set(
        Math.cos(a) * d.radius,
        Math.sin(a * 0.8) * d.radius * 0.32 + Math.sin(d.tilt) * 1.6,
        Math.sin(a) * d.radius
      );
    });

    // parallax, eased
    px += (mx * 1.7 - px) * Math.min(1, dt * 2.4);
    py += (-my * 1.1 - py) * Math.min(1, dt * 2.4);
    camera.position.x = px;
    camera.position.y = py;
    camera.lookAt(core.position.x * 0.35, 0, 0);

    // which node is under the cursor?
    if (core.visible) {
      ray.setFromCamera(ndc, camera);
      var hit = ray.intersectObjects(nodes)[0];
      var now = hit ? hit.object : null;
      if (now !== hovered) {
        if (hovered) hovered.scale.setScalar(1);
        hovered = now;
        if (hovered) {
          hovered.scale.setScalar(1.9);
          label.textContent = hovered.userData.name;
          label.classList.add("on");
          document.body.style.cursor = "pointer";
        } else {
          label.classList.remove("on");
          document.body.style.cursor = "";
        }
      }
    } else if (hovered) {
      hovered.scale.setScalar(1);
      hovered = null;
      label.classList.remove("on");
      document.body.style.cursor = "";
    }

    renderer.render(scene, camera);
  }
  frame();

  window.addEventListener("resize", function () {
    placeCore();
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
