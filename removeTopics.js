const fs = require('fs');

function removeTopicsBlock(file) {
    let content = fs.readFileSync(file, 'utf8');
    
    // We added the block with <div id="dynamicTopicsBlock" ... > ... </div></div>
    // Let's use a regex to strip it out entirely.
    // The block is enclosed in `<div id="dynamicTopicsBlock" ...> ... </div></div>` (two closing divs)
    
    // Non-greedy match from id="dynamicTopicsBlock" to the matching end </div>
    // We can just use string replacement if we extract exactly what we put there, but since it's hard to match nested divs with regex, 
    // let's do a more careful replacement.
    
    const regex = /<div id="dynamicTopicsBlock"[\s\S]*?Explore Topics Dynamically[\s\S]*?<\/div>\s*<\/div>/;
    
    if (regex.test(content)) {
        content = content.replace(regex, '');
        fs.writeFileSync(file, content, 'utf8');
    }
}

removeTopicsBlock('physics/index.html');
removeTopicsBlock('number-system/index.html');

console.log("Removed dynamic topics block from UI.");
