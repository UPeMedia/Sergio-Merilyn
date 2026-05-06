const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Remove the tweaks sidebar
html = html.replace(/<aside class="tweaks" id="tweaks">.*?<\/aside>/s, '');

// Format HTML slightly by adding newlines before sections
html = html.replace(/(<section|<footer|<main)/g, '\n$1');

fs.writeFileSync('index.html', html);
console.log('Cleaned up index.html');
