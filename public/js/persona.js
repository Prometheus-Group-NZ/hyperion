/**
 * HYPERION // PROMETHEUS LIVING 3D PERSONA ENGINE
 * - 3D Perspective Head Rotation & Z-Depth Translation
 * - Pixel-Exact Landmark Projection (Left Eye: 405, 421 | Right Eye: 649, 430)
 * - 60FPS Organic Eyelid Aperture Morphing (Physical Peeling & Blinking)
 * - Volumetric Iris Flare, Specular Starburst Rays & Swirling Sparks
 * - Micro-Expressions: Natural Micro-Saccades (2-4s) & Eyelid Snaps
 * - 50% Darker Dormant Slumber State
 */
(function (window) {
  'use strict';

  // DOM Elements
  const masterFrame = document.getElementById('personaMasterFrame');
  const imgResting = document.getElementById('imgResting');
  const imgActive = document.getElementById('imgActive');
  const eyeCanvas = document.getElementById('eyeFlameCanvas');
  const eyeCtx = eyeCanvas ? eyeCanvas.getContext('2d') : null;
  const personaDot = document.getElementById('personaDot');
  const personaStatusText = document.getElementById('personaStatusText');

  // State Management
  let isAwake = false;
  let isHoveringCard = false;
  let activeCardName = null;
  let idleTimer = null;
  const IDLE_TIMEOUT_MS = 30000;

  // 3D Perspective, Ocular Dynamics & Semantic Dive Zoom
  let eyeOpenProgress = 0.0;
  let targetEyeOpen = 0.0;
  let isBlinking = false;
  let eyeGlowIntensity = 0.0;
  let targetGlowIntensity = 0.0;
  let headTiltX = 0, headTiltY = 0;
  let targetHeadX = 0, targetHeadY = 0;
  let headRotX = 0, headRotY = 0;
  let targetHeadRotX = 0, targetHeadRotY = 0;
  let headDepthZ = -20, targetDepthZ = -20;
  let saccadeX = 0, saccadeY = 0;

  // Synchronized Eye Dive Zoom State
  let diveZoomProgress = 0.0;
  let targetDiveZoom = 0.0;
  let diveSectorIdx = null;
  const BASE_SCALE = 1.17;
  const MAX_EYE_SCALE = 11.8; // Expands eye socket & fissure to ~90% of screen height/width

  // Resize canvas to exact viewport
  function resizeCanvas() {
    if (eyeCanvas) {
      eyeCanvas.width = window.innerWidth;
      eyeCanvas.height = window.innerHeight;
    }
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  /**
   * Project exact 1376x768 landmarks into screen coordinates
   * respecting object-fit: cover and object-position: center 38%
   */
  function getScreenEyePositions() {
    if (!eyeCanvas) return { rw: 0, rh: 0, ox: 0, oy: 0, leftX: 0, leftY: 0, rightX: 0, rightY: 0, eyeRadius: 0 };

    const W = eyeCanvas.width;
    const H = eyeCanvas.height;
    const imgW = 1376;
    const imgH = 768;
    const imgAspect = imgW / imgH; // 1.791667
    const screenAspect = W / H;
    let rw, rh, ox, oy;

    if (screenAspect > imgAspect) {
      rw = W;
      rh = W / imgAspect;
      ox = 0;
      oy = (H - rh) * 0.38; // object-position: center 38%
    } else {
      rh = H;
      rw = H * imgAspect;
      ox = (W - rw) * 0.5;
      oy = (H - rh) * 0.38;
    }

    // Precise landmarks in 1376x768 image space:
    // Left eye pupil: (585, 308) | Right eye pupil: (820, 305)
    const leftX = ox + rw * (585 / 1376);
    const leftY = oy + rh * (308 / 768);
    const rightX = ox + rw * (820 / 1376);
    const rightY = oy + rh * (305 / 768);
    const eyeRadius = rw * (36 / 1376);

    return { rw, rh, ox, oy, leftX, leftY, rightX, rightY, eyeRadius };
  }

  function setDiveZoom(progress, sectorIdx) {
    targetDiveZoom = Math.max(0.0, Math.min(1.0, progress));
    if (sectorIdx !== undefined && sectorIdx !== null) {
      diveSectorIdx = sectorIdx;
    }
    if (targetDiveZoom > 0.05) {
      wakeUp();
    }
  }

  // Wake / Sleep Transitions
  function wakeUp() {
    if (!isAwake) {
      isAwake = true;
      document.body.classList.add('persona-is-awake');
      if (imgActive) imgActive.style.opacity = '1';
      if (imgResting) imgResting.style.opacity = '0';
      targetEyeOpen = 1.0;
      targetGlowIntensity = 0.35;
      targetDepthZ = 2;
      if (personaDot) personaDot.className = 'persona-status-dot awake';
      if (personaStatusText) personaStatusText.textContent = 'PROMETHEUS CORE: AWAKE // OBSERVING';
    }
    resetIdleTimer();
  }

  function goToSleep() {
    if (isAwake && !isHoveringCard && targetDiveZoom < 0.05) {
      isAwake = false;
      document.body.classList.remove('persona-is-awake');
      if (imgActive) imgActive.style.opacity = '0';
      if (imgResting) imgResting.style.opacity = '1';
      targetEyeOpen = 0.0;
      targetGlowIntensity = 0.0;
      targetDepthZ = -20;
      targetHeadX = 0; targetHeadY = 0;
      targetHeadRotX = 0; targetHeadRotY = 0;
      if (personaDot) personaDot.className = 'persona-status-dot';
      if (personaStatusText) personaStatusText.textContent = 'PROMETHEUS CORE: DORMANT';
    }
  }

  function resetIdleTimer() {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(goToSleep, IDLE_TIMEOUT_MS);
  }

  // Micro-Expressions: Natural Eyelid Blinks & Micro-Saccades
  function scheduleMicroBlink() {
    const nextDelay = 3800 + Math.random() * 3200;
    setTimeout(() => {
      if (isAwake && !isBlinking && imgActive) {
        isBlinking = true;
        imgActive.classList.add('blink');
        setTimeout(() => {
          if (imgActive) imgActive.classList.remove('blink');
          isBlinking = false;
        }, 120);
      }
      scheduleMicroBlink();
    }, nextDelay);
  }
  scheduleMicroBlink();

  function scheduleMicroSaccade() {
    const nextDelay = 2200 + Math.random() * 2600;
    setTimeout(() => {
      if (isAwake && !isHoveringCard) {
        saccadeX = (Math.random() - 0.5) * 4;
        saccadeY = (Math.random() - 0.5) * 2.5;
      } else {
        saccadeX = 0;
        saccadeY = 0;
      }
      scheduleMicroSaccade();
    }, nextDelay);
  }
  scheduleMicroSaccade();

  // Procedural Swirling Spark Filaments
  const sparkParticles = [];
  for (let i = 0; i < 32; i++) {
    sparkParticles.push({
      eye: i % 2 === 0 ? 'left' : 'right',
      angle: Math.random() * Math.PI * 2,
      radius: 2 + Math.random() * 15,
      speed: 0.02 + Math.random() * 0.04,
      size: 1 + Math.random() * 2.2,
      alpha: 0.3 + Math.random() * 0.7
    });
  }

  // Card Focus / Interaction Hooks
  function focusCard(sectorName, normX, normY) {
    wakeUp();
    isHoveringCard = true;
    activeCardName = sectorName;
    targetGlowIntensity = 1.0;
    targetHeadX = normX * 12;
    targetHeadY = normY * 8;
    targetHeadRotY = normX * 4.2;
    targetHeadRotX = -normY * 3.2;
    targetDepthZ = 8;
    if (personaDot) personaDot.className = 'persona-status-dot focused';
    if (personaStatusText) personaStatusText.textContent = `PROMETHEUS CORE: LOCKED // ${sectorName.toUpperCase()}`;
  }

  function blurCard() {
    isHoveringCard = false;
    activeCardName = null;
    targetGlowIntensity = 0.35;
    targetHeadX = 0; targetHeadY = 0;
    targetHeadRotX = 0; targetHeadRotY = 0;
    targetDepthZ = 2;
    if (personaDot) personaDot.className = 'persona-status-dot awake';
    if (personaStatusText && isAwake) personaStatusText.textContent = 'PROMETHEUS CORE: AWAKE // OBSERVING';
    resetIdleTimer();
  }

  function updateMouse(normX, normY) {
    wakeUp();
    if (!isHoveringCard) {
      targetHeadX = normX * 6;
      targetHeadY = normY * 4;
      targetHeadRotY = normX * 2.5;
      targetHeadRotX = -normY * 2.0;
    }
  }

  // 60FPS Ocular Morph & Eye Flame Render Loop
  function renderEyeFlames(timestamp) {
    diveZoomProgress += (targetDiveZoom - diveZoomProgress) * 0.18;

    if (diveZoomProgress > 0.02) {
      targetEyeOpen = 1.0;
      targetGlowIntensity = Math.max(targetGlowIntensity, 0.45 + diveZoomProgress * 0.55);
    }

    eyeGlowIntensity += (targetGlowIntensity - eyeGlowIntensity) * 0.08;
    eyeOpenProgress += (targetEyeOpen - eyeOpenProgress) * (isBlinking ? 0.28 : 0.09);
    headTiltX += (targetHeadX - headTiltX) * 0.08;
    headTiltY += (targetHeadY - headTiltY) * 0.08;
    headRotX += (targetHeadRotX - headRotX) * 0.08;
    headRotY += (targetHeadRotY - headRotY) * 0.08;
    headDepthZ += (targetDepthZ - headDepthZ) * 0.08;

    const { rw, rh, ox, oy, leftX, leftY, rightX, rightY, eyeRadius } = getScreenEyePositions();
    const W = window.innerWidth;
    const H = window.innerHeight;

    // Determine target eye:
    // Left column sectors (0: AI, 3: Fleet, 6: Social) -> Left Eye (screen left, Prometheus's right eye)
    // Center & Right column sectors (1, 2, 4, 5, 7, 8) -> Right Eye (screen right, Prometheus's left eye)
    const isLeftSector = (diveSectorIdx === 0 || diveSectorIdx === 3 || diveSectorIdx === 6);
    const targetEye = isLeftSector ? { x: leftX, y: leftY } : { x: rightX, y: rightY };

    // Eye scale and centering: expands eye socket & fissure to ~90% of screen height/width
    const currentScale = BASE_SCALE + (MAX_EYE_SCALE - BASE_SCALE) * diveZoomProgress;

    // Offset of the targeted eye relative to screen center at scale 1.0
    const pX = targetEye.x - (W * 0.5);
    const pY = targetEye.y - (H * 0.5);

    // Dynamic shift to align targeted eye dead-center as zoom reaches 1.0
    const zoomShiftX = -diveZoomProgress * currentScale * pX;
    const zoomShiftY = -diveZoomProgress * currentScale * pY;

    // Attenuate perspective tilt and micro-motion as we enter macro eye view
    const tiltFactor = Math.max(0, 1 - diveZoomProgress * 0.88);
    const totalX = headTiltX * tiltFactor + zoomShiftX;
    const totalY = headTiltY * tiltFactor + zoomShiftY;
    const totalRotY = headRotY * tiltFactor;
    const totalRotX = headRotX * tiltFactor;
    const totalDepthZ = headDepthZ * tiltFactor;

    // Apply 3D Perspective Rotation, Depth and Synchronized Eye Zoom
    if (masterFrame) {
      masterFrame.style.transform = `translate(calc(-50% + ${totalX.toFixed(2)}px), calc(-50% + ${totalY.toFixed(2)}px)) scale(${currentScale.toFixed(3)}) perspective(900px) rotateY(${totalRotY.toFixed(2)}deg) rotateX(${totalRotX.toFixed(2)}deg) translateZ(${totalDepthZ.toFixed(1)}px)`;
    }

    if (eyeCtx && eyeCanvas) {
      eyeCtx.clearRect(0, 0, eyeCanvas.width, eyeCanvas.height);

      // Volumetric Promethean Iris Glow, Rays & Particles over exact pupils
      if (eyeGlowIntensity > 0.02 && eyeOpenProgress > 0.15) {
        const leftPupil = { x: leftX + saccadeX, y: leftY + saccadeY };
        const rightPupil = { x: rightX + saccadeX, y: rightY + saccadeY };
        const eyes = [leftPupil, rightPupil];

        eyes.forEach(eye => {
          const coreRad = (14 + eyeGlowIntensity * 16) * Math.min(1.0, eyeOpenProgress * 1.2);
          const grad = eyeCtx.createRadialGradient(eye.x, eye.y, 2, eye.x, eye.y, coreRad);

          if (isHoveringCard || diveZoomProgress > 0.1) {
            grad.addColorStop(0, `rgba(220, 250, 255, ${0.95 * eyeGlowIntensity})`);
            grad.addColorStop(0.25, `rgba(0, 229, 255, ${0.85 * eyeGlowIntensity})`);
            grad.addColorStop(0.65, `rgba(14, 165, 233, ${0.45 * eyeGlowIntensity})`);
            grad.addColorStop(1, 'rgba(0, 229, 255, 0)');
          } else {
            grad.addColorStop(0, `rgba(160, 235, 255, ${0.7 * eyeGlowIntensity})`);
            grad.addColorStop(0.3, `rgba(0, 210, 255, ${0.5 * eyeGlowIntensity})`);
            grad.addColorStop(0.7, `rgba(2, 132, 199, ${0.25 * eyeGlowIntensity})`);
            grad.addColorStop(1, 'rgba(0, 210, 255, 0)');
          }

          eyeCtx.fillStyle = grad;
          eyeCtx.beginPath();
          eyeCtx.arc(eye.x, eye.y, coreRad, 0, Math.PI * 2);
          eyeCtx.fill();

          // Specular Starburst Rays when card hovered or diving
          if (isHoveringCard || diveZoomProgress > 0.1) {
            const rayIntensity = Math.min(1.0, eyeGlowIntensity + diveZoomProgress * 0.5);
            eyeCtx.strokeStyle = `rgba(0, 229, 255, ${0.45 * rayIntensity})`;
            eyeCtx.lineWidth = 1.5;
            for (let r = 0; r < 4; r++) {
              const rayAngle = (timestamp * 0.0015) + (r * Math.PI / 2);
              eyeCtx.beginPath();
              eyeCtx.moveTo(eye.x - Math.cos(rayAngle) * 7, eye.y - Math.sin(rayAngle) * 7);
              eyeCtx.lineTo(eye.x + Math.cos(rayAngle) * 22, eye.y + Math.sin(rayAngle) * 22);
              eyeCtx.stroke();
            }
          }
        });

        // Swirling filaments around exact pupils
        sparkParticles.forEach(p => {
          p.angle += p.speed * (isHoveringCard || diveZoomProgress > 0.1 ? 1.8 : 1.0);
          const eye = (p.eye === 'left' ? leftPupil : rightPupil);
          const px = eye.x + Math.cos(p.angle) * p.radius;
          const py = eye.y + Math.sin(p.angle) * (p.radius * 0.85);

          eyeCtx.fillStyle = `rgba(125, 235, 255, ${p.alpha * eyeGlowIntensity * eyeOpenProgress})`;
          eyeCtx.beginPath();
          eyeCtx.arc(px, py, p.size * (isHoveringCard || diveZoomProgress > 0.1 ? 1.4 : 1.0), 0, Math.PI * 2);
          eyeCtx.fill();
        });
      }
    }

    requestAnimationFrame(renderEyeFlames);
  }
  requestAnimationFrame(renderEyeFlames);

  // Global Event Listeners for Persona
  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    updateMouse((e.clientX - cx) / cx, (e.clientY - cy) / cy);
  });

  window.addEventListener('touchstart', () => {
    wakeUp();
  }, { passive: true });

  // Expose API
  window.PrometheusPersona = {
    wakeUp,
    goToSleep,
    focusCard,
    blurCard,
    updateMouse,
    setDiveZoom
  };

})(window);
