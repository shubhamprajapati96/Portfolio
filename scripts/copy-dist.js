const fs = require('fs');
const path = require('path');

const browserDir = path.join(__dirname, '../dist/myProtfolio/browser');

if (!fs.existsSync(browserDir)) {
  console.error('Build directory not found:', browserDir);
  process.exit(1);
}

// Copy to all possible output directory paths that Vercel might inspect
const targetDirs = [
  path.join(__dirname, '../dist/myProtfolio'),
  path.join(__dirname, '../dist/my-protfolio'),
  path.join(__dirname, '../dist/my-protfolio/browser')
];

for (const target of targetDirs) {
  if (target === browserDir) continue;
  fs.mkdirSync(target, { recursive: true });
  fs.cpSync(browserDir, target, { recursive: true });
  console.log(`[Vercel Compatibility] Copied output to: ${target}`);
}

