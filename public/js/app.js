/**
 * HYPERION // FLEET LAUNCHPAD APPLICATION CORE
 * - 6-Digit PIN CRT Gate & Session Persistence
 * - 9-Sector 3D Spatial Ingress Matrix & Semantic Camera Dive
 * - Header & Footer 5s Auto-Hide with Desktop Macron & Touch Swipe-Down
 * - Real-Time Ingress Filter
 */
(function () {
  'use strict';

  // Configuration & Unlock PINs
  const VALID_PINS = ['111111', '1111'];
  const SESSION_KEY = 'hyperion_auth_session';
  const EXPIRY_KEY = 'hyperion_auth_expiry';

  // ==========================================================================
  // 9 SECTOR REGISTRY WITH DEDICATED CHILD INGRESS NODES
  // ==========================================================================
  const SECTOR_REGISTRY = [
    {
      id: 'ai',
      index: '01',
      title: 'AI',
      dotClass: 'dot-ai',
      projects: [
        { title: 'Antigravity IDE', subdomain: 'antigravity.prometheus.nz', url: 'https://antigravity.prometheus.nz', port: ':3000', desc: 'Advanced agentic IDE and autonomous coding command hub.' },
        { title: 'OpenCode Runtime', subdomain: 'opencode.prometheus.nz', url: 'https://opencode.prometheus.nz', port: ':8080', desc: 'Distributed headless execution runtime and sandbox environment.' },
        { title: 'Iris Duplex Voice', subdomain: 'iris.prometheus.nz', url: 'https://iris.prometheus.nz', port: ':3000', desc: 'Real-time bidirectional neural voice bridge and speech telemetry.' },
        { title: 'Lyra Orchestrator', subdomain: 'lyra.prometheus.nz', url: 'https://lyra.prometheus.nz', port: ':8000', desc: 'Multi-modal model routing and context memory manager.' }
      ]
    },
    {
      id: 'security',
      index: '02',
      title: 'Security',
      dotClass: 'dot-sec',
      projects: [
        { title: 'Security Intelligence Hub', subdomain: 'security.prometheus.nz', url: 'https://security.prometheus.nz', port: ':5000', desc: 'Global threat monitoring and automated perimeter firewall rules.' },
        { title: 'Heimdall Gateway', subdomain: 'heimdall.prometheus.nz', url: 'https://heimdall.prometheus.nz', port: ':5000', desc: 'Unified authentication ingress proxy and access management.' },
        { title: 'Siren Alerts', subdomain: 'alerts.prometheus.nz', url: 'https://alerts.prometheus.nz', port: 'SIREN', desc: 'Emergency broadcast system and push alert notification daemon.' }
      ]
    },
    {
      id: 'intel',
      index: '03',
      title: 'Intel',
      dotClass: 'dot-intel',
      projects: [
        { title: 'ADS-B Radar & SIGINT SDR', subdomain: 'adsb.prometheus.nz', url: 'https://adsb.prometheus.nz', port: ':1090', desc: 'Real-time 1090MHz Mode-S ADS-B aircraft radar & dynamic multi-band SDR spectrum switchboard.' },
        { title: 'Halo Wireless SIGINT', subdomain: 'halo.prometheus.nz', url: 'https://halo.prometheus.nz', port: ':2501', desc: 'Distributed wireless sensor array, packet capture and RF telemetry.' },
        { title: 'Military Tactical Ops', subdomain: 'military.prometheus.nz', url: 'https://military.prometheus.nz', port: ':5000', desc: 'Tactical command, geofencing, and strategic node tracking.' }
      ]
    },
    {
      id: 'fleet',
      index: '04',
      title: 'Fleet',
      dotClass: 'dot-fleet',
      projects: [
        { title: 'Arachne Fleet Manager', subdomain: 'arachne.prometheus.nz', url: 'https://arachne.prometheus.nz', port: ':5000', desc: 'Autonomous telemetry agent, node orchestration and mesh sync.' },
        { title: 'Proxmox Hypervisor', subdomain: 'server.prometheus.nz', url: 'https://server.prometheus.nz', port: ':8006', desc: 'Cluster virtualization engine, VM/LXC compute and storage control.' },
        { title: 'Core Gateway Router', subdomain: 'admin.prometheus.nz', url: 'https://admin.prometheus.nz', port: ':80', desc: 'Core gateway routing, DNS resolver and LAN traffic control.' },
        { title: 'CUPS Print Spooler', subdomain: 'printers.prometheus.nz', url: 'https://printers.prometheus.nz', port: ':631', desc: 'Network print spooler daemon and document dispatch queue.' }
      ]
    },
    {
      id: 'games',
      index: '05',
      title: 'Games',
      dotClass: 'dot-games',
      projects: [
        { title: 'Games Cluster', subdomain: 'games.prometheus.nz', url: 'https://games.prometheus.nz', port: ':5000', desc: 'Interactive gaming host, high-throughput render stream and state store.' },
        { title: 'Simulation Engine', subdomain: 'simulation.prometheus.nz', url: 'https://simulation.prometheus.nz', port: ':5000', desc: 'Physics modeling, procedural generation and world state computing.' },
        { title: 'Virtual Reality Node', subdomain: 'virtualreality.prometheus.nz', url: 'https://virtualreality.prometheus.nz', port: ':5000', desc: 'Spatial computing gateway, WebXR bridge and immersive viewports.' }
      ]
    },
    {
      id: 'science',
      index: '06',
      title: 'Science',
      dotClass: 'dot-sci',
      projects: [
        { title: 'Science Lab', subdomain: 'science.prometheus.nz', url: 'https://science.prometheus.nz', port: ':5000', desc: 'Central laboratory environment, scientific computing and data logging.' },
        { title: 'DNA Browser', subdomain: 'dna.prometheus.nz', url: 'https://dna.prometheus.nz', port: 'DNA', desc: 'Genomic sequence analysis, nucleotide mapping and genetic explorer.' }
      ]
    },
    {
      id: 'social',
      index: '07',
      title: 'Social',
      dotClass: 'dot-soc',
      projects: [
        { title: 'Family Portal', subdomain: 'family.prometheus.nz', url: 'https://family.prometheus.nz', port: ':5000', desc: 'Shared ecosystem portal, family calendar, tasks and home automation.' },
        { title: 'Finance Analytics', subdomain: 'finance.prometheus.nz', url: 'https://finance.prometheus.nz', port: ':5000', desc: 'Real-time portfolio ledger, expense breakdown and asset valuation.' },
        { title: 'ADHD Companion', subdomain: 'adhd.prometheus.nz', url: 'https://adhd.prometheus.nz', port: ':5173', desc: 'Cognitive assistant, dopamine pacing, micro-tasks and focus sessions.' }
      ]
    },
    {
      id: 'technology',
      index: '08',
      title: 'Technology',
      dotClass: 'dot-tech',
      projects: [
        { title: 'Technology Workspace', subdomain: 'technology.prometheus.nz', url: 'https://technology.prometheus.nz', port: ':5000', desc: 'Engineering workbench, CAD models, schematics and hardware lab tools.' },
        { title: 'Motorsport Telemetry', subdomain: 'motorsport.prometheus.nz', url: 'https://motorsport.prometheus.nz', port: ':5000', desc: 'Track-day telemetry capture, lap time comparison and engine sensor feeds.' },
        { title: 'Automotive Telemetry', subdomain: 'automotive.prometheus.nz', url: 'https://automotive.prometheus.nz', port: ':5000', desc: 'OBD-II vehicle diagnostics, ECU status, live sensor bus and maintenance log.' },
        { title: 'Mooby Video Stream', subdomain: 'mooby.prometheus.nz', url: 'https://mooby.prometheus.nz', port: ':3000', desc: 'Private media pipeline, transcoding service and content playback hub.' }
      ]
    },
    {
      id: 'standby',
      index: '09',
      title: 'Placeholder',
      dotClass: 'dot-standby',
      projects: []
    }
  ];

  // DOM Elements
  const authOverlay = document.getElementById('authOverlay');
  const authPinContainer = document.getElementById('authPinContainer');
  const pinBoxes = authPinContainer.querySelectorAll('.otp-square');
  const authStatusMsg = document.getElementById('authStatusMsg');
  const stayCheckbox = document.getElementById('authStayCheckbox');
  const btnLock = document.getElementById('btnLockSession');
  const searchInput = document.getElementById('searchInput');
  const spatialViewport = document.getElementById('spatialViewport');
  const space3DScene = document.getElementById('space3DScene');
  const depthBarFill = document.getElementById('depthBarFill');
  const depthLabel = document.getElementById('depthLabel');
  const topHud = document.querySelector('.top-hud');
  const btnHeaderMacron = document.getElementById('btnHeaderMacron');
  const bottomBar = document.getElementById('bottomBar');

  // Authentication Session Handling
  function checkSession() {
    const session = localStorage.getItem(SESSION_KEY);
    const expiry = parseInt(localStorage.getItem(EXPIRY_KEY) || '0', 10);
    if (session === 'ACTIVE' && expiry > Date.now()) {
      unlockUI();
    } else {
      lockUI();
    }
  }

  function unlockUI() {
    authOverlay.classList.add('hidden');
    if (window.PrometheusPersona) {
      window.PrometheusPersona.wakeUp();
    }
    showHeader();
  }

  function lockUI() {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(EXPIRY_KEY);
    authOverlay.classList.remove('hidden');
    clearPin();
    authStatusMsg.className = 'auth-status-msg';
    authStatusMsg.textContent = 'ENTER AUTHORIZATION PIN';
    setTimeout(() => {
      if (pinBoxes[0]) pinBoxes[0].focus();
    }, 100);
  }

  function clearPin() {
    pinBoxes.forEach(b => b.value = '');
  }

  function getEnteredPin() {
    return Array.from(pinBoxes).map(b => b.value).join('');
  }

  function verifyPin() {
    const entered = getEnteredPin();
    if (VALID_PINS.includes(entered)) {
      authStatusMsg.className = 'auth-status-msg info';
      authStatusMsg.textContent = 'ACCESS GRANTED // INITIALIZING MESH';
      const duration = stayCheckbox.checked ? (48 * 3600 * 1000) : (4 * 3600 * 1000);
      localStorage.setItem(SESSION_KEY, 'ACTIVE');
      localStorage.setItem(EXPIRY_KEY, String(Date.now() + duration));
      setTimeout(unlockUI, 350);
    } else {
      authStatusMsg.className = 'auth-status-msg error';
      authStatusMsg.textContent = 'ACCESS DENIED // INVALID PIN';
      clearPin();
      if (pinBoxes[0]) pinBoxes[0].focus();
    }
  }

  // PIN Input Navigation
  pinBoxes.forEach((box, idx) => {
    box.addEventListener('input', () => {
      const val = box.value.replace(/[^0-9]/g, '');
      box.value = val ? val.slice(-1) : '';
      if (box.value && idx < pinBoxes.length - 1) {
        pinBoxes[idx + 1].focus();
      }
      const fullPin = getEnteredPin();
      if (fullPin.length === 6) {
        verifyPin();
      }
    });

    box.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !box.value && idx > 0) {
        pinBoxes[idx - 1].focus();
      } else if (e.key === 'Enter') {
        const fullPin = getEnteredPin();
        if (fullPin.length >= 4) {
          verifyPin();
        }
      }
    });

    box.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasteData = (e.clipboardData || window.clipboardData).getData('text').replace(/[^0-9]/g, '');
      if (!pasteData) return;
      for (let i = 0; i < pinBoxes.length; i++) {
        pinBoxes[i].value = pasteData[i] || '';
      }
      const nextIdx = Math.min(pasteData.length, pinBoxes.length - 1);
      pinBoxes[nextIdx].focus();
      if (pasteData.length >= 4) {
        verifyPin();
      }
    });
  });

  btnLock.addEventListener('click', lockUI);

  // ==========================================================================
  // 3D SPATIAL ENGINE & INTERACTIVE CAMERA
  // ==========================================================================
  const SPACING_X = 315;
  const SPACING_Y = 315;
  const DIVE_DEPTH = 480;

  // Calculate 3x3 coordinates for 9 sectors
  const sectorCoords = SECTOR_REGISTRY.map((s, idx) => {
    const col = (idx % 3) - 1;       // -1, 0, 1
    const row = Math.floor(idx / 3) - 1; // -1, 0, 1
    return {
      x: col * SPACING_X,
      y: row * SPACING_Y,
      z: 0
    };
  });

  // Camera State
  let camX = 0, camY = 0, camZ = 0;
  let targetCamX = 0, targetCamY = 0, targetCamZ = 0;
  let rotX = 0, rotY = 0;
  let targetRotX = 0, targetRotY = 0;
  let zoomProgress = 0;
  let targetZoom = 0;

  let hoveredSectorIdx = null;
  let activeSectorIdx = null;

  // Build 3D Scene DOM Nodes
  function build3DScene() {
    space3DScene.innerHTML = '';

    SECTOR_REGISTRY.forEach((sector, idx) => {
      const coord = sectorCoords[idx];
      const isStandby = sector.id === 'standby';

      const node = document.createElement('div');
      node.className = 'sector-space-node';
      node.id = `node3D_${idx}`;
      node.style.transform = `translate3d(${coord.x}px, ${coord.y}px, 0px)`;

      // 1. FRONT SQUARE TILE (z = 0)
      const frontTile = document.createElement('div');
      frontTile.className = `sector-front-square sector-${sector.id} ${isStandby ? 'standby' : ''}`;
      frontTile.setAttribute('data-idx', idx);
      frontTile.innerHTML = `
        <span class="sector-dot ${sector.dotClass}"></span>
        <h2 class="sector-square-title">${sector.title}</h2>
      `;

      // Front tile interactions (Hooks into Prometheus 3D Focus)
      frontTile.addEventListener('mouseenter', () => {
        hoveredSectorIdx = idx;
        if (targetZoom < 0.3) {
          frontTile.classList.add('active-target');
        }
        if (window.PrometheusPersona) {
          window.PrometheusPersona.focusCard(sector.title, coord.x / SPACING_X, coord.y / SPACING_Y);
        }
      });

      frontTile.addEventListener('mouseleave', () => {
        if (hoveredSectorIdx === idx) {
          hoveredSectorIdx = null;
          frontTile.classList.remove('active-target');
        }
        if (window.PrometheusPersona) {
          window.PrometheusPersona.blurCard();
        }
      });

      frontTile.addEventListener('click', () => {
        diveIntoSector(idx);
      });

      // 2. DEEP PROJECT CLUSTER (3x3 grid at z = -480px)
      const deepCluster = document.createElement('div');
      deepCluster.className = 'sector-deep-cluster';
      deepCluster.id = `deepCluster_${idx}`;

      let cardCount = 0;
      sector.projects.forEach((proj, pIdx) => {
        cardCount++;
        const slotNum = String(pIdx + 1).padStart(2, '0');
        const pCard = document.createElement('a');
        pCard.className = 'project-card';
        pCard.href = proj.url;
        pCard.target = '_blank';
        pCard.rel = 'noopener';
        pCard.innerHTML = `
          <div class="project-top">
            <div class="project-id-tag">
              <span class="project-live-indicator"></span>
              <span>NODE // ${slotNum}</span>
            </div>
            <span class="port-pill">${proj.port}</span>
          </div>
          <div class="project-body">
            <h3 class="project-title">${proj.title}</h3>
            <div class="project-subdomain">${proj.subdomain}</div>
            <p class="project-desc">${proj.desc}</p>
          </div>
        `;
        deepCluster.appendChild(pCard);
      });

      for (let s = cardCount; s < 9; s++) {
        const slotNum = String(s + 1).padStart(2, '0');
        const sCard = document.createElement('div');
        sCard.className = 'project-card slot-standby';
        sCard.innerHTML = `
          <div class="slot-standby-inner">
            <div class="slot-icon">&#10010;</div>
            <div class="slot-title">STANDBY // SLOT ${slotNum}</div>
            <div class="slot-desc">Unallocated Ingress Channel</div>
            <span class="port-pill" style="margin-top: 4px;">RESERVED</span>
          </div>
        `;
        deepCluster.appendChild(sCard);
      }

      node.appendChild(frontTile);
      node.appendChild(deepCluster);
      space3DScene.appendChild(node);
    });
  }

  function diveIntoSector(idx) {
    activeSectorIdx = idx;
    targetZoom = 1.0;
    targetCamX = sectorCoords[idx].x;
    targetCamY = sectorCoords[idx].y;
    targetCamZ = DIVE_DEPTH;
  }

  function resetZoom() {
    activeSectorIdx = null;
    targetZoom = 0;
    targetCamX = 0;
    targetCamY = 0;
    targetCamZ = 0;
    document.querySelectorAll('.sector-front-square').forEach(el => el.classList.remove('active-target'));
    showHeader();
  }

  // ==========================================================================
  // HEADER & FOOTER AUTO-HIDE (5s), MACRON TOGGLE & TOUCH SWIPE-DOWN
  // ==========================================================================
  let headerHideTimer = null;
  const AUTO_HIDE_MS = 5000;

  function hideHeader(force = false) {
    if (!force && document.activeElement === searchInput && searchInput.value.trim().length > 0) return;

    if (document.activeElement === searchInput) {
      searchInput.blur();
    }

    topHud.classList.add('header-hidden');
    if (bottomBar) bottomBar.classList.add('footer-hidden');
    document.body.classList.add('header-is-hidden');
    if (headerHideTimer) {
      clearTimeout(headerHideTimer);
      headerHideTimer = null;
    }
  }

  function showHeader() {
    topHud.classList.remove('header-hidden');
    if (bottomBar) bottomBar.classList.remove('footer-hidden');
    document.body.classList.remove('header-is-hidden');
    resetHeaderTimer();
  }

  function resetHeaderTimer() {
    if (headerHideTimer) clearTimeout(headerHideTimer);
    if (authOverlay && authOverlay.classList.contains('hidden')) {
      headerHideTimer = setTimeout(() => hideHeader(false), AUTO_HIDE_MS);
    }
  }

  // Desktop Macron Button: Click to reveal header & footer
  btnHeaderMacron.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
  });
  btnHeaderMacron.addEventListener('click', (e) => {
    e.stopPropagation();
    showHeader();
  });

  // Click off page header or footer to dismiss both immediately
  document.addEventListener('pointerdown', (e) => {
    if (!topHud.classList.contains('header-hidden')) {
      const clickedOnMacron = btnHeaderMacron && btnHeaderMacron.contains(e.target);
      const clickedOnTopHud = topHud && topHud.contains(e.target);
      const clickedOnBottomBar = bottomBar && bottomBar.contains(e.target);
      if (!clickedOnTopHud && !clickedOnMacron && !clickedOnBottomBar) {
        hideHeader(true);
      }
    }
  });

  // Keep header & footer alive while interacting directly with them
  topHud.addEventListener('mouseenter', () => {
    if (headerHideTimer) clearTimeout(headerHideTimer);
  });
  topHud.addEventListener('mousemove', () => {
    if (headerHideTimer) clearTimeout(headerHideTimer);
  });
  topHud.addEventListener('mouseleave', resetHeaderTimer);

  if (bottomBar) {
    bottomBar.addEventListener('mouseenter', () => {
      if (headerHideTimer) clearTimeout(headerHideTimer);
    });
    bottomBar.addEventListener('mousemove', () => {
      if (headerHideTimer) clearTimeout(headerHideTimer);
    });
    bottomBar.addEventListener('mouseleave', resetHeaderTimer);
  }

  searchInput.addEventListener('focus', () => {
    if (headerHideTimer) clearTimeout(headerHideTimer);
    showHeader();
  });
  searchInput.addEventListener('blur', resetHeaderTimer);

  // Touch Devices: Swipe down to reveal header & footer
  let touchStartY = 0;
  let touchStartX = 0;
  let touchStartTime = 0;

  window.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length > 0) {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
      touchStartTime = Date.now();
    }
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (e.changedTouches && e.changedTouches.length > 0) {
      const deltaY = e.changedTouches[0].clientY - touchStartY;
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      const elapsed = Date.now() - touchStartTime;
      if (deltaY > 40 && Math.abs(deltaY) > Math.abs(deltaX) * 1.2 && elapsed < 800) {
        showHeader();
      }
    }
  }, { passive: true });

  // Keyboard navigation (ESC returns to landing matrix)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      resetZoom();
      if (document.activeElement) document.activeElement.blur();
      searchInput.value = '';
      showHeader();
    }
  });

  // Scroll Wheel Dynamic 3D Zoom Controller
  spatialViewport.addEventListener('wheel', (e) => {
    e.preventDefault();

    const zoomSpeed = 0.16;

    if (e.deltaY < 0) {
      if (activeSectorIdx === null && hoveredSectorIdx !== null) {
        activeSectorIdx = hoveredSectorIdx;
      }
      if (activeSectorIdx === null) {
        activeSectorIdx = 4;
      }

      targetZoom = Math.min(1.0, targetZoom + zoomSpeed);
      targetCamX = sectorCoords[activeSectorIdx].x;
      targetCamY = sectorCoords[activeSectorIdx].y;
      targetCamZ = targetZoom * DIVE_DEPTH;
    } else {
      targetZoom = Math.max(0.0, targetZoom - zoomSpeed);
      targetCamZ = targetZoom * DIVE_DEPTH;

      if (targetZoom < 0.1) {
        activeSectorIdx = null;
        targetZoom = 0;
        targetCamX = 0;
        targetCamY = 0;
        targetCamZ = 0;
        document.querySelectorAll('.sector-front-square').forEach(el => el.classList.remove('active-target'));
      } else if (activeSectorIdx !== null) {
        targetCamX = sectorCoords[activeSectorIdx].x;
        targetCamY = sectorCoords[activeSectorIdx].y;
      }
    }
  }, { passive: false });

  // Mouse Parallax for 3D Viewport
  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const normX = (e.clientX - cx) / cx;
    const normY = (e.clientY - cy) / cy;

    if (targetZoom < 0.4) {
      targetRotY = normX * 9;
      targetRotX = -normY * 7;
    } else {
      targetRotY = normX * 2.5;
      targetRotX = -normY * 2.5;
    }
  });

  // Search Box Filter & Auto-Dive
  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    if (!q) {
      resetZoom();
      return;
    }

    const foundIdx = SECTOR_REGISTRY.findIndex(s => 
      s.title.toLowerCase().includes(q) ||
      s.projects.some(p => p.title.toLowerCase().includes(q) || p.subdomain.toLowerCase().includes(q))
    );

    if (foundIdx !== -1) {
      diveIntoSector(foundIdx);
    }
  });

  // 60FPS RAF Render Loop for 3D Scene
  function animationLoop() {
    camX += (targetCamX - camX) * 0.12;
    camY += (targetCamY - camY) * 0.12;
    camZ += (targetCamZ - camZ) * 0.12;

    rotX += (targetRotX - rotX) * 0.08;
    rotY += (targetRotY - rotY) * 0.08;

    zoomProgress += (targetZoom - zoomProgress) * 0.12;

    // Synchronize Prometheus eye dive zoom in lockstep with card zoom
    if (window.PrometheusPersona && window.PrometheusPersona.setDiveZoom) {
      window.PrometheusPersona.setDiveZoom(zoomProgress, activeSectorIdx !== null ? activeSectorIdx : hoveredSectorIdx);
    }

    space3DScene.style.transform = `translate3d(${-camX}px, ${-camY}px, ${camZ}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;

    const pct = Math.round(zoomProgress * 100);
    depthBarFill.style.width = `${pct}%`;
    depthLabel.textContent = `${pct}%`;

    SECTOR_REGISTRY.forEach((_, idx) => {
      const front = document.querySelector(`.sector-front-square[data-idx="${idx}"]`);
      const deep = document.getElementById(`deepCluster_${idx}`);

      if (!front || !deep) return;

      if (activeSectorIdx === idx) {
        const frontOpacity = Math.max(0, 1 - zoomProgress * 2.2);
        front.style.opacity = frontOpacity;
        front.style.pointerEvents = frontOpacity > 0.5 ? 'auto' : 'none';

        const deepOpacity = Math.min(1, Math.max(0, (zoomProgress - 0.25) * 1.35));
        deep.style.opacity = deepOpacity;
        deep.style.pointerEvents = deepOpacity > 0.8 ? 'auto' : 'none';
      } else {
        const dimFactor = Math.max(0.08, 1 - zoomProgress * 0.95);
        front.style.opacity = dimFactor;
        front.style.pointerEvents = zoomProgress < 0.2 ? 'auto' : 'none';
        deep.style.opacity = 0;
        deep.style.pointerEvents = 'none';
      }
    });

    requestAnimationFrame(animationLoop);
  }

  // Initialize
  build3DScene();
  requestAnimationFrame(animationLoop);
  checkSession();
})();
