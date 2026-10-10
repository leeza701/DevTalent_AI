const fs = require('fs');
const path = require('path');

const dir = 'frontend/src';

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

const replaceURL = () => {
  const files = walk(dir);
  for (const file of files) {
    const original = fs.readFileSync(file, 'utf8');
    // Replace 'http://localhost:5000/api...' with `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api...`
    const updated = original.replace(/(['"`])http:\/\/localhost:5000\/(.*?)\1/g, 
        "`\\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/$2`");
    
    if (original !== updated) {
      fs.writeFileSync(file, updated);
      console.log(`Updated network routing in: ${path.basename(file)}`);
    }
  }
}

replaceURL();
