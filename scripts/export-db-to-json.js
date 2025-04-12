import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const dbPath = path.join(projectRoot, 'dredging.db');
const jsonPath = path.join(projectRoot, 'static', 'dredging_sections.json');

// Initialize database connection
const db = new Database(dbPath);

try {
    // Get all sections from the database
    const stmt = db.prepare('SELECT * FROM dredging_sections');
    const sections = stmt.all();

    // Create JSON structure
    const jsonData = {
        sections: sections.map(section => ({
            feature_id: section.feature_id,
            status: section.status,
            notes: section.notes,
            last_updated: section.last_updated
        }))
    };

    // Write to JSON file
    fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));
    console.log(`Successfully exported ${sections.length} sections to ${jsonPath}`);
} catch (error) {
    console.error('Error exporting database to JSON:', error);
} finally {
    db.close();
} 