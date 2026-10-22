const fs = require('fs');
const path = require('path');

const walk = (d) => {
  let results = [];
  const list = fs.readdirSync(d);
  list.forEach((file) => {
    file = path.resolve(d, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
};

const fixURL = () => {
  const dir = path.join(__dirname, 'frontend/src');
  const files = walk(dir);
  for (const file of files) {
    const original = fs.readFileSync(file, 'utf8');
    // We want to replace "\${" with "${" for the interpolation
    // Literal string to replace: \${import.meta.env.VITE_API_URL || 'http://localhost:5000'}
    // To just: ${import.meta.env.VITE_API_URL || 'http://localhost:5000'}
    const updated = original.replace(/\\\${import\.meta\.env\.VITE_API_URL \|\| 'http:\/\/localhost:5000'}/g, 
        "${import.meta.env.VITE_API_URL || 'http://localhost:5000'}");
    
    if (original !== updated) {
      fs.writeFileSync(file, updated);
      console.log(`Fixed interpolation in: ${path.basename(file)}`);
    }
  }
}

fixURL();
