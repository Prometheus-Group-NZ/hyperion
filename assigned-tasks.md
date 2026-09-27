# Assigned Tasks

Source: responsive verifier (`web-ui-framework`) — added 270851ZSEP26 by the Forge agent.
Gate: AGENTS.md §5 **Responsive Integrity Gate** (blocking) — a page that scrolls sideways at a phone width is not done.

Verify:

```
node C:/Users/dionc/.config/opencode/skills/web-ui-framework/scripts/responsive-check.mjs --root E:/ai-sandbox/forge.prometheus.nz/projects/hyperion/public
```

## Responsive defects

- [ ] `prometheus-persona-demo.html` — **FAIL**: horizontal overflow (worst **+203px @320px**). Culprits: `div.hud-center-status`, `span#pillGaze.hud-pill`, `div#cardMatrix.matrix-3x3` (left=−203), `div.sector-card`. The persona/HUD layer uses a fixed pixel frame that is wider (and offset) beyond the viewport.
  - Fix: scale the HUD layer with the viewport (`clamp()`/`vmin` sizing), give the frame `max-width:100%`, and keep the HUD pills and matrix inside the viewport (no negative offsets) at narrow widths.
- [ ] `preview-3d.html`, `preview-render1-mesh.html`, `preview-render2-emblems.html`, `preview-render3-deck.html`, `preview-render4-celestial.html` — **WARN**: tap targets < 36px (`button.flex.items-center` 100×24; `input#node-filter-input` 240×14).
  - Fix: raise interactive controls to ≥44×44 CSS px on coarse pointers (a taller hit area for the borderless filter input).

(When done, re-run the verifier above — it must exit 0.)
