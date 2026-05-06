const fs = require('fs');

let html = fs.readFileSync('scraped.html', 'utf8');

// Extract all styles
let styles = '';
const styleRegex = /<style>(.*?)<\/style>/gs;
let match;
while ((match = styleRegex.exec(html)) !== null) {
  styles += match[1] + '\n\n';
}
fs.writeFileSync('style.css', styles.trim());

// Remove old style tags
html = html.replace(styleRegex, '');

// Clean up <head>
html = html.replace(/<script[^>]*>window\.__resources = {};<\/script>/, '');
html = html.replace(/<script[^>]*src="[^"]*"[^>]*><\/script>/g, '');
html = html.replace(/<script type="text\/babel"[^>]*><\/script>/g, '');

// Clean up the font blob urls, we'll replace them with generic fonts or Google fonts if possible,
// but for now just leave them or let it fallback to CSS vars.
// The CSS is in style.css, the html doesn't have the inline styles anymore.

// Add link to style.css and script.js in head
html = html.replace('</head>', '  <link rel="stylesheet" href="style.css">\n</head>');
html = html.replace('</body>', '  <script src="script.js"></script>\n</body>');

fs.writeFileSync('index.html', html);
console.log('Successfully split into index.html and style.css');
