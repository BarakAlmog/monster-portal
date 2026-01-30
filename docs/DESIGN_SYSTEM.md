# Pokémon Dimension Portal - Design System Documentation

A comprehensive guide to all styling decisions, libraries, techniques, and approaches used to create this immersive UI experience.

---

## Table of Contents

1. [Libraries & Dependencies](#libraries--dependencies)
2. [Design Tokens](#design-tokens)
3. [Typography](#typography)
4. [Color System](#color-system)
5. [Three.js 3D Elements](#threejs-3d-elements)
6. [Particle Systems (tsParticles)](#particle-systems-tsparticles)
7. [GSAP Animations](#gsap-animations)
8. [CSS Techniques](#css-techniques)
9. [Visual Effects](#visual-effects)
10. [Responsive Considerations](#responsive-considerations)
11. [Performance Optimizations](#performance-optimizations)

---

## Libraries & Dependencies

### Core Libraries

| Library | Version | Purpose | CDN |
|---------|---------|---------|-----|
| **Three.js** | r128 | 3D rendering (Pokéball) | `https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js` |
| **tsParticles** | 2.12.0 | Particle effects background | `https://cdn.jsdelivr.net/npm/tsparticles@2.12.0/tsparticles.bundle.min.js` |
| **GSAP** | 3.12.2 | Animation engine | `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js` |

### Google Fonts

```html
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Exo+2:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

---

## Design Tokens

### CSS Custom Properties

```css
:root {
  /* Core Colors */
  --void-black: #0a0a0f;
  --deep-space: #0d0d1a;
  --nebula-purple: #1a0a2e;
  --cosmic-blue: #0f1a3d;

  /* Accent Colors */
  --plasma-cyan: #00f5ff;
  --energy-pink: #ff00aa;
  --portal-purple: #8b00ff;
  --hologram-green: #00ff88;
  --warning-gold: #ffd700;

  /* Pokeball Colors */
  --pokeball-red: #ff3d3d;
  --pokeball-white: #f0f0f0;
  --pokeball-dark: #1a1a1a;

  /* Gradients */
  --gradient-cosmic: linear-gradient(135deg, var(--void-black) 0%, var(--nebula-purple) 50%, var(--cosmic-blue) 100%);
  --gradient-hologram: linear-gradient(135deg, var(--plasma-cyan), var(--energy-pink), var(--portal-purple));
  --gradient-energy: linear-gradient(90deg, var(--plasma-cyan), var(--hologram-green));

  /* Fonts */
  --font-display: 'Orbitron', sans-serif;
  --font-body: 'Exo 2', sans-serif;

  /* Spacing Scale */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
}
```

---

## Typography

### Font Pairing Strategy

| Role | Font | Weights | Use Case |
|------|------|---------|----------|
| **Display** | Orbitron | 400-900 | Titles, labels, stats, buttons |
| **Body** | Exo 2 | 300-700 | Instructions, descriptions |

### Typography Examples

```css
/* Main Title - Glitch Effect */
.title-text {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 900;
  letter-spacing: 4px;
  background: var(--gradient-hologram);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Subtitle */
.title-sub {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 300;
  letter-spacing: 6px;
  text-transform: uppercase;
}

/* Stat Labels */
.stat-name {
  font-family: var(--font-display);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 1px;
}

/* Pokemon Name */
#pokemon-name {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
}
```

---

## Color System

### Layered Background Approach

The background uses multiple layers for depth:

```
Layer 0: Cosmic gradient (CSS)
Layer 1: Floating blurred orbs (CSS)
Layer 2: tsParticles (JS)
Layer 3: Three.js canvas (JS)
Layer 4: Scanlines overlay (CSS)
Layer 5: UI content (HTML)
```

### Type-Based Color Mapping

Each Pokémon type has a unique color with glow:

```css
.type-fire {
  background: linear-gradient(135deg, #F08030, #dd6610);
  box-shadow: 0 0 15px rgba(240, 128, 48, 0.7);
}

.type-water {
  background: linear-gradient(135deg, #6890F0, #4a6fc9);
  box-shadow: 0 0 15px rgba(104, 144, 240, 0.7);
}

.type-electric {
  background: linear-gradient(135deg, #F8D030, #c9a820);
  box-shadow: 0 0 15px rgba(248, 208, 48, 0.7);
  color: #1a1a1a; /* Dark text for light backgrounds */
}

/* ... all 18 types defined */
```

### Stat Bar Colors

```css
.stat-hp { background: linear-gradient(90deg, #ff3d3d, #ff6b6b); }
.stat-attack { background: linear-gradient(90deg, #f5ac78, #ffcc99); }
.stat-defense { background: linear-gradient(90deg, #fae078, #fff0a0); }
.stat-sp-atk { background: linear-gradient(90deg, #9db7f5, #b8cbff); }
.stat-sp-def { background: linear-gradient(90deg, #a7db8d, #c8f0b0); }
.stat-speed { background: linear-gradient(90deg, #fa92b2, #ffc0d0); }
```

---

## Three.js 3D Elements

### Scene Setup

```javascript
function initThreeJS() {
  // Scene with transparent background
  state.scene = new THREE.Scene();

  // Perspective camera
  state.camera = new THREE.PerspectiveCamera(
    50,                                    // FOV
    window.innerWidth / window.innerHeight, // Aspect
    0.1,                                   // Near
    1000                                   // Far
  );
  state.camera.position.z = 5;

  // Renderer with transparency and antialiasing
  state.renderer = new THREE.WebGLRenderer({
    canvas: elements.canvas,
    alpha: true,        // Transparent background
    antialias: true     // Smooth edges
  });
  state.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}
```

### Pokéball Construction

```javascript
function createPokeball() {
  state.pokeball = new THREE.Group();

  // Materials with Phong shading for shininess
  const redMaterial = new THREE.MeshPhongMaterial({
    color: 0xff3d3d,
    shininess: 100,
    specular: 0x444444
  });

  const buttonMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    shininess: 150,
    emissive: 0x00f5ff,      // Glow color
    emissiveIntensity: 0.3   // Subtle glow
  });

  // Hemisphere geometry for top/bottom halves
  const topGeometry = new THREE.SphereGeometry(
    1,           // radius
    32,          // widthSegments
    16,          // heightSegments
    0,           // phiStart
    Math.PI * 2, // phiLength
    0,           // thetaStart
    Math.PI / 2  // thetaLength (half sphere)
  );

  // Torus for center band
  const bandGeometry = new THREE.TorusGeometry(1, 0.08, 16, 100);
}
```

### Lighting Setup

```javascript
// Ambient light for base illumination
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);

// Colored point lights for dramatic effect
const cyanLight = new THREE.PointLight(0x00f5ff, 1, 100);
cyanLight.position.set(5, 5, 5);

const pinkLight = new THREE.PointLight(0xff00aa, 0.8, 100);
pinkLight.position.set(-5, -5, 5);
```

### Animation Loop

```javascript
function animateThreeJS() {
  requestAnimationFrame(animateThreeJS);

  if (state.pokeball && !state.pokeballOpen) {
    // Continuous rotation
    state.pokeball.rotation.y += 0.005;

    // Floating bob animation
    state.pokeball.position.y = 0.3 + Math.sin(Date.now() * 0.001) * 0.1;

    // Mouse follow with easing
    const targetRotationX = state.mouseY * 0.2;
    state.pokeball.rotation.x += (targetRotationX - state.pokeball.rotation.x) * 0.05;
  }

  state.renderer.render(state.scene, state.camera);
}
```

### Pokéball Open Animation (with GSAP)

```javascript
function openPokeball() {
  state.pokeballOpen = true;

  // Top half flies up and tilts back
  gsap.to(state.topHalf.position, {
    y: 1.5,
    duration: 0.6,
    ease: 'back.out(1.7)'
  });

  gsap.to(state.topHalf.rotation, {
    x: -Math.PI / 4,
    duration: 0.6,
    ease: 'power2.out'
  });

  // Scale up for emphasis
  gsap.to(state.pokeball.scale, {
    x: 1.4, y: 1.4, z: 1.4,
    duration: 0.3,
    ease: 'power2.out'
  });
}
```

### Raycasting for Click Detection

```javascript
function onPokeballClick(event) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // Convert screen coords to normalized device coords
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, state.camera);
  const intersects = raycaster.intersectObjects(state.pokeball.children, true);

  if (intersects.length > 0) {
    triggerCatch();
  }
}
```

---

## Particle Systems (tsParticles)

### Base Configuration

```javascript
await tsParticles.load('tsparticles', {
  fullScreen: false,
  background: { color: 'transparent' },
  particles: {
    number: {
      value: 80,
      density: { enable: true, value_area: 800 }
    },
    color: {
      value: ['#00f5ff', '#ff00aa', '#8b00ff', '#00ff88']
    },
    shape: {
      type: ['circle', 'star']
    },
    opacity: {
      value: 0.6,
      random: true,
      animation: {
        enable: true,
        speed: 1,
        minimumValue: 0.1,
        sync: false
      }
    },
    size: {
      value: 3,
      random: true,
      animation: {
        enable: true,
        speed: 2,
        minimumValue: 0.5,
        sync: false
      }
    },
    move: {
      enable: true,
      speed: 0.8,
      direction: 'none',
      random: true,
      outModes: { default: 'out' }
    },
    twinkle: {
      particles: {
        enable: true,
        frequency: 0.05,
        opacity: 1
      }
    }
  },
  interactivity: {
    events: {
      onHover: { enable: true, mode: 'grab' }
    },
    modes: {
      grab: {
        distance: 150,
        links: { opacity: 0.3, color: '#00f5ff' }
      }
    }
  }
});
```

### Type-Reactive Particle Config

```javascript
const TYPE_PARTICLES = {
  fire: { color: '#F08030', shape: 'circle', speed: 3, direction: 'top' },
  water: { color: '#6890F0', shape: 'circle', speed: 1.5, direction: 'bottom' },
  grass: { color: '#78C850', shape: 'polygon', speed: 1 },
  electric: { color: '#F8D030', shape: 'star', speed: 5 },
  ice: { color: '#98D8D8', shape: 'circle', speed: 0.5 },
  psychic: { color: '#F85888', shape: 'star', speed: 2 },
  ghost: { color: '#705898', shape: 'circle', speed: 1 },
  dragon: { color: '#7038F8', shape: 'star', speed: 4 },
  // ... etc
};

async function updateParticlesForType(typeName) {
  const config = TYPE_PARTICLES[typeName];

  // Destroy existing and recreate with new config
  await state.particlesInstance.destroy();
  state.particlesInstance = await tsParticles.load('tsparticles', {
    particles: {
      color: { value: [config.color, '#00f5ff', '#ff00aa'] },
      shape: { type: config.shape },
      move: {
        speed: config.speed,
        direction: config.direction || 'none'
      }
    }
  });
}
```

### Fire Type Emitter (Rising Particles)

```javascript
emitters: {
  position: { x: 50, y: 100 },  // Bottom center
  rate: { quantity: 5, delay: 0.1 },
  size: { width: 100, height: 0 },
  particles: {
    move: { direction: 'top', speed: 5 },
    size: { value: 3 },
    opacity: { value: 0.5 }
  }
}
```

---

## GSAP Animations

### Entrance Animation Sequence

```javascript
async function init() {
  // Title slides down
  gsap.fromTo('.title',
    { opacity: 0, y: -30 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
  );

  // Instruction fades in
  gsap.fromTo('.instruction',
    { opacity: 0 },
    { opacity: 1, duration: 0.6, delay: 0.3 }
  );

  // Button bounces up
  gsap.fromTo('.catch-btn',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.6, delay: 0.5, ease: 'back.out(1.7)' }
  );

  // Pokeball drops and bounces
  gsap.fromTo(state.pokeball.position,
    { y: -5 },
    { y: 0.3, duration: 1, delay: 0.2, ease: 'bounce.out' }
  );
}
```

### Card Reveal Timeline

```javascript
function animateCardReveal(pokemon, legendary) {
  const tl = gsap.timeline();

  // Card entrance with 3D tilt
  tl.fromTo(elements.pokemonCard,
    { opacity: 0, scale: 0.8, y: 50, rotateX: -15 },
    { opacity: 1, scale: 1, y: 0, rotateX: 0, duration: 0.6, ease: 'back.out(1.7)' }
  );

  // Pokemon image spins in
  tl.fromTo(elements.pokemonImage,
    { opacity: 0, scale: 0, rotation: -180 },
    { opacity: 1, scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(2)' },
    '-=0.3'  // Overlap with previous
  );

  // Name slides from left
  tl.fromTo(elements.pokemonName,
    { opacity: 0, x: -30 },
    { opacity: 1, x: 0, duration: 0.3 },
    '-=0.2'
  );

  // Type badges staggered bounce
  const badges = elements.pokemonTypes.querySelectorAll('.type-badge');
  tl.fromTo(badges,
    { opacity: 0, scale: 0, y: 20 },
    { opacity: 1, scale: 1, y: 0, duration: 0.3, stagger: 0.1, ease: 'back.out(2)' },
    '-=0.2'
  );

  // Stat rows slide in
  const statRows = elements.pokemonStats.querySelectorAll('.stat-row');
  tl.fromTo(statRows,
    { opacity: 0, x: -20 },
    { opacity: 1, x: 0, duration: 0.2, stagger: 0.05 },
    '-=0.1'
  );

  // Stat bars fill
  const statBars = elements.pokemonStats.querySelectorAll('.stat-bar');
  pokemon.stats.forEach((s, i) => {
    const percentage = Math.min((s.base_stat / 255) * 100, 100);
    tl.to(statBars[i],
      { width: `${percentage}%`, duration: 0.6, ease: 'power2.out' },
      '-=0.5'
    );
  });
}
```

### Pokéball Shake Animation

```javascript
gsap.to(state.pokeball.rotation, {
  z: Math.PI * 0.05,
  duration: 0.1,
  yoyo: true,
  repeat: 5,
  ease: 'power1.inOut'
});
```

### GSAP Easing Reference

| Ease | Effect | Use Case |
|------|--------|----------|
| `power2.out` | Fast start, slow end | General exits |
| `back.out(1.7)` | Overshoots then settles | Bouncy entrances |
| `bounce.out` | Multiple bounces | Dropping objects |
| `power1.inOut` | Smooth both ends | Oscillating motion |
| `elastic.out` | Springy overshoot | Playful reveals |

---

## CSS Techniques

### Glassmorphism Card

```css
.pokemon-card {
  background: linear-gradient(
    135deg,
    rgba(20, 20, 40, 0.9) 0%,
    rgba(10, 10, 30, 0.95) 100%
  );
  border: 1px solid rgba(0, 245, 255, 0.3);
  border-radius: 20px;
  backdrop-filter: blur(20px);
  box-shadow:
    0 0 30px rgba(0, 245, 255, 0.2),
    0 0 60px rgba(139, 0, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
```

### Gradient Text

```css
.title-text {
  background: linear-gradient(135deg, #00f5ff, #ff00aa, #8b00ff);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### Rotating Conic Gradient (Holographic Effect)

```css
.pokemon-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(
    from 0deg,
    transparent,
    rgba(0, 245, 255, 0.1),
    transparent,
    rgba(255, 0, 170, 0.1),
    transparent
  );
  animation: rotate-gradient 10s linear infinite;
}

@keyframes rotate-gradient {
  100% { transform: rotate(360deg); }
}
```

### Glitch Text Effect

```css
.title-text::before,
.title-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.title-text::before {
  animation: glitch-1 4s infinite linear;
  clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
}

@keyframes glitch-1 {
  0%, 90%, 100% { transform: translate(0); opacity: 0; }
  91% { transform: translate(-2px, 1px); opacity: 0.8; }
  92% { transform: translate(2px, -1px); opacity: 0.8; }
  93% { transform: translate(0); opacity: 0; }
}
```

### Scanlines Overlay

```css
.scanlines {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.1) 0px,
    rgba(0, 0, 0, 0.1) 1px,
    transparent 1px,
    transparent 3px
  );
  pointer-events: none;
  opacity: 0.3;
}
```

### Floating/Pulsing Animation

```css
@keyframes hologram-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

#pokemon-image {
  animation: hologram-float 4s infinite ease-in-out;
}
```

### Ring Pulse Animation

```css
.ring {
  border: 1px solid var(--plasma-cyan);
  border-radius: 50%;
  animation: ring-pulse 3s infinite ease-in-out;
}

@keyframes ring-pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.4;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.05);
    opacity: 0.6;
  }
}
```

### Shine Sweep Effect

```css
.type-badge::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 70%
  );
  animation: shine-sweep 3s infinite;
}

@keyframes shine-sweep {
  0% { transform: translateX(-100%) rotate(45deg); }
  100% { transform: translateX(100%) rotate(45deg); }
}
```

### Corner Decorations (Tech UI)

```css
.corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid var(--plasma-cyan);
}

.corner-tl {
  top: 10px;
  left: 10px;
  border-right: none;
  border-bottom: none;
}
/* Repeat for other corners */
```

---

## Visual Effects

### Screen Flash

```css
.screen-flash {
  position: fixed;
  inset: 0;
  background: #fff;
  pointer-events: none;
  opacity: 0;
}

.screen-flash.active {
  animation: flash 0.3s ease-out;
}

@keyframes flash {
  0% { opacity: 0.8; }
  100% { opacity: 0; }
}
```

```javascript
// Trigger
elements.screenFlash.classList.add('active');
setTimeout(() => elements.screenFlash.classList.remove('active'), 300);
```

### Screen Shake

```css
.screen-shake {
  animation: shake-screen 0.5s ease-out;
}

@keyframes shake-screen {
  0%, 100% { transform: translate(0, 0); }
  10% { transform: translate(-5px, -5px); }
  20% { transform: translate(5px, 5px); }
  30% { transform: translate(-5px, 5px); }
  40% { transform: translate(5px, -5px); }
  50% { transform: translate(-3px, -3px); }
  60% { transform: translate(3px, 3px); }
  70% { transform: translate(-2px, 2px); }
  80% { transform: translate(2px, -2px); }
  90% { transform: translate(-1px, -1px); }
}
```

```javascript
document.body.classList.add('screen-shake');
setTimeout(() => document.body.classList.remove('screen-shake'), 500);
```

### Portal Burst Effect

```css
.portal-effect {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: radial-gradient(
    circle,
    var(--plasma-cyan) 0%,
    var(--portal-purple) 30%,
    transparent 70%
  );
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  opacity: 0;
}

.portal-effect.active {
  animation: portal-burst 1s ease-out forwards;
}

@keyframes portal-burst {
  0% { width: 0; height: 0; opacity: 1; }
  100% { width: 200vmax; height: 200vmax; opacity: 0; }
}
```

### Legendary Glow State

```css
.pokemon-card.legendary {
  border-color: var(--warning-gold);
  box-shadow:
    0 0 50px rgba(255, 215, 0, 0.5),
    0 0 100px rgba(255, 215, 0, 0.3);
}

.pokemon-card.legendary #pokemon-image {
  filter: drop-shadow(0 0 30px var(--warning-gold));
}
```

### Parallax Mouse Movement

```javascript
function onMouseMove(event) {
  const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  const mouseY = (event.clientY / window.innerHeight) * 2 - 1;

  // Move orbs at different speeds based on index
  document.querySelectorAll('.orb').forEach((orb, index) => {
    const speed = (index + 1) * 10;
    orb.style.transform = `translate(${mouseX * speed}px, ${mouseY * speed}px)`;
  });
}
```

### Floating Orbs (Blurred Background Elements)

```css
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.4;
  animation: float-orb 20s infinite ease-in-out;
}

.orb-1 {
  width: 300px;
  height: 300px;
  background: var(--energy-pink);
  top: -100px;
  left: -100px;
}

@keyframes float-orb {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(30px, -30px) scale(1.1); }
  50% { transform: translate(-20px, 20px) scale(0.9); }
  75% { transform: translate(20px, 10px) scale(1.05); }
}
```

---

## Responsive Considerations

### Viewport Lock

```css
html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
```

### Adaptive Sizing

```css
@media (max-height: 700px) {
  .title-text { font-size: 22px; }

  .pokemon-display {
    width: 140px;
    height: 140px;
  }

  #pokemon-image {
    width: 130px;
    height: 130px;
  }

  #pokemon-name { font-size: 18px; }
}
```

### Window Resize Handler (Three.js)

```javascript
function onWindowResize() {
  state.camera.aspect = window.innerWidth / window.innerHeight;
  state.camera.updateProjectionMatrix();
  state.renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize);
```

---

## Performance Optimizations

### Pixel Ratio Limiting

```javascript
state.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
```

### Pointer Events Management

```css
/* Disable pointer events on decorative layers */
.scanlines,
.floating-orbs,
.portal-effect,
.screen-flash {
  pointer-events: none;
}

/* Enable only on interactive elements */
#pokeball-canvas {
  pointer-events: auto;
  cursor: pointer;
}
```

### Animation Frame Usage

```javascript
// Single RAF loop for Three.js
function animateThreeJS() {
  requestAnimationFrame(animateThreeJS);
  // All Three.js updates here
  state.renderer.render(state.scene, state.camera);
}
```

### CSS Containment (Optional)

```css
.pokemon-card {
  contain: layout style paint;
}
```

### GPU-Accelerated Properties

Prefer these for animations:
- `transform`
- `opacity`
- `filter`

Avoid animating:
- `width`, `height`
- `top`, `left`
- `margin`, `padding`

---

## Quick Reference: Effect Recipes

### Add Glow to Any Element

```css
.glowing {
  box-shadow: 0 0 20px var(--plasma-cyan);
  /* Or for text */
  filter: drop-shadow(0 0 10px var(--plasma-cyan));
}
```

### Add Hover Lift

```css
.liftable {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.liftable:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}
```

### Add Pulse Animation

```css
.pulsing {
  animation: pulse 2s infinite ease-in-out;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}
```

### Add Gradient Border

```css
.gradient-border {
  border: 2px solid transparent;
  background:
    linear-gradient(#0a0a0f, #0a0a0f) padding-box,
    linear-gradient(135deg, #00f5ff, #ff00aa) border-box;
}
```

---

## File Structure

```
project/
├── index.html          # HTML structure + CDN links
├── styles.css          # All CSS (design tokens, components, effects)
├── renderer.js         # All JS (Three.js, tsParticles, GSAP, logic)
├── main.js             # Electron main process
├── assets/
│   ├── icon.svg        # Source icon
│   ├── icon.png        # PNG export
│   └── icon.icns       # macOS icon
└── DESIGN_SYSTEM.md    # This file
```

---

## Checklist for Replicating This Style

- [ ] Import Google Fonts (Orbitron + Exo 2)
- [ ] Set up CSS custom properties for colors
- [ ] Create layered background (gradient + orbs + particles)
- [ ] Add scanlines overlay
- [ ] Initialize Three.js with transparent renderer
- [ ] Configure tsParticles with multi-color, twinkle, interactivity
- [ ] Set up GSAP timeline for sequenced animations
- [ ] Add glassmorphism to cards (blur + transparency + glow)
- [ ] Use gradient text for headings
- [ ] Add corner decorations for tech UI feel
- [ ] Implement screen shake/flash for impact moments
- [ ] Add hover lift effects to interactive elements
- [ ] Use staggered animations for lists

---

*Generated for Pokémon Dimension Portal v1.0.0*
