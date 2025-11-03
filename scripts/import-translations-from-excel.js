import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to unflatten object (convert flat keys back to nested structure)
function unflattenObject(flatObj) {
  const result = {};
  
  for (const key in flatObj) {
    if (flatObj.hasOwnProperty(key)) {
      const keys = key.split('.');
      let current = result;
      
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        if (!current[k]) {
          current[k] = {};
        }
        current = current[k];
      }
      
      current[keys[keys.length - 1]] = flatObj[key];
    }
  }
  
  return result;
}

// Read CSV file
const csvPath = path.join(__dirname, '../translations-export.csv');

if (!fs.existsSync(csvPath)) {
  console.error(`❌ File not found: ${csvPath}`);
  console.error(`   Please make sure translations-export.csv exists in the project root.`);
  process.exit(1);
}

const csvContent = fs.readFileSync(csvPath, 'utf8');
const lines = csvContent.split('\n').filter(line => line.trim());

if (lines.length < 2) {
  console.error('❌ CSV file is empty or invalid (no data rows)');
  process.exit(1);
}

// Parse CSV (handle quoted values and commas)
const parseCSVLine = (line) => {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
};

// Parse header
const header = parseCSVLine(lines[0]);
if (header[0] !== 'Key' || header[1] !== 'English' || header[2] !== 'Russian' || header[3] !== 'Turkmen') {
  console.error('❌ Invalid CSV format. Expected columns: Key, English, Russian, Turkmen');
  process.exit(1);
}

// Parse data
const enData = {};
const ruData = {};
const tkData = {};

for (let i = 1; i < lines.length; i++) {
  const row = parseCSVLine(lines[i]);
  if (row.length !== 4 || !row[0]) continue; // Skip invalid rows
  
  const key = row[0].trim();
  const enValue = row[1].trim();
  const ruValue = row[2].trim();
  const tkValue = row[3].trim();
  
  if (key) {
    enData[key] = enValue;
    ruValue && (ruData[key] = ruValue);
    tkValue && (tkData[key] = tkValue);
  }
}

// Convert flat objects to nested
const enNested = unflattenObject(enData);
const ruNested = unflattenObject(ruData);
const tkNested = unflattenObject(tkData);

// Write JSON files
const enPath = path.join(__dirname, '../public/locales/en.json');
const ruPath = path.join(__dirname, '../public/locales/ru.json');
const tkPath = path.join(__dirname, '../public/locales/tk.json');

fs.writeFileSync(enPath, JSON.stringify(enNested, null, 2) + '\n', 'utf8');
fs.writeFileSync(ruPath, JSON.stringify(ruNested, null, 2) + '\n', 'utf8');
fs.writeFileSync(tkPath, JSON.stringify(tkNested, null, 2) + '\n', 'utf8');

console.log(`✅ Translations imported successfully!`);
console.log(`📊 Total translation keys: ${Object.keys(enData).length}`);
console.log(`📝 Updated files:`);
console.log(`   - ${enPath}`);
console.log(`   - ${ruPath}`);
console.log(`   - ${tkPath}`);
console.log(`\n⚠️  Please verify the translations in your browser.`);

