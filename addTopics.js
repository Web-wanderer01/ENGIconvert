const fs = require('fs');

const physicsTopics = [
    "Classical Mechanics", "Kinematics", "Newton's Laws", "Work, Energy & Power", "Rotational Motion",
    "Gravitation", "Fluid Mechanics", "Thermodynamics", "Kinetic Theory of Gases", "Heat Transfer",
    "Oscillations & Waves", "Sound Waves", "Electrostatics", "Current Electricity", "Magnetism",
    "Electromagnetic Induction", "Alternating Current", "Electromagnetic Waves", "Optics", "Wave Optics",
    "Quantum Mechanics", "Atomic Physics", "Nuclear Physics", "Particle Physics", "Relativity",
    "Solid State Physics", "Semiconductors", "Astrophysics", "Plasma Physics", "String Theory",
    "Photonics", "Biophysics", "Geophysics", "Acoustics", "Cryogenics",
    "Projectile Motion", "Friction", "Center of Mass", "Torque", "Angular Momentum",
    "Kepler's Laws", "Archimedes Principle", "Bernoulli's Equation", "Carnot Engine", "Entropy",
    "Doppler Effect", "Coulomb's Law", "Gauss's Law", "Ohm's Law", "Kirchhoff's Laws",
    "Faraday's Law", "Lenz's Law", "Maxwell's Equations", "Snell's Law", "Photoelectric Effect"
];

const mathTopics = [
    "Algebra", "Linear Algebra", "Abstract Algebra", "Boolean Algebra", "Geometry",
    "Euclidean Geometry", "Analytic Geometry", "Trigonometry", "Calculus", "Differential Calculus",
    "Integral Calculus", "Multivariable Calculus", "Vector Calculus", "Differential Equations", "Real Analysis",
    "Complex Analysis", "Topology", "Number Theory", "Combinatorics", "Graph Theory",
    "Probability", "Statistics", "Game Theory", "Operations Research", "Numerical Analysis",
    "Optimization", "Cryptography", "Set Theory", "Logic", "Category Theory",
    "Fractions & Decimals", "Percentages", "Ratios & Proportions", "Polynomials", "Quadratic Equations",
    "Logarithms", "Exponentials", "Sequences & Series", "Arithmetic Progression (AP)", "Geometric Progression (GP)",
    "Matrices", "Determinants", "Eigenvalues & Eigenvectors", "Vectors", "Complex Numbers",
    "Functions", "Limits & Continuity", "Derivatives", "Integrals", "Laplace Transforms",
    "Fourier Series", "Z-Transforms", "Permutations & Combinations", "Binomial Theorem", "Markov Chains"
];

function buildPills(topics) {
    let html = `<div style="margin-top: 1rem; margin-bottom: 2rem;">
        <h4 style="color:var(--text); margin-bottom:0.8rem; font-size:0.9rem; text-transform:uppercase; letter-spacing:1px;" class="muted">Explore Topics Dynamically</h4>
        <div style="display:flex; flex-wrap:wrap; gap:0.5rem; max-height: 200px; overflow-y: auto; padding: 0.5rem; border: 1px solid var(--border); border-radius: 8px; background: rgba(0,0,0,0.1);">`;
    
    topics.forEach(t => {
        html += `\n          <button class="mini-btn" style="cursor:pointer; background:var(--card); border:1px solid var(--border); padding:0.4rem 0.8rem; border-radius:12px; transition:all 0.2s;" onmouseover="this.style.borderColor='var(--color-primary)'" onmouseout="this.style.borderColor='var(--border)'" onclick="document.getElementById('formulaSearch').value='${t}'; triggerAISearch();"> ${t} </button>`;
    });

    html += `\n        </div>\n      </div>`;
    return html;
}

// 1. Inject into Physics
let physics = fs.readFileSync('physics/index.html', 'utf8');
if (!physics.includes('Explore Topics Dynamically')) {
    physics = physics.replace(/(<div style="display:flex; gap:0.5rem; width:100%;">[\s\S]*?<\/div>)/, `$1\n` + buildPills(physicsTopics));
    fs.writeFileSync('physics/index.html', physics, 'utf8');
}

// 2. Inject into Number System (Maths)
let maths = fs.readFileSync('number-system/index.html', 'utf8');
if (!maths.includes('Explore Topics Dynamically')) {
    maths = maths.replace(/(<div style="display:flex; gap:0.5rem; width:100%; max-width:800px; margin:0 auto;">[\s\S]*?<\/div>)/, `$1\n` + buildPills(mathTopics).replace('margin-top: 1rem; margin-bottom: 2rem;', 'margin-top: 1rem; margin-bottom: 2rem; max-width:800px; margin-left:auto; margin-right:auto; text-align:left;'));
    fs.writeFileSync('number-system/index.html', maths, 'utf8');
}

console.log("Injected massive topic list into pages!");
