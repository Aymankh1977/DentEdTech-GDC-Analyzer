const fs = require('fs');

// Read the App.tsx file
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace the import
content = content.replace(
  /import\s*{\s*GDCRequirementsGrid\s*}\s*from\s*['"]\.\/components\/GDCRequirementsGrid['"];/,
  "import { OrganizedRequirementsGrid } from './components/OrganizedRequirementsGrid';"
);

// Replace the component usage
content = content.replace(
  /<GDCRequirementsGrid\s*requirements=\{requirements\}\s*onRequirementSelect=\{handleRequirementSelect\}\s*\/>/,
  "<OrganizedRequirementsGrid requirements={requirements} onRequirementSelect={handleRequirementSelect} />"
);

// Write the fixed content back
fs.writeFileSync('src/App.tsx', content);
console.log('✅ Fixed imports in App.tsx');
