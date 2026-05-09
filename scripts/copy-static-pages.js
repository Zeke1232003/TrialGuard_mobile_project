const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');

const filesToCopy = [
  {
    from: path.join(root, 'privacy-policy.html'),
    to: path.join(distDir, 'privacy-policy.html'),
  },
  {
    from: path.join(root, 'delete-account.html'),
    to: path.join(distDir, 'delete-account.html'),
  },
];

if (!fs.existsSync(distDir)) {
  console.error('dist folder was not found. Run build:web first.');
  process.exit(1);
}

for (const file of filesToCopy) {
  if (!fs.existsSync(file.from)) {
    console.error(`Missing source file: ${file.from}`);
    process.exit(1);
  }

  fs.copyFileSync(file.from, file.to);
  console.log(`Copied ${path.basename(file.from)} -> dist`);
}
