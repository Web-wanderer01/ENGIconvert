const fs = require('fs');

// 1. Update Physics
let physics = fs.readFileSync('physics/index.html', 'utf8');
const morePhysics = `
{
  id: "kinematics1", category: "Kinematics", name: "Final Velocity (v = u + at)", formula: "v = u + a * t", description: "Calculate final velocity given initial velocity, acceleration, and time.",
  inputs: [ ["u", "Initial Velocity (m/s)"], ["a", "Acceleration (m/s)"], ["t", "Time (s)"] ],
  calc: v => {
    let result = v.u + (v.a * v.t);
    return { value: result.toFixed(2) + " m/s", steps: ["v = u + at", \`v = \${v.u} + (\${v.a} * \${v.t})\`, \`v = \${result.toFixed(2)}\`] };
  }
},
{
  id: "work", category: "Energy & Work", name: "Work Done", formula: "W = F * d", description: "Calculate work done by a force.",
  inputs: [ ["F", "Force (N)"], ["d", "Distance (m)"] ],
  calc: v => {
    let result = v.F * v.d;
    return { value: result.toFixed(2) + " J", steps: ["W = F * d", \`W = \${v.F} * \${v.d}\`, \`W = \${result.toFixed(2)} Joules\`] };
  }
},
{
  id: "power", category: "Energy & Work", name: "Power", formula: "P = W / t", description: "Calculate power.",
  inputs: [ ["W", "Work (J)"], ["t", "Time (s)"] ],
  calc: v => {
    let result = v.W / v.t;
    return { value: result.toFixed(2) + " W", steps: ["P = W / t", \`P = \${v.W} / \${v.t}\`, \`P = \${result.toFixed(2)} Watts\`] };
  }
},
`;
physics = physics.replace('const formulas = [', 'const formulas = [\n' + morePhysics);
fs.writeFileSync('physics/index.html', physics, 'utf8');

// 2. Update Maths
let maths = fs.readFileSync('maths/index.html', 'utf8');
const moreMaths = `
{
  id: "pythagoras", category: "Geometry", name: "Pythagorean Theorem", formula: "c = (a + b)", description: "Calculate hypotenuse of a right triangle.",
  inputs: [ ["a", "Side a"], ["b", "Side b"] ],
  calc: v => {
    let result = Math.sqrt(v.a*v.a + v.b*v.b);
    return { value: result.toFixed(2), steps: ["c = (a + b)", \`c = (\${v.a} + \${v.b})\`, \`c = \${result.toFixed(2)}\`] };
  }
},
{
  id: "circleArea", category: "Geometry", name: "Area of a Circle", formula: "A = p * r", description: "Calculate area of a circle.",
  inputs: [ ["r", "Radius"] ],
  calc: v => {
    let result = Math.PI * (v.r * v.r);
    return { value: result.toFixed(2), steps: ["A = p * r", \`A = p * \${v.r}\`, \`A = \${result.toFixed(2)}\`] };
  }
},
`;
maths = maths.replace('const formulas = [', 'const formulas = [\n' + moreMaths);
fs.writeFileSync('maths/index.html', maths, 'utf8');

// 3. Update Formulas (Static HTML blocks)
let formulas = fs.readFileSync('formulas/index.html', 'utf8');
const moreStaticFormulas = `
        <article class="card formula lift"><span class="tag">Chemistry</span><h3>Molarity</h3><div class="formula-code">M = n / V</div><p class="muted">Moles of solute per liter of solution.</p></article>
        <article class="card formula lift"><span class="tag">Chemistry</span><h3>pH Equation</h3><div class="formula-code">pH = -log[H+]</div><p class="muted">Measure of hydrogen ion concentration.</p></article>
        <article class="card formula lift"><span class="tag">Physics</span><h3>Newton's 2nd Law</h3><div class="formula-code">F = ma</div><p class="muted">Force equals mass times acceleration.</p></article>
        <article class="card formula lift"><span class="tag">Finance</span><h3>Compound Interest</h3><div class="formula-code">A = P(1+r/n)^(nt)</div><p class="muted">Interest calculated on the initial principal.</p></article>
`;
formulas = formulas.replace('<div class="grid">', '<div class="grid">\n' + moreStaticFormulas);
fs.writeFileSync('formulas/index.html', formulas, 'utf8');

// 4. Update Unit Converter
let units = fs.readFileSync('unit-converter/index.html', 'utf8');
const moreUnits = `
DataStorage: {
  label: "Data Storage",
  units: {
    b: { name: "Bits", symbol: "b", convert: 1 / 8 },
    B: { name: "Bytes", symbol: "B", convert: 1 },
    KB: { name: "Kilobytes", symbol: "KB", convert: 1024 },
    MB: { name: "Megabytes", symbol: "MB", convert: 1048576 },
    GB: { name: "Gigabytes", symbol: "GB", convert: 1073741824 },
    TB: { name: "Terabytes", symbol: "TB", convert: 1099511627776 },
  }
},
Time: {
  label: "Time",
  units: {
    ms: { name: "Milliseconds", symbol: "ms", convert: 0.001 },
    s: { name: "Seconds", symbol: "s", convert: 1 },
    min: { name: "Minutes", symbol: "min", convert: 60 },
    hr: { name: "Hours", symbol: "hr", convert: 3600 },
    day: { name: "Days", symbol: "d", convert: 86400 },
  }
},
`;
units = units.replace('/* ================= LENGTH ================= */', '/* ================= NEW CATS ================= */\n' + moreUnits + '\n/* ================= LENGTH ================= */');
fs.writeFileSync('unit-converter/index.html', units, 'utf8');

console.log("Successfully injected new static content!");
