const gifList = [
    "cooltext515666701093763.gif",
    "cooltext515670797968968.gif",
    "cooltext515670818459612.gif",
    "cooltext515670830421931.gif",
    "cooltext515670847586193.gif",
    "cooltext515670863716158.gif",
    "cooltext515670883761544.gif"
];

const mainGif = document.getElementById("main-gif");
const gifContainer = document.getElementById("gif-container");
const particleContainer = document.getElementById("particle-container");

const gravity = 0.6;
const friction = 0.98; 
const bounce = -0.7;
let particles = [];

function getRandomGif() {
    const randomIndex = Math.floor(Math.random() * gifList.length);
    return `gifs/${gifList[randomIndex]}`;
}
mainGif.src = getRandomGif();
gifContainer.addEventListener("click", (e) => {
    mainGif.src = getRandomGif();
    const startX = e.clientX;
    const startY = e.clientY;

    // Spawn an exploding piece for every option inside our gif array
    gifList.forEach((gifName) => {
        createParticle(startX, startY, `gifs/${gifName}`);
    });
});

// Create and initialize a flying physics particle element
function createParticle(x, y, src) {
    const img = document.createElement("img");
    img.src = src;
    img.classList.add("gif-particle");
    particleContainer.appendChild(img);

    // Give it a random radial velocity vector shooting outwards/upwards
    const angle = Math.random() * Math.PI * 2; 
    const speed = Math.random() * 15 + 10; // Velocity magnitude

    const particle = {
        element: img,
        x: x - 60, // Center offset adjustment (half of 120px width)
        y: y - 60, // Center offset adjustment (half of 120px height)
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 5, // Lean upward momentum
        rotation: 0,
        vRotation: (Math.random() - 0.5) * 10
    };

    particles.push(particle);
}

// 2D Physics Update Loop Animation Frame
function updatePhysics() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];

        // Apply physics forces
        p.vy += gravity;
        p.vx *= friction;
        p.vy *= friction;

        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRotation;

        // Ground / Floor boundary collision collision check
        if (p.y + 120 >= screenHeight) {
            p.y = screenHeight - 120;
            p.vy *= bounce;
            p.vx *= 0.8; // Added friction on floor impact ground
        }

        // Left and right screen wall bounces
        if (p.x <= 0) {
            p.x = 0;
            p.vx *= bounce;
        } else if (p.x + 120 >= screenWidth) {
            p.x = screenWidth - 120;
            p.vx *= bounce;
        }
        p.element.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.rotation}deg)`;
    }

    requestAnimationFrame(updatePhysics);
}

// Kickstart our continuous animation update tracker loop
requestAnimationFrame(updatePhysics);
