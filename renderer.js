/* ═══════════════════════════════════════════════════════════════════════════
   POKÉMON DIMENSION PORTAL - Main Renderer
   Three.js + tsParticles + GSAP Integration
   ═══════════════════════════════════════════════════════════════════════════ */

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const CONFIG = {
  TOTAL_POKEMON: 1010,
  LEGENDARY_IDS: [
    144, 145, 146, 150, 151, // Gen 1
    243, 244, 245, 249, 250, 251, // Gen 2
    377, 378, 379, 380, 381, 382, 383, 384, 385, 386, // Gen 3
    480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493, // Gen 4
    494, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649, // Gen 5
    716, 717, 718, 719, 720, 721, // Gen 6
    785, 786, 787, 788, 789, 790, 791, 792, 800, 801, 802, 807, 808, 809, // Gen 7
    888, 889, 890, 891, 892, 893, 894, 895, 896, 897, 898, // Gen 8
  ],
  STAT_NAMES: {
    'hp': 'HP',
    'attack': 'ATK',
    'defense': 'DEF',
    'special-attack': 'SPA',
    'special-defense': 'SPD',
    'speed': 'SPE'
  },
  STAT_CLASSES: {
    'hp': 'stat-hp',
    'attack': 'stat-attack',
    'defense': 'stat-defense',
    'special-attack': 'stat-sp-atk',
    'special-defense': 'stat-sp-def',
    'speed': 'stat-speed'
  },
  TYPE_PARTICLES: {
    fire: { color: '#F08030', shape: 'circle', speed: 3 },
    water: { color: '#6890F0', shape: 'circle', speed: 1.5 },
    grass: { color: '#78C850', shape: 'polygon', speed: 1 },
    electric: { color: '#F8D030', shape: 'star', speed: 5 },
    ice: { color: '#98D8D8', shape: 'circle', speed: 0.5 },
    psychic: { color: '#F85888', shape: 'star', speed: 2 },
    ghost: { color: '#705898', shape: 'circle', speed: 1 },
    dragon: { color: '#7038F8', shape: 'star', speed: 4 },
    dark: { color: '#705848', shape: 'circle', speed: 1 },
    fairy: { color: '#EE99AC', shape: 'star', speed: 1.5 },
    fighting: { color: '#C03028', shape: 'polygon', speed: 3 },
    poison: { color: '#A040A0', shape: 'circle', speed: 2 },
    ground: { color: '#E0C068', shape: 'polygon', speed: 1 },
    flying: { color: '#A890F0', shape: 'circle', speed: 2 },
    bug: { color: '#A8B820', shape: 'circle', speed: 2 },
    rock: { color: '#B8A038', shape: 'polygon', speed: 0.5 },
    steel: { color: '#B8B8D0', shape: 'polygon', speed: 1 },
    normal: { color: '#A8A878', shape: 'circle', speed: 1 }
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// DOM ELEMENTS
// ═══════════════════════════════════════════════════════════════════════════

const elements = {
  generateBtn: document.getElementById('generate-btn'),
  pokemonCard: document.getElementById('pokemon-card'),
  pokemonImage: document.getElementById('pokemon-image'),
  pokemonName: document.getElementById('pokemon-name'),
  pokemonId: document.getElementById('pokemon-id'),
  pokemonTypes: document.getElementById('pokemon-types'),
  pokemonStats: document.getElementById('pokemon-stats'),
  statsTotal: document.getElementById('stats-total'),
  instruction: document.getElementById('instruction'),
  portalEffect: document.getElementById('portal-effect'),
  screenFlash: document.getElementById('screen-flash'),
  canvas: document.getElementById('pokeball-canvas')
};

// ═══════════════════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════════════════

let state = {
  isLoading: false,
  currentPokemon: null,
  pokeballOpen: false,
  particlesInstance: null,
  scene: null,
  camera: null,
  renderer: null,
  pokeball: null,
  topHalf: null,
  bottomHalf: null,
  mouseX: 0,
  mouseY: 0
};

// ═══════════════════════════════════════════════════════════════════════════
// THREE.JS SETUP - 3D POKÉBALL
// ═══════════════════════════════════════════════════════════════════════════

function initThreeJS() {
  // Scene
  state.scene = new THREE.Scene();

  // Camera
  state.camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  state.camera.position.z = 5;

  // Renderer
  state.renderer = new THREE.WebGLRenderer({
    canvas: elements.canvas,
    alpha: true,
    antialias: true
  });
  state.renderer.setSize(window.innerWidth, window.innerHeight);
  state.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Create Pokéball
  createPokeball();

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  state.scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0x00f5ff, 1, 100);
  pointLight1.position.set(5, 5, 5);
  state.scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0xff00aa, 0.8, 100);
  pointLight2.position.set(-5, -5, 5);
  state.scene.add(pointLight2);

  // Start animation loop
  animateThreeJS();

  // Event listeners
  window.addEventListener('resize', onWindowResize);
  window.addEventListener('mousemove', onMouseMove);
  elements.canvas.addEventListener('click', onPokeballClick);
}

function createPokeball() {
  state.pokeball = new THREE.Group();

  // Materials
  const redMaterial = new THREE.MeshPhongMaterial({
    color: 0xff3d3d,
    shininess: 100,
    specular: 0x444444
  });

  const whiteMaterial = new THREE.MeshPhongMaterial({
    color: 0xf0f0f0,
    shininess: 100,
    specular: 0x444444
  });

  const darkMaterial = new THREE.MeshPhongMaterial({
    color: 0x1a1a1a,
    shininess: 50
  });

  const buttonMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    shininess: 150,
    specular: 0xffffff,
    emissive: 0x00f5ff,
    emissiveIntensity: 0.3
  });

  // Top half (red)
  const topGeometry = new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  state.topHalf = new THREE.Mesh(topGeometry, redMaterial);
  state.topHalf.position.y = 0.02;

  // Bottom half (white)
  const bottomGeometry = new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
  state.bottomHalf = new THREE.Mesh(bottomGeometry, whiteMaterial);
  state.bottomHalf.position.y = -0.02;

  // Center band (black ring)
  const bandGeometry = new THREE.TorusGeometry(1, 0.08, 16, 100);
  const band = new THREE.Mesh(bandGeometry, darkMaterial);
  band.rotation.x = Math.PI / 2;

  // Center button
  const buttonGeometry = new THREE.SphereGeometry(0.2, 32, 32);
  const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
  button.position.z = 0.95;

  // Button ring
  const buttonRingGeometry = new THREE.TorusGeometry(0.25, 0.04, 16, 32);
  const buttonRing = new THREE.Mesh(buttonRingGeometry, darkMaterial);
  buttonRing.position.z = 0.92;

  // Add all parts to pokeball group
  state.pokeball.add(state.topHalf);
  state.pokeball.add(state.bottomHalf);
  state.pokeball.add(band);
  state.pokeball.add(button);
  state.pokeball.add(buttonRing);

  // Position the pokeball
  state.pokeball.position.y = 0.3;
  state.pokeball.scale.set(1.2, 1.2, 1.2);

  state.scene.add(state.pokeball);
}

function animateThreeJS() {
  requestAnimationFrame(animateThreeJS);

  if (state.pokeball && !state.pokeballOpen) {
    // Gentle rotation
    state.pokeball.rotation.y += 0.005;

    // Floating animation
    state.pokeball.position.y = 0.3 + Math.sin(Date.now() * 0.001) * 0.1;

    // Mouse follow (subtle)
    const targetRotationX = state.mouseY * 0.2;
    const targetRotationZ = -state.mouseX * 0.2;
    state.pokeball.rotation.x += (targetRotationX - state.pokeball.rotation.x) * 0.05;
    state.pokeball.rotation.z += (targetRotationZ - state.pokeball.rotation.z) * 0.05;
  }

  state.renderer.render(state.scene, state.camera);
}

function onWindowResize() {
  state.camera.aspect = window.innerWidth / window.innerHeight;
  state.camera.updateProjectionMatrix();
  state.renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
  state.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  state.mouseY = (event.clientY / window.innerHeight) * 2 - 1;

  // Parallax effect on floating orbs
  const orbs = document.querySelectorAll('.orb');
  orbs.forEach((orb, index) => {
    const speed = (index + 1) * 10;
    const x = state.mouseX * speed;
    const y = state.mouseY * speed;
    orb.style.transform = `translate(${x}px, ${y}px)`;
  });
}

function onPokeballClick(event) {
  // Ray casting to check if we clicked on the pokeball
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, state.camera);
  const intersects = raycaster.intersectObjects(state.pokeball.children, true);

  if (intersects.length > 0 && !state.isLoading) {
    triggerCatch();
  }
}

function openPokeball() {
  state.pokeballOpen = true;

  // Animate the pokeball opening
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

  // Add glow effect
  gsap.to(state.pokeball.scale, {
    x: 1.4,
    y: 1.4,
    z: 1.4,
    duration: 0.3,
    ease: 'power2.out'
  });
}

function closePokeball() {
  state.pokeballOpen = false;

  gsap.to(state.topHalf.position, {
    y: 0.02,
    duration: 0.4,
    ease: 'power2.inOut'
  });

  gsap.to(state.topHalf.rotation, {
    x: 0,
    duration: 0.4,
    ease: 'power2.inOut'
  });

  gsap.to(state.pokeball.scale, {
    x: 1.2,
    y: 1.2,
    z: 1.2,
    duration: 0.3,
    ease: 'power2.inOut'
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// TSPARTICLES SETUP
// ═══════════════════════════════════════════════════════════════════════════

async function initParticles() {
  state.particlesInstance = await tsParticles.load('tsparticles', {
    fullScreen: false,
    background: {
      color: 'transparent'
    },
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 800
        }
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
        straight: false,
        outModes: {
          default: 'out'
        }
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
        onHover: {
          enable: true,
          mode: 'grab'
        }
      },
      modes: {
        grab: {
          distance: 150,
          links: {
            opacity: 0.3,
            color: '#00f5ff'
          }
        }
      }
    }
  });
}

async function updateParticlesForType(typeName) {
  const typeConfig = CONFIG.TYPE_PARTICLES[typeName] || CONFIG.TYPE_PARTICLES.normal;

  if (state.particlesInstance) {
    await state.particlesInstance.destroy();
  }

  state.particlesInstance = await tsParticles.load('tsparticles', {
    fullScreen: false,
    background: {
      color: 'transparent'
    },
    particles: {
      number: {
        value: 100,
        density: {
          enable: true,
          value_area: 600
        }
      },
      color: {
        value: [typeConfig.color, '#00f5ff', '#ff00aa']
      },
      shape: {
        type: typeConfig.shape === 'star' ? ['star', 'circle'] : [typeConfig.shape]
      },
      opacity: {
        value: 0.7,
        random: true,
        animation: {
          enable: true,
          speed: 2,
          minimumValue: 0.2,
          sync: false
        }
      },
      size: {
        value: 4,
        random: true,
        animation: {
          enable: true,
          speed: 3,
          minimumValue: 1,
          sync: false
        }
      },
      move: {
        enable: true,
        speed: typeConfig.speed,
        direction: typeName === 'fire' ? 'top' : typeName === 'water' ? 'bottom' : 'none',
        random: true,
        straight: false,
        outModes: {
          default: 'out'
        }
      },
      twinkle: {
        particles: {
          enable: true,
          frequency: 0.1,
          opacity: 1,
          color: {
            value: typeConfig.color
          }
        }
      }
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: 'repulse'
        }
      },
      modes: {
        repulse: {
          distance: 100,
          duration: 0.4
        }
      }
    },
    emitters: typeName === 'fire' ? {
      position: {
        x: 50,
        y: 100
      },
      rate: {
        quantity: 5,
        delay: 0.1
      },
      size: {
        width: 100,
        height: 0
      },
      particles: {
        move: {
          direction: 'top',
          speed: 5
        },
        size: {
          value: 3
        },
        opacity: {
          value: 0.5
        }
      }
    } : undefined
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// API & DATA
// ═══════════════════════════════════════════════════════════════════════════

async function fetchRandomPokemon() {
  const randomId = Math.floor(Math.random() * CONFIG.TOTAL_POKEMON) + 1;
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch Pokemon');
  }

  return response.json();
}

function isLegendary(pokemonId) {
  return CONFIG.LEGENDARY_IDS.includes(pokemonId);
}

// ═══════════════════════════════════════════════════════════════════════════
// UI DISPLAY
// ═══════════════════════════════════════════════════════════════════════════

function displayPokemon(pokemon) {
  state.currentPokemon = pokemon;
  const legendary = isLegendary(pokemon.id);

  // Set image
  const imageUrl = pokemon.sprites.other['official-artwork'].front_default
    || pokemon.sprites.front_default;
  elements.pokemonImage.src = imageUrl;

  // Set name and ID
  elements.pokemonName.textContent = pokemon.name;
  elements.pokemonId.textContent = `#${pokemon.id.toString().padStart(3, '0')}`;

  // Calculate total stats
  const totalStats = pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0);
  elements.statsTotal.textContent = `TOTAL: ${totalStats}`;

  // Set types with GSAP animation
  elements.pokemonTypes.innerHTML = pokemon.types
    .map(t => `<span class="type-badge type-${t.type.name}">${t.type.name}</span>`)
    .join('');

  // Set stats (initially at 0 width)
  elements.pokemonStats.innerHTML = pokemon.stats
    .map(s => `
      <div class="stat-row">
        <span class="stat-name">${CONFIG.STAT_NAMES[s.stat.name]}</span>
        <div class="stat-bar-container">
          <div class="stat-bar ${CONFIG.STAT_CLASSES[s.stat.name]}" style="width: 0%"></div>
        </div>
        <span class="stat-value">${s.base_stat}</span>
      </div>
    `)
    .join('');

  // Apply legendary class if needed
  if (legendary) {
    elements.pokemonCard.classList.add('legendary');
  } else {
    elements.pokemonCard.classList.remove('legendary');
  }

  // Show card
  elements.pokemonCard.classList.remove('hidden');

  // Update particles based on primary type
  const primaryType = pokemon.types[0].type.name;
  updateParticlesForType(primaryType);

  // Animate everything with GSAP
  animateCardReveal(pokemon, legendary);
}

function animateCardReveal(pokemon, legendary) {
  const tl = gsap.timeline();

  // Card entrance
  tl.fromTo(elements.pokemonCard,
    {
      opacity: 0,
      scale: 0.8,
      y: 50,
      rotateX: -15
    },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      rotateX: 0,
      duration: 0.6,
      ease: 'back.out(1.7)'
    }
  );

  // Pokemon image
  tl.fromTo(elements.pokemonImage,
    {
      opacity: 0,
      scale: 0,
      rotation: -180
    },
    {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 0.5,
      ease: 'back.out(2)'
    },
    '-=0.3'
  );

  // Name
  tl.fromTo(elements.pokemonName,
    { opacity: 0, x: -30 },
    { opacity: 1, x: 0, duration: 0.3 },
    '-=0.2'
  );

  // ID
  tl.fromTo(elements.pokemonId,
    { opacity: 0, x: 30 },
    { opacity: 1, x: 0, duration: 0.3 },
    '-=0.3'
  );

  // Type badges (staggered)
  const badges = elements.pokemonTypes.querySelectorAll('.type-badge');
  tl.fromTo(badges,
    {
      opacity: 0,
      scale: 0,
      y: 20
    },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.3,
      stagger: 0.1,
      ease: 'back.out(2)'
    },
    '-=0.2'
  );

  // Stat bars (staggered animation)
  const statBars = elements.pokemonStats.querySelectorAll('.stat-bar');
  const statRows = elements.pokemonStats.querySelectorAll('.stat-row');

  tl.fromTo(statRows,
    { opacity: 0, x: -20 },
    {
      opacity: 1,
      x: 0,
      duration: 0.2,
      stagger: 0.05
    },
    '-=0.1'
  );

  // Animate stat bar widths
  pokemon.stats.forEach((s, i) => {
    const percentage = Math.min((s.base_stat / 255) * 100, 100);
    tl.to(statBars[i],
      {
        width: `${percentage}%`,
        duration: 0.6,
        ease: 'power2.out'
      },
      '-=0.5'
    );
  });

  // Screen effects for legendary
  if (legendary) {
    triggerLegendaryEffects();
  }
}

function triggerLegendaryEffects() {
  // Screen shake
  document.body.classList.add('screen-shake');
  setTimeout(() => {
    document.body.classList.remove('screen-shake');
  }, 500);

  // Extra particles burst
  if (state.particlesInstance) {
    // Create a burst of golden particles
    const container = state.particlesInstance.container;
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        container.particles.addParticle({
          x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
          y: window.innerHeight / 2 + (Math.random() - 0.5) * 200
        });
      }, i * 20);
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN INTERACTION FLOW
// ═══════════════════════════════════════════════════════════════════════════

async function triggerCatch() {
  if (state.isLoading) return;

  state.isLoading = true;
  elements.generateBtn.disabled = true;

  // Hide existing card
  if (!elements.pokemonCard.classList.contains('hidden')) {
    gsap.to(elements.pokemonCard, {
      opacity: 0,
      scale: 0.8,
      y: -30,
      duration: 0.3,
      onComplete: () => {
        elements.pokemonCard.classList.add('hidden');
      }
    });
  }

  // Update instruction text
  elements.instruction.textContent = 'Opening dimensional rift...';

  // Shake the pokeball
  gsap.to(state.pokeball.rotation, {
    z: Math.PI * 0.05,
    duration: 0.1,
    yoyo: true,
    repeat: 5,
    ease: 'power1.inOut'
  });

  // Wait a moment then open
  await new Promise(resolve => setTimeout(resolve, 600));

  // Open the pokeball
  openPokeball();

  // Trigger portal effect
  elements.portalEffect.classList.add('active');
  setTimeout(() => {
    elements.portalEffect.classList.remove('active');
  }, 1000);

  // Screen flash
  elements.screenFlash.classList.add('active');
  setTimeout(() => {
    elements.screenFlash.classList.remove('active');
  }, 300);

  try {
    const pokemon = await fetchRandomPokemon();

    // Small delay for dramatic effect
    await new Promise(resolve => setTimeout(resolve, 400));

    displayPokemon(pokemon);

    elements.instruction.textContent = isLegendary(pokemon.id)
      ? '✦ LEGENDARY POKÉMON DISCOVERED! ✦'
      : 'Pokémon materialized successfully!';

  } catch (error) {
    console.error('Error fetching Pokemon:', error);
    elements.instruction.textContent = 'Dimensional rift unstable. Try again.';

    gsap.fromTo(elements.instruction,
      { color: '#ff3d3d' },
      { color: 'rgba(255, 255, 255, 0.6)', duration: 2 }
    );
  } finally {
    // Close pokeball after a delay
    setTimeout(() => {
      closePokeball();
    }, 1000);

    state.isLoading = false;
    elements.generateBtn.disabled = false;
  }
}

// Button click handler
elements.generateBtn.addEventListener('click', triggerCatch);

// ═══════════════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════

async function init() {
  // Initialize Three.js
  initThreeJS();

  // Initialize particles
  await initParticles();

  // Initial entrance animations
  gsap.fromTo('.title',
    { opacity: 0, y: -30 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
  );

  gsap.fromTo('.instruction',
    { opacity: 0 },
    { opacity: 1, duration: 0.6, delay: 0.3 }
  );

  gsap.fromTo('.catch-btn',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.6, delay: 0.5, ease: 'back.out(1.7)' }
  );

  // Pokeball entrance
  gsap.fromTo(state.pokeball.position,
    { y: -5 },
    { y: 0.3, duration: 1, delay: 0.2, ease: 'bounce.out' }
  );

  gsap.fromTo(state.pokeball.scale,
    { x: 0, y: 0, z: 0 },
    { x: 1.2, y: 1.2, z: 1.2, duration: 0.8, delay: 0.2, ease: 'back.out(2)' }
  );
}

// Start everything when DOM is ready
document.addEventListener('DOMContentLoaded', init);
