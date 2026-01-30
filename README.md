# Monster Portal

<p align="center">
  <img src="./screenshots/demo.gif" alt="Monster Portal Demo" width="450">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
  <img src="https://img.shields.io/badge/Electron-40.1.0-47848F?logo=electron" alt="Electron">
  <img src="https://img.shields.io/badge/Three.js-r128-black?logo=three.js" alt="Three.js">
</p>

A visually stunning Electron desktop app featuring 3D graphics, particle effects, and smooth animations. Built as a learning project to explore modern frontend techniques in a desktop environment.

> **Disclaimer:** This is an unofficial fan project for educational purposes. Not affiliated with Nintendo or The Pokémon Company. All Pokémon content belongs to their respective owners.
## ✨ Features

- **3D Pokéball** — Interactive Three.js model with physics-based opening animation
- **Dynamic Particles** — tsParticles background that changes based on Pokémon type
- **Holographic UI** — Glassmorphism cards with rotating gradient effects
- **Cinematic Animations** — GSAP-powered sequenced reveals and transitions
- **Visual Effects** — Screen shake, portal bursts, glitch effects, parallax movement
- **Legendary Detection** — Special golden effects for legendary Pokémon

## 🛠 Tech Stack

| Library                                  | Purpose                        |
| ---------------------------------------- | ------------------------------ |
| [Electron](https://www.electronjs.org/)  | Desktop app framework          |
| [Three.js](https://threejs.org/)         | 3D WebGL rendering             |
| [tsParticles](https://particles.js.org/) | Particle effects engine        |
| [GSAP](https://greensock.com/gsap/)      | Professional animation library |
| [PokéAPI](https://pokeapi.co/)           | Pokémon data source            |

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/BarakAlmog/monster-portal.git
cd monster-portal

# Install dependencies
npm install

# Run in development
npm start
```

## 📦 Building

```bash
# Build for macOS Apple Silicon (M1/M2/M3)
npm run build

# Build universal macOS binary (Intel + Apple Silicon)
npm run build:universal

# Build for Intel Macs only
npm run build:intel
```

After building, find your app in the `dist/` folder:

- `Monster Portal.app` — Direct application
- `Monster Portal-x.x.x-arm64.dmg` — macOS installer

## 📖 Documentation

Want to learn how the visual effects were built? Check out the comprehensive design system documentation:

**[📄 Design System Documentation](./docs/DESIGN_SYSTEM.md)**

Covers:

- Three.js 3D setup and animation loops
- tsParticles configuration and type-reactive particles
- GSAP timeline animations and easing
- CSS techniques (glassmorphism, glitch effects, gradients)
- Visual effects (screen shake, portal burst, parallax)

## 🎓 How This Was Built

**Tools used:** [Cursor IDE](https://cursor.com/) + [Claude Code](https://docs.anthropic.com/en/docs/claude-code)

This app was built entirely through prompts. Here's the journey.

**First, I set up a basic Electron app.** Opened an empty folder and asked Claude to look up the Electron docs and walk me through a Hello World on my Mac.

```
I want you to use your context7 MCP tool, and I want you to search for Electron documentation. I want to know what I need to do on my Mac in order to create a very simple Hello World Electron app.
```

**Then I wanted it to do something useful.** A blank window is boring, so I asked for ideas using the Pokémon API. Claude suggested a random Pokémon generator with stats and types.

```
Let's make something interesting. Let's make an app that reaches the Pokemon API. Allows me to write a Pokemon name or something like that. Could you suggest something for me? Let's make something nice and fun.
```

**Next, I asked for design ideas.** The basic version worked but looked generic. I triggered the frontend-design skill and asked for fun ideas. Claude came back with concepts like a retro Pokédex, a gacha machine, a holographic card, and more.

```
I want you to completely redesign it. Could you give me maybe some fun, cute, and unique ideas for design, and you can really go overboard with it based on what this app is doing?
```

**I wanted to push it even further.** The ideas were cool but I wanted something wilder - background patterns, floating elements, that kind of stuff. What about Three.js? That's when the 3D Pokéball, particles, and holographic UI came in.

```
What if I want to make it a little bit more interesting? For example, add maybe background patterns or elements, or these small widgets that you sometimes see on award-winning sites, for example stars, stuff like that. Make it really, really, really interesting. Should we use any library for that? What about libraries like Three.js? Let's kind of get wild with ideas here.
```

**I needed an icon.** Asked Claude to generate something simple. It created an SVG and converted it to all the macOS icon sizes.

```
Help me generate any icon that would look nice. You don't need to overthink it.
```

**Finally, I compiled it for my Mac.** Asked how to build it for Apple Silicon. Claude set up electron-builder with the right flags.

```
How do I compile it to run it on my machine? I have a Mac with Apple Silicon M1. How do I compile it so it runs efficiently and nicely on my machine?
```

That's it. The whole app came from a conversation - starting with "how do I make a Hello World" and ending with a 3D animated Pokémon portal.

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  Built with ❤️ using Electron, Three.js, tsParticles, and GSAP
</p>
