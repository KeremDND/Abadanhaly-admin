import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to flatten nested JSON object
function flattenObject(obj, prefix = '', result = {}) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        flattenObject(obj[key], newKey, result);
      } else {
        result[newKey] = obj[key];
      }
    }
  }
  return result;
}

// Read JSON files
const enPath = path.join(__dirname, '../public/locales/en.json');
const ruPath = path.join(__dirname, '../public/locales/ru.json');
const tkPath = path.join(__dirname, '../public/locales/tk.json');

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const ruData = JSON.parse(fs.readFileSync(ruPath, 'utf8'));
const tkData = JSON.parse(fs.readFileSync(tkPath, 'utf8'));

// Flatten all objects
const enFlat = flattenObject(enData);
const ruFlat = flattenObject(ruData);
const tkFlat = flattenObject(tkData);

// Get all unique keys
const allKeys = new Set([...Object.keys(enFlat), ...Object.keys(ruFlat), ...Object.keys(tkFlat)]);
const sortedKeys = Array.from(allKeys).sort();

// Function to properly escape CSV values for Excel
// We quote fields that need quoting (contain commas, quotes, newlines, or special chars)
const escapeCSV = (value, forceQuote = false) => {
  if (value === null || value === undefined) return '';
  const str = String(value);
  
  // Quote if it contains commas, quotes, newlines, tabs, or if forced
  const needsQuoting = forceQuote || 
    str.includes(',') || 
    str.includes('"') || 
    str.includes('\n') || 
    str.includes('\r') || 
    str.includes('\t') ||
    str.trim() !== str; // Leading/trailing spaces
  
  if (needsQuoting) {
    // Escape quotes by doubling them, then wrap in quotes
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

// Create CSV data (Excel-compatible with UTF-8 BOM for proper character display)
// UTF-8 BOM (Byte Order Mark) for Excel to recognize UTF-8 encoding
const BOM = '\uFEFF';

// Headers in separate cells (A1: Key, B1: English, C1: Russian, D1: Turkmen)
// Headers are NOT quoted so Excel recognizes them as separate columns immediately
let csvContent = BOM + 'Key,English,Russian,Turkmen\r\n';

for (const key of sortedKeys) {
  const enValue = enFlat[key] || '';
  const ruValue = ruFlat[key] || '';
  const tkValue = tkFlat[key] || '';
  
  // Always quote all data values to ensure proper cell boundaries
  // This ensures each translation stays in its correct column
  const quotedKey = escapeCSV(key, true);
  const quotedEn = escapeCSV(enValue, true);
  const quotedRu = escapeCSV(ruValue, true);
  const quotedTk = escapeCSV(tkValue, true);
  
  csvContent += `${quotedKey},${quotedEn},${quotedRu},${quotedTk}\r\n`;
}

// Write CSV file with UTF-8 encoding (Excel will read BOM and use UTF-8)
const outputPath = path.join(__dirname, '../translations-export.csv');
fs.writeFileSync(outputPath, csvContent, 'utf8');

console.log(`✅ Translation export created: ${outputPath}`);
console.log(`📊 Total translation keys: ${sortedKeys.length}`);
console.log(`📝 Format: CSV (can be opened in Excel)`);
console.log(`\nColumns:`);
console.log(`  - Key: Translation key identifier`);
console.log(`  - English: English translation`);
console.log(`  - Russian: Russian translation`);
console.log(`  - Turkmen: Turkmen translation`);

