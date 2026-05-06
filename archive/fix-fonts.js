const fs = require('fs');

const templateHtml = fs.readFileSync('archive/template.html', 'utf8');
const styleCss = fs.readFileSync('style.css', 'utf8');

// Extract the font styles block from template (first <style> block)
const fontStylesMatch = templateHtml.match(/<style>\/\* cyrillic-ext \*\/([\s\S]*?)<\/style>/);
if (fontStylesMatch) {
  let fontStyles = '/* cyrillic-ext */' + fontStylesMatch[1];
  
  // Prepend assets/fonts/ to UUIDs
  fontStyles = fontStyles.replace(/url\("([^"]+)"\)/g, 'url("assets/fonts/$1.woff2")');
  
  // Remove all current font-faces from style.css
  let newStyleCss = styleCss.replace(/@font-face\s*\{[^}]+\}/g, '');
  
  // Add the cleaned font styles at the top
  newStyleCss = fontStyles + '\n\n' + newStyleCss.trim();
  
  fs.writeFileSync('style.css', newStyleCss);
  console.log('Fixed fonts in style.css');
} else {
  console.log('Could not find font block');
}
