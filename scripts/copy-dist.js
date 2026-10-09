const fs = require('fs');
const path = require('path');

const browserDir = path.join(__dirname, '../dist/myProtfolio/browser');
const rootDistDir = path.join(__dirname, '../dist/myProtfolio');

// Determine which directory contains the newly compiled index.html
let sourceDir = null;
if (fs.existsSync(path.join(browserDir, 'index.html'))) {
  sourceDir = browserDir;
} else if (fs.existsSync(path.join(rootDistDir, 'index.html'))) {
  sourceDir = rootDistDir;
}

if (!sourceDir) {
  console.error('Build directory not found with index.html');
  process.exit(1);
}

// Copy to all possible output directory paths that Vercel might inspect
const targetDirs = [
  path.join(__dirname, '../dist/myProtfolio'),
  path.join(__dirname, '../dist/myProtfolio/browser'),
  path.join(__dirname, '../dist/my-protfolio'),
  path.join(__dirname, '../dist/my-protfolio/browser')
];

for (const target of targetDirs) {
  if (target === sourceDir) continue;
  fs.mkdirSync(target, { recursive: true });
  fs.cpSync(sourceDir, target, { recursive: true });
  console.log(`[Vercel Compatibility] Copied output to: ${target}`);
}
