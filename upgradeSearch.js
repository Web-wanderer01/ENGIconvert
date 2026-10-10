const fs = require('fs');

function upgradeSearch(file, subjectName) {
    let content = fs.readFileSync(file, 'utf8');

    // 1. Add marked.js to head if not there
    if (!content.includes('marked.min.js')) {
        content = content.replace('</head>', '  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>\n</head>');
    }

    // 2. Modify the search input to include AI button and wrapper
    // For physics
    if (file.includes('physics')) {
        content = content.replace(
            /<input[\s\S]*?id="formulaSearch"[\s\S]*?>/,
            `<div style="display:flex; gap:0.5rem; width:100%;">
              <input class="input formula-search" id="formulaSearch" type="text" placeholder="Search force, energy, velocity..." oninput="filterFormulas()" onkeydown="handleAISearch(event, '${subjectName}')" style="flex:1;">
              <button class="btn" onclick="triggerAISearch('${subjectName}')" id="aiSearchBtn" style="background:var(--color-primary); color:white; flex-shrink:0;">✨ AI Search</button>
            </div>`
        );
    } 
    // For number-system
    else if (file.includes('number-system')) {
        content = content.replace(
            /<input[\s\S]*?id="formulaSearch"[\s\S]*?>/,
            `<div style="display:flex; gap:0.5rem; width:100%; max-width:800px; margin:0 auto;">
              <input id="formulaSearch" class="search-box" type="search" placeholder="Search formulas, e.g. divisibility..." style="flex:1; margin:0;" onkeydown="handleAISearch(event, '${subjectName}')">
              <button class="btn" onclick="triggerAISearch('${subjectName}')" id="aiSearchBtn" style="background:var(--color-primary); color:white; padding: 0 1.5rem; border-radius:12px; flex-shrink:0;">✨ AI Search</button>
            </div>`
        );
    }
    // For formulas
    else if (file.includes('formulas')) {
        content = content.replace(
            /<input[\s\S]*?id="searchInput"[\s\S]*?>/,
            `<div style="display:flex; gap:0.5rem; width:100%;">
              <input class="search-box" id="searchInput" type="text" placeholder="Search formulas... (e.g. Area, Velocity)" style="flex:1; margin:0;" onkeydown="handleAISearch(event, '${subjectName}')">
              <button class="btn" onclick="triggerAISearch('${subjectName}')" id="aiSearchBtn" style="background:var(--color-primary); color:white; padding: 0 1.5rem; border-radius:12px; flex-shrink:0;">✨ AI Search</button>
            </div>`
        );
    }

    // 3. Inject JS logic before </body>
    const aiJs = `
<style>
#aiResultDiv {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid var(--border);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  line-height: 1.6;
}
#aiResultDiv h1, #aiResultDiv h2, #aiResultDiv h3 { margin-top: 1.5rem; margin-bottom: 0.5rem; }
#aiResultDiv ul, #aiResultDiv ol { margin-left: 1.5rem; margin-bottom: 1rem; }
#aiResultDiv p { margin-bottom: 1rem; }
#aiResultDiv pre { background: #0f172a; padding: 1rem; border-radius: 8px; overflow-x: auto; margin-bottom: 1rem; }
#aiResultDiv code { font-family: monospace; color: #a5b4fc; }
</style>
<script>
async function triggerAISearch(subject) {
  const inputEl = document.getElementById(document.getElementById("formulaSearch") ? "formulaSearch" : "searchInput");
  const query = inputEl.value.trim();
  if (!query) return;
  const btn = document.getElementById("aiSearchBtn");
  btn.innerText = "Searching AI...";
  btn.disabled = true;
  
  try {
    const res = await fetch('/api/ai-academic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        level: "General",
        subject: subject,
        resourceType: "Explain and provide formulas for: " + query
      })
    });
    const data = await res.json();
    if (data.markdown) {
        let aiResultDiv = document.getElementById("aiResultDiv");
        if (!aiResultDiv) {
             aiResultDiv = document.createElement('div');
             aiResultDiv.id = "aiResultDiv";
             aiResultDiv.className = "card panel";
             aiResultDiv.style.gridColumn = "1 / -1"; 
             aiResultDiv.style.marginBottom = "2rem";
             aiResultDiv.style.padding = "2rem";
             
             const pageHead = document.querySelector('.page-head') || document.querySelector('.page-header');
             if (pageHead) {
                 pageHead.parentNode.insertBefore(aiResultDiv, pageHead.nextSibling);
             } else {
                 document.querySelector('main .wrap').prepend(aiResultDiv);
             }
        }
        aiResultDiv.innerHTML = \`<h3 style="margin-bottom:1.5rem; color:var(--color-primary); font-size:1.5rem; border-bottom:1px solid var(--border); padding-bottom:0.5rem;">✨ AI Result: \${query}</h3>\` + 
            (typeof marked !== 'undefined' ? marked.parse(data.markdown) : \`<pre style="white-space:pre-wrap;">\${data.markdown}</pre>\`);
    }
  } catch (err) {
    alert("AI Search failed.");
  }
  btn.innerText = "✨ AI Search";
  btn.disabled = false;
}
function handleAISearch(e, subject) {
  if (e.key === 'Enter') triggerAISearch(subject);
}
</script>`;
    
    if (!content.includes('triggerAISearch')) {
        content = content.replace('</body>', aiJs + '\n</body>');
    }

    fs.writeFileSync(file, content, 'utf8');
}

try { upgradeSearch('physics/index.html', 'Physics'); } catch(e){ console.error(e) }
try { upgradeSearch('number-system/index.html', 'Engineering Mathematics'); } catch(e){ console.error(e) }
try { upgradeSearch('formulas/index.html', 'All Engineering Formulas'); } catch(e){ console.error(e) }

console.log('Upgraded search bars with AI functionality!');
