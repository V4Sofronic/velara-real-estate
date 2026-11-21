> **Project update (Nov 2026):** the working brand is now **VELARA**, a real estate site built on the same
> scroll-scrubbed film engine described below. Read `README.md` for current structure. The shoe/ASCEND sections
> are kept as the original creative brief. Timing lives in `src/timeline.config.js`.

# CLAUDE.md — ASCEND Scroll-Controlled Cinematic Shoe Website

## Read this first

This repository is a working prototype for a premium, cinematic, scroll-controlled shoe product website. The goal is not to build a conventional ecommerce landing page and not to rebuild the entire shoe as a realtime 3D model. The intended experience is a high-end product film whose timeline is directly controlled by page scroll, with real HTML typography/UI layered above the film and selective WebGL/Three.js effects added only where they genuinely improve interactivity.

Treat this file as the source of truth for the project direction, current state, visual continuity requirements, technical architecture, and next steps.

---

# 1. Core creative goal

Create a website that feels like an interactive 3D product film:

- User scrolls down -> cinematic motion moves forward.
- User stops -> visual motion stops at that exact product state.
- User scrolls upward -> sequence reverses naturally.
- Product remains the visual hero throughout.
- Typography, chapter labels, navigation, progress UI and CTAs are real HTML/CSS, not baked into the video.
- The experience should feel premium, restrained, editorial and highly art-directed, not like a video simply playing behind a webpage.
- Use video/image-sequence illusion for the majority of the 3D effect.
- Use Three.js / React Three Fiber only for elements that cannot be achieved cleanly with the film, such as subtle interactive particles, depth/parallax, or future real GLB assets.

Visual reference direction: modern premium sports/product launch; cinematic, minimal, monochrome/cool mountain atmosphere transitioning toward a warmer final summit image; strong typography and generous negative space.

Working fictional brand in the prototype: **ASCEND**.

---

# 2. Source media and current status

The project currently contains two supplied 8-second MP4 product films:

- `public/assets/sequence-01.mp4`
  - Duration: exactly 8 seconds.
  - Approx size: 6.0 MB.
  - This clip is considered **clean / locked enough to preserve**.
  - Do not casually regenerate, redesign or replace its visual language.
  - Narrative: floating shoe -> product view -> close material/mesh detail -> zoom back -> exploded sole architecture.

- `public/assets/sequence-02.mp4`
  - Duration: exactly 8 seconds.
  - Approx size: 6.8 MB.
  - This clip has the correct story direction but is currently a **rough version**.
  - It is usable for prototyping, but the first 1–2 seconds and some product geometry changes need refinement before production.
  - Narrative: exploded shoe -> reassembly -> ground contact -> outsole/action/debris -> airborne performance -> landing -> summit hero.

Important: the first video should be treated as the identity and visual continuity master. The second video must flow out of the exact final exploded state from video 1.

---

# 3. Critical continuity problem between the clips

The end of `sequence-01.mp4` and the beginning of `sequence-02.mp4` are conceptually similar, but not geometrically identical. The second clip changes the sole-layer arrangement, spacing and framing slightly.

That mismatch may be acceptable in ordinary playback, but it is much more visible in a scroll-controlled experience because users can stop or reverse precisely at the seam.

Current mitigation already implemented in the prototype:

- `public/assets/exploded-anchor.png` is a clean exploded-view still.
- It is briefly faded in around the 50% scroll seam to hide the transition mismatch.

Long-term preferred fix:

- Regenerate/replace the beginning of sequence 2 so its first frame is an exact visual continuation of the final frame of sequence 1.
- Once that is done, reduce or remove the still-image bridge if it is no longer needed.

Do not introduce a hard cut at the seam.

---

# 4. Refined second-sequence storyboard

Reference images are included in `reference/storyboard/`.

These are concept/continuity anchors for the refined second 8 seconds. They are not necessarily final production images. Use them to understand motion intent and product continuity.

### `00_exploded_master.png` — around 0.0s

Purpose:
- Exact continuation state from the final exploded view of clip 1.
- Light grey performance running shoe.
- Side profile facing right.
- Dark triangular side logo.
- Knit mesh upper.
- Multiple white midsole layers.
- Dark internal/plate layers.
- Black/dark outsole.
- Cool cinematic mountain atmosphere.
- This should be the visual lock for the start of the second segment.

### `01_partial_assembly.png` — around 1.0s

Purpose:
- Approximately 70–80% reassembled.
- Components visibly moving closer together.
- No layer should morph into a new shape.
- Upper must remain unchanged.
- Camera should remain controlled and related to the opening frame.

### `02_descent_bridge.png` — around 1.7–1.8s

Purpose:
- Fully assembled shoe descending toward rocky ground.
- Transitional camera state between side-profile assembly and dramatic low-angle action.
- Avoid an abrupt hidden cut from floating shoe to outsole macro.
- Ground enters foreground while mountain environment remains continuous.

### `03_ground_impact.png` — around 2.7–3.0s

Purpose:
- Dramatic low-angle impact.
- Outsole and sole thickness emphasized.
- Rocks/gravel respond physically to the impact.
- Debris should appear to be caused by contact, not randomly materialize.
- Outsole identity should remain consistent with exploded-view architecture.

### `04_airborne_performance.png` — around 4.2–4.5s

Purpose:
- High-energy performance state after impact.
- Underside plus partial side profile visible.
- Dynamic debris and sports-commercial energy.
- No geometry redesign during rotation.

### Around 5.5–6.0s — rotate back toward side profile

No separate static reference is required; use the surrounding storyboard images and current sequence 2 as motion reference.

Intent:
- Controlled rotation.
- Same lateral side/logo visible again.
- Debris begins reducing.
- Transition from technical/performance storytelling toward aspiration/environment.

### Around 6.7–7.0s — mountain landing

Intent:
- Shoe approaches/lands on final hero rock.
- Environment calms down.
- Debris becomes subtle.
- Camera returns toward clean product hero composition.

### `05_final_summit_hero.png` — around 8.0s

Purpose:
- Final product hero.
- Shoe fully assembled on dark rock.
- Side profile facing right.
- Mountain panorama.
- Slightly warmer/golden atmosphere than the earlier technical section.
- Large areas of negative space available for HTML typography.

There is also `public/assets/final-hero.png`, which the current project can use as a production/UI reference.

---

# 5. Narrative structure for the full scroll experience

The full experience is one visual journey of approximately 16 seconds of source motion controlled by a much longer vertical scroll distance.

Conceptual timeline:

```text
0% SCROLL
Hero product / floating shoe
    ↓
Material / engineered upper detail
    ↓
Exploded architecture
    ↓
50% SCROLL — clip seam
Exploded architecture continues
    ↓
Controlled reassembly
    ↓
Ground descent
    ↓
Impact / outsole performance
    ↓
Airborne motion / debris
    ↓
Rotation back to side profile
    ↓
Mountain landing
    ↓
Final summit hero
100% SCROLL
```

Current editorial chapter system:

1. `01 / FORM`
2. `02 / SYSTEM`
3. `03 / RESPONSE`
4. `04 / ASCENT`

Current copy in `src/App.jsx`:

- Hero: `ENGINEERED TO ASCEND.`
- FORM: `LIGHT BY DESIGN.`
- SYSTEM: `BUILT FROM THE GROUND UP.`
- RESPONSE: `ENERGY IN. MOMENTUM OUT.`
- ASCENT: `ABOVE EVERYTHING.`

These are prototype copy lines. They can be refined, but the tone should remain short, premium and technical. Avoid generic marketing clutter.

---

# 6. Current technical stack

Current stack:

- Vite
- React
- GSAP
- GSAP ScrollTrigger
- Lucide React icons
- CSS

Dependencies are listed in `package.json`.

No backend is required for the current experience.

Possible future additions, only if they add clear value:

- `three`
- `@react-three/fiber`
- `@react-three/drei`

Do not add Three.js merely to claim the website is “3D.” The core product imagery is already rendered cinematically in the video assets.

---

# 7. Current project structure

```text
altitude-scroll-site/
├── CLAUDE.md                        <- this context file
├── README.md
├── index.html
├── package.json
├── public/
│   └── assets/
│       ├── sequence-01.mp4          <- locked first 8 seconds
│       ├── sequence-02.mp4          <- rough second 8 seconds
│       ├── exploded-anchor.png      <- seam masking / continuity anchor
│       └── final-hero.png           <- final hero reference
├── reference/
│   ├── storyboard/
│   │   ├── 00_exploded_master.png
│   │   ├── 01_partial_assembly.png
│   │   ├── 02_descent_bridge.png
│   │   ├── 03_ground_impact.png
│   │   ├── 04_airborne_performance.png
│   │   └── 05_final_summit_hero.png
│   └── original-video-review/
│       ├── sequence_01_contact_sheet.jpg
│       └── sequence_02_contact_sheet.jpg
└── src/
    ├── main.jsx
    ├── App.jsx
    └── styles.css
```

---

# 8. How the current prototype works

`src/App.jsx` currently:

- Registers GSAP `ScrollTrigger`.
- Preloads both MP4s.
- Keeps both videos paused/muted/playsInline.
- Uses scroll progress to directly set `video.currentTime`.
- Maps 0–50% page progress to clip 1.
- Maps 50–100% page progress to clip 2.
- Uses `exploded-anchor.png` with a short opacity window around the 50% seam.
- Crossfades from video 1 to video 2 around that seam.
- Updates a scroll percentage meter.
- Changes chapter text based on global progress.
- Fades/slides story copy blocks with ScrollTrigger.

Key existing code behavior:

```text
scroll 0.00 -> clip 1 time 0s
scroll 0.25 -> clip 1 time ~4s
scroll 0.50 -> clip 1 time ~8s / seam / clip 2 time 0s
scroll 0.75 -> clip 2 time ~4s
scroll 1.00 -> clip 2 time ~8s
```

The page currently uses approximately `760vh` of total scroll height so a 16-second visual sequence can be explored slowly.

ScrollTrigger scrub setting is currently about `0.35`, creating some smoothing between physical wheel/trackpad motion and animation response.

---

# 9. Current UI/design language

The prototype UI intentionally uses restrained real HTML rather than baked-in AI text.

Current characteristics:

- Fullscreen fixed cinematic stage.
- White/off-white typography over footage.
- Minimal top navigation.
- `ASCEND®` brand at upper-left.
- Current chapter at upper-right.
- Circular menu icon.
- Rotated scroll progress meter on desktop.
- Minimal footer/status text at bottom.
- Large editorial headline blocks aligned alternately left/right.
- Gradient grade layer and vignette over video for text readability.
- DM Mono for small technical metadata.
- Inter for primary typography.

Design principle:

**Product first, UI second.**

Do not add excessive cards, glass panels, gradients, 3D blobs, icon collections, fake dashboards or “AI website” decorations. The environment and product film already provide visual richness.

---

# 10. Local development instructions

Recommended Node version: Node.js 20 or newer.

From the project directory:

```bash
npm install
npm run dev
```

Vite normally provides a local URL such as:

```text
http://localhost:5173
```

Production test:

```bash
npm run build
npm run preview
```

Claude Code should run the app and inspect/build it before making major structural assumptions.

---

# 11. Important constraints for implementation

## Preserve the product

The shoe is the hero. Do not crop it unpredictably, cover it with large opaque interface elements, or change visual identity between chapters.

## Do not destroy clip 1

Clip 1 is already considered clean. Changes should focus on website behavior, UI, transition treatment and future replacement of clip 2.

## Build around replaceable media

The user will likely regenerate the second clip. Keep the implementation so that replacing:

`public/assets/sequence-02.mp4`

with a better file of the same conceptual length does not require a complete code rewrite.

If timing becomes configurable, isolate timing values in one clearly labeled configuration object instead of scattering magic numbers throughout JSX.

## Avoid baking website typography into video

All major website headings, section labels, navigation and CTA elements should remain DOM elements unless a specific cinematic effect requires otherwise.

## Mobile matters

The experience must degrade gracefully on mobile.

Potential adjustments:
- different text scale/position
- different object-fit/cropping strategy
- reduced scroll length
- lighter video assets
- disabling expensive WebGL effects
- touch-friendly interactions

## Accessibility

- Respect `prefers-reduced-motion`.
- Navigation/button controls should remain accessible.
- Decorative images should not create noisy alt text.
- Ensure sufficient contrast over changing footage.

---

# 12. Known technical risks with scroll-scrubbed video

Direct `video.currentTime` scrubbing is simple and appropriate for this prototype, but production smoothness varies by browser and encoding.

Potential issues:

- MP4 seeking can appear less smooth if keyframes are too far apart.
- Safari/iOS can behave differently from Chromium.
- Large video files increase first-load latency.
- Rapid reverse scrolling may expose decoding/seek latency.
- Some mobile browsers are more restrictive around media initialization.

Production options, in preferred order of investigation:

1. Re-encode source video for web with frequent keyframes and optimized seek behavior.
2. Test WebM/alternate codec fallback where appropriate.
3. Segment the sequence into logical clips with controlled crossfades.
4. For critical sequences, use an optimized WebP/AVIF image sequence rendered to `<canvas>` if memory/network budget allows.
5. Use true realtime WebGL only where needed.

Do not prematurely convert everything to hundreds of frames before testing whether optimized video scrubbing is sufficient.

---

# 13. Desired polish improvements

The first prototype proves the architecture. The next version should focus on perceived quality rather than piling on features.

Priority ideas:

- Better inertial/smoothed scrolling while preserving user control.
- Precisely map text appearance to actual visual beats rather than broad generic page sections.
- Make typography feel spatially connected to the product.
- Use masks/occlusion selectively so some text can appear to pass behind the shoe where appropriate.
- Fine-tune gradients per chapter instead of using one global overlay.
- Seamless clip handoff.
- More intentional final hero state.
- Optional subtle WebGL dust/depth particles that respond slightly to pointer/scroll.
- Product-details section after the cinematic sequence.
- Footer/product CTA after the hero experience.

Avoid over-animation. Motion should feel deliberate and expensive, not constantly busy.

---

# 14. Possible improved architecture

A useful next refactor would separate the film timeline from the JSX layout.

Example conceptual configuration:

```js
const timeline = {
  clip1: {
    start: 0,
    end: 0.5,
    src: '/assets/sequence-01.mp4',
  },
  seam: {
    center: 0.5,
    width: 0.02,
    image: '/assets/exploded-anchor.png',
  },
  clip2: {
    start: 0.5,
    end: 1,
    src: '/assets/sequence-02.mp4',
  },
  chapters: [
    { start: 0.00, end: 0.23, id: 'form' },
    { start: 0.23, end: 0.50, id: 'system' },
    { start: 0.50, end: 0.77, id: 'response' },
    { start: 0.77, end: 1.00, id: 'ascent' },
  ],
}
```

This makes it much easier to retime the site after sequence 2 is regenerated.

Do not perform large refactors only for code aesthetics. Refactor where it directly improves timing control, maintainability or media replacement.

---

# 15. Immediate task sequence for Claude Code

Unless the user gives a different instruction, continue in this order:

### Task A — run and validate the existing prototype

- `npm install`
- `npm run dev`
- Inspect for compile/runtime errors.
- Verify both videos load.
- Verify scroll controls forward/reverse motion.
- Verify the seam anchor appears near 50%.
- Verify desktop and mobile layouts are not broken.

### Task B — improve timeline architecture without changing the creative direction

- Extract timing/constants into a single clear configuration.
- Preserve current visual behavior.
- Make future sequence-02 replacement easy.
- Avoid unnecessary dependencies.

### Task C — refine scroll feel

- Improve the sense of inertia/weight while retaining exact control.
- Do not allow the site to feel sluggish.
- Test mouse wheel, trackpad and touch behavior.

### Task D — synchronize copy to product motion

Current copy positions are broad chapter markers.

Use the video contact sheets/reference storyboard to align copy to actual visual actions:

- FORM copy while the material/upper is visually readable.
- SYSTEM copy around the exploded architecture.
- RESPONSE copy during reassembly/impact/performance.
- ASCENT copy as the shoe returns to side profile and lands on summit.

### Task E — improve seam behavior

Keep the current still-image bridge until the media itself is cleaner.

Make the transition invisible enough that stopping/reversing at 50% does not feel like a cut.

### Task F — production performance pass

- Lazy/preload strategy.
- Avoid excessive React state updates on every frame if it causes rendering overhead.
- Consider updating DOM/CSS variables imperatively for high-frequency progress UI.
- Test build output.
- Preserve visual fidelity.

---

# 16. Acceptance criteria for the next strong version

The experience should satisfy all of the following:

- Scroll controls the visual timeline in both directions.
- Stopping scroll freezes at the expected visual state.
- No obvious flash at the 8s/8s seam.
- Shoe remains the visual focus.
- Text does not overwhelm or obscure the shoe.
- Chapter copy corresponds to what is happening visually.
- Desktop feels cinematic and premium.
- Mobile remains usable and coherent.
- No autoplay audio.
- No horizontal overflow.
- No obvious layout jumps while media loads.
- Production build succeeds.
- Replacing sequence 2 does not require rewriting the page.

---

# 17. What NOT to do

Do not:

- Turn this into a generic ecommerce template.
- Add pricing grids/product cards before the cinematic section is polished.
- Replace the product film with unrelated stock or generated assets.
- Rewrite clip 1 just because clip 2 is imperfect.
- Add giant glassmorphism cards over the shoe.
- Bake all text into video.
- Add Three.js for no meaningful reason.
- Convert the entire project into a large framework migration unless requested.
- Introduce a backend for the current scope.
- Use autoplay audio.
- Add heavy animation libraries that duplicate GSAP without a reason.

---

# 18. Future optional 3D layer

If a real `.glb` / `.gltf` model of the exact shoe becomes available later, a true interactive product section may be added after the cinematic intro.

That could support:

- pointer drag rotation
- material highlights
- exploded model interaction
- hotspot annotations
- realtime light response

That is a separate enhancement. It is not required to make the current cinematic scroll experience successful.

---

# 19. Deployment direction

Once the experience is polished locally:

- Build with Vite.
- Deploy static output to Vercel/Netlify/Cloudflare Pages or equivalent.
- Optimize video assets for delivery/CDN.
- Consider poster images and responsive media variants.
- Test Chrome, Edge, Safari, iOS Safari and Android Chrome.

Deployment is not the immediate priority. First make the local scroll interaction feel excellent.

---

# 20. Summary for Claude Code

You are continuing an existing prototype, not starting from zero.

The desired solution is:

**cinematic AI-rendered product film + precise scroll scrubbing + premium HTML typography/UI + selective realtime effects.**

The first 8 seconds are clean and should be preserved. The second 8 seconds is a rough continuation and may be regenerated. The website must therefore be robust to replacing the second media file. The central engineering challenge is smooth, reversible scroll-controlled playback and a seamless visual handoff between the clips. The central creative challenge is making the interface feel like part of the product film rather than text placed over a background video.

Start by running what already exists, preserve what works, and improve it incrementally.
