        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const navHeight = document.querySelector('.nav').offsetHeight;
                    const targetPosition = target.offsetTop - navHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Navigation scroll effect
        window.addEventListener('scroll', function() {
            const nav = document.getElementById('nav');
            if (window.scrollY > 100) {
                nav.classList.add('nav-scrolled');
            } else {
                nav.classList.remove('nav-scrolled');
            }
        });

        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Initialize animations on page load
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize Lucide icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            
            // Add animate class to enable animations
            document.querySelectorAll('.fade-in').forEach(el => {
                el.classList.add('animate');
                observer.observe(el);
            });
        });
const canvas = document.getElementById("particles-canvas");
const ctx = canvas.getContext("2d");

let width = canvas.width = window.innerWidth;
let height = canvas.height = document.querySelector('.hero').offsetHeight;

window.addEventListener("resize", () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = document.querySelector('.hero').offsetHeight;
});

// Configuration
const NODE_COUNT = 80;
const CONNECTIONS_PER_NODE = 5;
const CONNECT_DISTANCE = 200;
const nodes = [];

for (let i = 0; i < NODE_COUNT; i++) {
  nodes.push({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6,
    radius: Math.random() * 2 + 1.5
  });
}

// Path Grammar-style formula snippets
const formulas = [
  // Basic Path Grammar Rules (RW1 - Binary Rules)
  "S → [NP] VP",
  "VP → [V] NP", 
  "NP → [DT] N",
  "NP → [ADJ] N",
  // Extended Path Grammar - Slash Categories (RW4-RW6)
  "S → S/NP",
  "S/NP → [NP] VP/NP",
  "VP/NP → [V] PP",
  "S → WH S/NP",
  
  // LINK Structures (RW7-RW8)
  "NP → DET LINK(RC)",
  "S → [NP] VP LINK(ADV)",
  // Coordination
  "NP → [NP] CONJ NP",
  "VP → [VP] CONJ VP",
];

const formulaSprites = Array.from({ length: 12 }).map(() => ({
  text: formulas[Math.floor(Math.random() * formulas.length)],
  x: Math.random() * width,
  y: Math.random() * height,
  speed: 0.1 + Math.random() * 0.2,
  opacity: 0.04 + Math.random() * 0.07,
  fontSize: 12 + Math.random() * 6,
  angle: (Math.random() - 0.5) * 0.2
}));

function drawConnections() {
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i];

    const nearest = nodes
      .map((b, j) => ({ node: b, dist: Math.hypot(a.x - b.x, a.y - b.y) }))
      .filter((_, j) => j !== i)
      .sort((a, b) => a.dist - b.dist)
      .slice(0, CONNECTIONS_PER_NODE);

    for (const { node: b, dist } of nearest) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(167,139,250,${1 - dist / CONNECT_DISTANCE})`; // theme purple-white
      ctx.lineWidth = 0.5;
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
  }
}

function drawFormulas() {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "#a78bfa";
  ctx.shadowBlur = 2;

  for (let f of formulaSprites) {
    ctx.fillStyle = `rgba(255, 255, 255, ${f.opacity})`;
    ctx.font = `${f.fontSize}px JetBrains Mono, monospace`;
    ctx.translate(f.x, f.y);
    ctx.rotate(f.angle);
    ctx.fillText(f.text, 0, 0);
    ctx.rotate(-f.angle);
    ctx.translate(-f.x, -f.y);

    f.y -= f.speed;
    if (f.y < -20) {
      f.y = height + 20;
      f.x = Math.random() * width;
      f.text = formulas[Math.floor(Math.random() * formulas.length)];
    }
  }

  ctx.restore();
}

function animateNetwork() {
  ctx.clearRect(0, 0, width, height);

  drawConnections();
  drawFormulas();

  for (let n of nodes) {
    ctx.beginPath();
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
    ctx.fill();

    n.x += n.vx;
    n.y += n.vy;

    if (n.x < 0 || n.x > width) n.vx *= -1;
    if (n.y < 0 || n.y > height) n.vy *= -1;
  }

  requestAnimationFrame(animateNetwork);
}

animateNetwork();
