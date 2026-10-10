const fs = require('fs');
const path = require('path');

const newNav = `<nav class="navlinks">
        <a href="/universal-solver" style="color:var(--color-primary); font-weight:bold;">AI Solver ✨</a>
        <a href="/academic-hub" style="color:#10b981; font-weight:bold;">Academic Hub 📚</a>
        <a href="/number-system">Numbers</a>
        <a href="/unit-converter">Units</a>
        <a href="/computer-science">CS</a>
        <a href="/physics">Physics</a>
        <a href="/formulas">Formulas</a>
      </nav>`;

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        if (file === 'node_modules' || file === 'scratch' || file === '.git' || file === 'backend') return;
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('index.html')) results.push(file);
        }
    });
    return results;
}

const files = walk('.');
if (!files.includes('index.html')) { files.push('index.html'); }

let updated = 0;
for (const file of files) {
    try {
        let content = fs.readFileSync(file, 'utf8');
        const updatedContent = content.replace(/<nav class="navlinks">[\s\S]*?<\/nav>/, newNav);
        if (content !== updatedContent) {
            fs.writeFileSync(file, updatedContent, 'utf8');
            updated++;
        }
    } catch (e) {
        console.log("Error processing", file, e.message);
    }
}
console.log('Updated ' + updated + ' files successfully.');
