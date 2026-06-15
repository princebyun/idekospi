const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.{ts,tsx}');
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('const backendUrl = `http://${window.location.hostname}:3001`;')) {
    content = content.replace(/const backendUrl = `http:\/\/\$\{window\.location\.hostname\}:3001`;\s*/g, '');
    content = content.replace(/\$\{backendUrl\}/g, '${API_BASE_URL}');
    
    // Determine relative path to src/config/api.ts
    const depth = file.split('/').length - 2;
    const relPath = depth === 0 ? './config/api' : '../'.repeat(depth) + 'config/api';
    
    const importStmt = `import { API_BASE_URL } from '${relPath}';\n`;
    const lines = content.split('\n');
    let lastImportIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ')) lastImportIndex = i;
    }
    lines.splice(lastImportIndex + 1, 0, importStmt);
    
    fs.writeFileSync(file, lines.join('\n'));
    console.log('Updated ' + file);
  }
}
