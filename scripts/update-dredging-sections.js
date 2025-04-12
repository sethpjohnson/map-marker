import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const dataPath = path.join(projectRoot, 'static', 'dredging_sections.json');

function readData() {
    try {
        const data = fs.readFileSync(dataPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data:', error);
        return { sections: [] };
    }
}

function writeData(data) {
    try {
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        console.log('Data updated successfully');
    } catch (error) {
        console.error('Error writing data:', error);
    }
}

// Example usage:
// node scripts/update-dredging-sections.js add "feature_id" "status" "notes"
// node scripts/update-dredging-sections.js update "feature_id" "status" "notes"
// node scripts/update-dredging-sections.js remove "feature_id"

const command = process.argv[2];
const featureId = process.argv[3];
const status = process.argv[4];
const notes = process.argv[5];

const data = readData();

switch (command) {
    case 'add':
    case 'update':
        const existingIndex = data.sections.findIndex(s => s.feature_id === featureId);
        const section = {
            feature_id: featureId,
            status: status,
            notes: notes,
            last_updated: new Date().toISOString()
        };
        
        if (existingIndex >= 0) {
            data.sections[existingIndex] = section;
        } else {
            data.sections.push(section);
        }
        writeData(data);
        break;
        
    case 'remove':
        data.sections = data.sections.filter(s => s.feature_id !== featureId);
        writeData(data);
        break;
        
    default:
        console.log('Available commands: add, update, remove');
        break;
} 