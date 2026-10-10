const fs = require('fs');
const path = require('path');

const newFooter = `<footer class="footer" style="background: var(--card); border-top: 1px solid var(--border); padding: 3rem 0; margin-top: 4rem;">
    <div class="wrap" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; text-align: left;">
      <div>
        <a class="logo" href="/" style="display:inline-flex; align-items:center; gap:0.5rem; font-size:1.5rem; font-weight:800; color:var(--text); text-decoration:none; margin-bottom: 1rem;">
          <span class="logo-mark" style="background:var(--color-primary); color:#fff; padding:0.2rem 0.6rem; border-radius:0.5rem;">Σ</span>EngiConvert
        </a>
        <p class="muted" style="line-height: 1.6; font-size: 0.95rem;">
          A comprehensive suite of engineering calculators, AI solvers, and academic resources designed for students and professionals. Built by Jatin Singh Bisht.
        </p>
      </div>
      <div>
        <h3 style="color: var(--text); margin-bottom: 1rem; font-size: 1.1rem;">Quick Links</h3>
        <ul style="list-style: none; padding: 0; display: grid; gap: 0.5rem;">
          <li><a href="/universal-solver" class="muted" style="text-decoration: none; transition: color 0.2s;">✨ AI Solver</a></li>
          <li><a href="/academic-hub" class="muted" style="text-decoration: none; transition: color 0.2s;">📚 Academic Hub</a></li>
          <li><a href="/physics" class="muted" style="text-decoration: none; transition: color 0.2s;">⚛️ Physics Tools</a></li>
          <li><a href="/maths" class="muted" style="text-decoration: none; transition: color 0.2s;">📐 Math Tools</a></li>
          <li><a href="/formulas" class="muted" style="text-decoration: none; transition: color 0.2s;">🧪 Formula Library</a></li>
        </ul>
      </div>
      <div>
        <h3 style="color: var(--text); margin-bottom: 1rem; font-size: 1.1rem;">Connect with me</h3>
        <ul style="list-style: none; padding: 0; display: grid; gap: 0.5rem;">
          <li><a href="https://www.linkedin.com/in/jatin-singh-bisht-019648380" target="_blank" class="muted" style="text-decoration: none; display: flex; align-items: center; gap: 0.5rem; transition: color 0.2s;">💼 LinkedIn</a></li>
          <li><a href="https://github.com/Web-wanderer01/GARUD-The_Geo-Rakshak" target="_blank" class="muted" style="text-decoration: none; display: flex; align-items: center; gap: 0.5rem; transition: color 0.2s;">🦅 GitHub (GARUD)</a></li>
          <li><a href="https://github.com/Web-wanderer01" target="_blank" class="muted" style="text-decoration: none; display: flex; align-items: center; gap: 0.5rem; transition: color 0.2s;">🐱 GitHub Profile</a></li>
        </ul>
      </div>
    </div>
    <div class="wrap" style="text-align: center; margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid var(--border); color: var(--color-muted); font-size: 0.9rem;">
      &copy; 2026 EngiConvert. All rights reserved.
    </div>
  </footer>`;

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
        
        // Find existing footer and replace it
        // Note: some files might have <footer class="footer"> ... </footer>
        // Using a non-greedy regex to match the footer block
        const updatedContent = content.replace(/<footer class="footer">[\s\S]*?<\/footer>/, newFooter);
        
        if (content !== updatedContent) {
            fs.writeFileSync(file, updatedContent, 'utf8');
            updated++;
        }
    } catch (e) {
        console.log("Error processing", file, e.message);
    }
}
console.log('Updated ' + updated + ' files successfully.');
