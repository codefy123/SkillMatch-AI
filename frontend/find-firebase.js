import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Keywords to hunt for
const TARGET_WORDS = [
    'firebase', 'getDoc', 'getDocs', 'setDoc', 'updateDoc', 'deleteDoc', 
    'onSnapshot', 'addDoc', 'collection', 'query', 'where', 'auth', 'db'
];

// Directories to ignore
const IGNORE_DIRS = ['node_modules', '.git', 'dist', 'build'];

function searchFiles(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            if (!IGNORE_DIRS.includes(file)) {
                searchFiles(filePath);
            }
        } else if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
            checkFileForFirebase(filePath);
        }
    });
}

function checkFileForFirebase(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    let found = false;

    lines.forEach((line, index) => {
        // Skip import statements for 'react' or 'react-router'
        if (line.includes("from 'react") || line.includes('from "react')) return;

        const hasKeyword = TARGET_WORDS.some(word => {
            const regex = new RegExp(`\\b${word}\\b`, 'g');
            return regex.test(line);
        });

        if (hasKeyword) {
            if (!found) {
                console.log(`\n📄 File: ${filePath}`);
                found = true;
            }
            console.log(`   -> Line ${index + 1}: ${line.trim()}`);
        }
    });
}

console.log("🕵️  Scanning for Firebase code...\n");
searchFiles(path.join(__dirname, 'src'));
console.log("\n✅ Scan complete.");