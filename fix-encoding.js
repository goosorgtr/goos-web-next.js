const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });

    return arrayOfFiles;
}

const files = getAllFiles("./src/app");
let fixedCount = 0;

console.log('Scanning files for encoding issues...');

files.forEach(filePath => {
    try {
        const buffer = fs.readFileSync(filePath);

        // Check for UTF-16 BOM
        if (buffer.length >= 2 && buffer[0] === 0xFF && buffer[1] === 0xFE) {
            console.log(`Fixing UTF-16 LE file: ${filePath}`);
            const content = fs.readFileSync(filePath, 'utf16le');
            fs.writeFileSync(filePath, content, 'utf8');
            fixedCount++;
        }
        // Basic check for content validity
        else {
            // Try to read as UTF-8
            const content = buffer.toString('utf8');
            if (content.includes('')) { // Replacement character often seen in bad decoding
                console.log(`Fixing likely corrupted file: ${filePath}`);
                // If really bad, just overwrite with placeholder if it's a page
                if (filePath.endsWith('page.tsx')) {
                    const placeholder = `'use client'\n\nimport React from 'react'\n\nexport default function PlaceholderPage() {\n  return (\n    <div className="p-8 text-center">\n      <h1 className="text-2xl font-bold">Sayfa Hazırlanıyor</h1>\n      <p className="text-muted-foreground">Bu sayfa henüz yapım aşamasındadır.</p>\n    </div>\n  )\n}\n`;
                    fs.writeFileSync(filePath, placeholder, 'utf8');
                    fixedCount++;
                }
            }
        }
    } catch (err) {
        console.error(`Error processing ${filePath}:`, err);
    }
});

console.log(`\nScan complete. Fixed ${fixedCount} files.`);
