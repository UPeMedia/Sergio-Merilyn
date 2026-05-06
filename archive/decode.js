const fs = require('fs');
const zlib = require('zlib');

const html = fs.readFileSync('index.html', 'utf8');

// Extract the template
const templateMatch = html.match(/<script type="__bundler\/template">\s*"(.*?)"\s*<\/script>/s);
if (templateMatch) {
  // The string is JSON encoded inside the script tag, so we parse it
  const templateStr = JSON.parse(`"${templateMatch[1]}"`);
  fs.writeFileSync('template.html', templateStr);
  console.log('Saved template.html');
}

// Extract manifest blobs
const manifestMatch = html.match(/<script type="__bundler\/manifest">\s*(\{.*?\})\s*<\/script>/s);
if (manifestMatch) {
  const manifest = JSON.parse(manifestMatch[1]);
  for (const [uuid, entry] of Object.entries(manifest)) {
    const buffer = Buffer.from(entry.data, 'base64');
    let content = buffer;
    if (entry.compressed) {
      content = zlib.gunzipSync(buffer);
    }
    
    let ext = 'bin';
    if (entry.mime.includes('javascript')) ext = 'js';
    else if (entry.mime.includes('css')) ext = 'css';
    else if (entry.mime.includes('json')) ext = 'json';
    else if (entry.mime.includes('font')) ext = 'woff2';
    
    fs.writeFileSync(`${uuid}.${ext}`, content);
    console.log(`Saved ${uuid}.${ext}`);
  }
} else {
  console.log('Manifest not found');
}
