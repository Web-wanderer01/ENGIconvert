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
    "Faraday's Law", "Lenz's Law", "Maxwell's Equations", "Snell's Law", "Photoelectric Effect",
    // 50 NEW TOPICS
    "Aerodynamics", "Aerospace Engineering", "Fluid Dynamics", "Hydrostatics", "Hydrodynamics",
    "Surface Tension", "Capillary Action", "Viscosity", "Poiseuille's Law", "Stokes' Law",
    "Reynolds Number", "Ideal Gas Law", "Van der Waals Equation", "Boyle's Law", "Charles's Law",
    "Specific Heat Capacity", "Latent Heat", "Thermal Conductivity", "Stefan-Boltzmann Law", "Wien's Displacement Law",
    "Simple Harmonic Motion", "Damped Oscillations", "Resonance", "Beat Frequencies", "Standing Waves",
    "Interference", "Diffraction", "Polarization", "Brewster's Angle", "Total Internal Reflection",
    "Lenses", "Mirrors", "Optical Instruments", "Telescopes", "Microscopes",
    "Electric Potential", "Capacitance", "Dielectrics", "Biot-Savart Law", "Ampere's Law",
    "Magnetic Flux", "Lorentz Force", "Hall Effect", "Transformers", "LC Circuits",
    "RCL Circuits", "Impedance", "Phasors", "Poynting Vector", "Radiation Pressure"
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
    "Fourier Series", "Z-Transforms", "Permutations & Combinations", "Binomial Theorem", "Markov Chains",
    // 50 NEW TOPICS
    "Partial Differential Equations", "Ordinary Differential Equations", "Fourier Transforms", "Taylor Series", "Maclaurin Series",
    "L'Hopital's Rule", "Integration by Parts", "U-Substitution", "Trigonometric Substitution", "Partial Fractions",
    "Polar Coordinates", "Parametric Equations", "Cylindrical Coordinates", "Spherical Coordinates", "Line Integrals",
    "Surface Integrals", "Green's Theorem", "Stokes' Theorem", "Divergence Theorem", "Gradient, Divergence & Curl",
    "Vector Spaces", "Subspaces", "Basis & Dimension", "Linear Transformations", "Inner Product Spaces",
    "Orthogonality", "Gram-Schmidt Process", "SVD (Singular Value Decomposition)", "LU Decomposition", "QR Decomposition",
    "Bayes' Theorem", "Normal Distribution", "Poisson Distribution", "Binomial Distribution", "Exponential Distribution",
    "Hypothesis Testing", "Confidence Intervals", "ANOVA", "Regression Analysis", "Correlation",
    "Modular Arithmetic", "Prime Numbers", "Fermat's Little Theorem", "Euler's Totient Function", "Diophantine Equations",
    "Propositional Logic", "Predicate Logic", "Truth Tables", "Tautologies", "Mathematical Induction"
];

function buildPills(topics, subject) {
    let html = `<div id="dynamicTopicsBlock" style="margin-top: 1rem; margin-bottom: 2rem; max-width:800px; margin-left:auto; margin-right:auto; text-align:left;">
        <h4 style="color:var(--text); margin-bottom:0.8rem; font-size:0.9rem; text-transform:uppercase; letter-spacing:1px;" class="muted">Explore Topics Dynamically (${topics.length} topics)</h4>
        <div style="display:flex; flex-wrap:wrap; gap:0.5rem; max-height: 250px; overflow-y: auto; padding: 0.5rem; border: 1px solid var(--border); border-radius: 8px; background: rgba(0,0,0,0.1);">`;
    
    topics.forEach(t => {
        html += `\n          <button class="mini-btn" style="cursor:pointer; background:var(--card); border:1px solid var(--border); padding:0.4rem 0.8rem; border-radius:12px; transition:all 0.2s;" onmouseover="this.style.borderColor='var(--color-primary)'" onmouseout="this.style.borderColor='var(--border)'" onclick="document.getElementById('formulaSearch').value='${t}'; triggerAISearch('${subject}');"> ${t} </button>`;
    });

    html += `\n        </div>\n      </div>`;
    return html;
}

function replaceTopics(file, topics, subject) {
    let content = fs.readFileSync(file, 'utf8');
    
    // The previous block was wrapped in <div style="margin-top: 1rem; margin-bottom: 2rem;"> ... </div>
    // Let's use a regex that matches from <h4 ... Explore Topics Dynamically to </div></div>
    const regex = /<div style="margin-top: 1rem; margin-bottom: 2rem;[^>]*>[\s\S]*?<h4[^>]*>Explore Topics Dynamically[\s\S]*?<\/div>\s*<\/div>/;
    
    if (regex.test(content)) {
        content = content.replace(regex, buildPills(topics, subject));
    } else {
        // If it fails, fallback to replacing <div id="dynamicTopicsBlock"> if we run this multiple times
        const idRegex = /<div id="dynamicTopicsBlock"[\s\S]*?<\/div>\s*<\/div>/;
        if (idRegex.test(content)) {
            content = content.replace(idRegex, buildPills(topics, subject));
        }
    }
    
    fs.writeFileSync(file, content, 'utf8');
}

replaceTopics('physics/index.html', physicsTopics, 'Physics');
replaceTopics('number-system/index.html', mathTopics, 'Engineering Mathematics');
console.log("Upgraded to 100+ topics each!");
