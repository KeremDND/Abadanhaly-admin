# Translation Export/Import Guide

This guide explains how to export all website translations to Excel for editing and import them back.

## 📤 Exporting Translations to Excel

All translations have been exported to `translations-export.csv` in the project root.

### File Location
```
/Users/keremjumalyyev/Desktop/project/translations-export.csv
```

### File Format
- **Format**: CSV (Comma-Separated Values)
- **Compatible with**: Microsoft Excel, Google Sheets, LibreOffice Calc, Numbers
- **Encoding**: UTF-8 (supports all languages including Turkmen)

### Columns
1. **Key**: Translation key identifier (e.g., `nav.home`, `hero.title`)
2. **English**: English translation text
3. **Russian**: Russian translation text (Русский)
4. **Turkmen**: Turkmen translation text (Türkmen)

### Total Translations
- **295 translation keys** covering all website elements:
  - Header & Navigation
  - Footer
  - Homepage (Hero, Services, etc.)
  - Gallery
  - About page
  - Collaboration page
  - Contact sections
  - Buttons, labels, and UI elements
  - Error messages
  - Certificates and awards

## 📝 Editing Translations in Excel

### Steps:
1. **Open the file in Excel** (or any spreadsheet application)
   
   **⚠️ IMPORTANT: Use Excel's Import feature, NOT double-click!**
   
   **For Excel on Mac:**
   - Open Excel first (do NOT double-click the CSV file)
   - Go to **File** → **Import**
   - Choose **CSV file** or **Text file**
   - Navigate to and select `translations-export.csv`
   - In the Text Import Wizard:
     - **Step 1**: Choose "Delimited" → **Next**
     - **Step 2**: 
       - Check **"Comma"** as delimiter
       - Uncheck other delimiters (Tab, Semicolon, etc.)
       - **File origin**: UTF-8 or Windows (ANSI)
       - Preview should show 4 columns (Key | English | Russian | Turkmen)
       - Click **Next**
     - **Step 3**: 
       - Set data format to **"General"** for all columns
       - Click **Finish**
   - Excel will now show proper column separation:
     - **Column A (A1)**: "Key"
     - **Column B (B1)**: "English"
     - **Column C (C1)**: "Russian"
     - **Column D (D1)**: "Turkmen"
     - **Row 2+**: Data in corresponding columns
   
   **For Excel on Windows:**
   - Open Excel first
   - Go to **Data** → **From Text/CSV** (or **Get Data** → **From File** → **From Text/CSV**)
   - Navigate to and select `translations-export.csv`
   - In the preview dialog:
     - Ensure **Delimiter** is set to **"Comma"**
     - **Data Type Detection**: "Based on first 200 rows"
     - Preview should show 4 columns properly separated
     - Click **Load** (or **Transform Data** if needed)
   - Excel will import with proper columns:
     - **Column A**: Keys (A1 = "Key")
     - **Column B**: English (B1 = "English")
     - **Column C**: Russian (C1 = "Russian")
     - **Column D**: Turkmen (D1 = "Turkmen")
   
   **Alternative method (if import doesn't work):**
   - Double-click the file (it will open in Excel but might not separate columns correctly)
   - Select **Column A** (the entire column)
   - Go to **Data** → **Text to Columns**
   - Choose **"Delimited"** → **Next**
   - Check **"Comma"** → Uncheck all others
   - Click **Next** → **Finish**
   - Columns should now be properly separated
   
   **File details:**
   - File: `translations-export.csv`
   - Location: Project root directory
   - Encoding: UTF-8 with BOM (automatic detection)
   - Column structure:
     - **Column A**: Key (translation key identifiers)
     - **Column B**: English (English translations)
     - **Column C**: Russian (Russian translations - Русский)
     - **Column D**: Turkmen (Turkmen translations - Türkmen)

2. **Edit translations**
   - Make changes to the English, Russian, or Turkmen columns
   - **Do NOT modify the Key column** (Column A)
   - **Do NOT change the column headers** in Row 1
   - All cells are properly contained within their columns

3. **Save the file**
   - **Important**: Use **File** → **Save As**
   - Choose **CSV UTF-8 (Comma delimited) (*.csv)** format
   - Or: **CSV (Comma delimited) (*.csv)**
   - Keep the same filename: `translations-export.csv`
   - Keep the same location (project root)
   - If Excel warns about losing formatting, click **Yes** (this is normal for CSV)

### Important Notes:
- ✅ **Safe to edit**: English, Russian, and Turkmen columns
- ❌ **Do NOT edit**: Key column (this will break translations)
- ❌ **Do NOT change**: Column headers or structure
- ✅ **Special characters**: HTML tags like `<br />` are preserved
- ✅ **Quotes and commas**: Properly escaped in CSV format

## 📥 Importing Translations Back

After editing the CSV file, import the translations back:

```bash
cd /Users/keremjumalyyev/Desktop/project
node scripts/import-translations-from-excel.js
```

This script will:
1. Read `translations-export.csv`
2. Convert it back to JSON format
3. Update all three locale files:
   - `public/locales/en.json`
   - `public/locales/ru.json`
   - `public/locales/tk.json`

### After Import:
1. **Verify in browser**: Refresh the website and check translations
2. **Test all languages**: Switch between English, Russian, and Turkmen
3. **Check for errors**: Look for any missing translations or broken keys

## 🔄 Re-exporting After Changes

To create a fresh export (if you add new translation keys in code):

```bash
cd /Users/keremjumalyyev/Desktop/project
node scripts/export-translations-to-excel.js
```

This will regenerate `translations-export.csv` with all current translations.

## 📋 Translation Categories

The translations are organized by website sections:

- **Navigation**: `nav.*` - Menu items
- **Hero**: `hero.*` - Homepage hero section
- **Gallery**: `gallery.*` - Gallery page, filters, search
- **About**: `about.*` - About page content
- **Collaboration**: `collaboration.*` - Collaboration/partnership page
- **Contact**: `contact.*` - Contact information and forms
- **Footer**: `footer.*` - Footer content
- **Certificates**: `certs.*` - ISO certificates
- **Services**: `services.*` - Service descriptions
- **Stores**: `stores.*` - Store locator content

## 🚨 Troubleshooting

### Problem: Translations not showing after import
- **Solution**: Clear browser cache and refresh
- **Check**: Verify JSON files are valid JSON (no syntax errors)

### Problem: Some translations missing
- **Solution**: Make sure all columns are filled in the CSV (empty cells will be empty translations)

### Problem: Special characters broken
- **Solution**: Ensure CSV is saved as UTF-8 encoding

### Problem: Excel adds extra quotes
- **Solution**: Use "Save As" → CSV UTF-8 format in Excel

## ✅ Current Export Status

**File**: `translations-export.csv`  
**Size**: ~49 KB  
**Total Keys**: 295  
**Status**: ✅ Ready for editing

All translations from the website are included in the export file.

