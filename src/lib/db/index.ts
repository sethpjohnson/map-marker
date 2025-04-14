import Database from 'better-sqlite3';
import { join } from 'path';
import fs from 'fs';

let db: Database.Database;

// Only initialize database on the server side
if (typeof window === 'undefined') {
    const dbPath = join(process.cwd(), 'dredging.db');

    // Initialize database if it doesn't exist
    if (!fs.existsSync(dbPath)) {
        const tempDb = new Database(dbPath);
        const schema = fs.readFileSync(join(process.cwd(), 'src/lib/db/schema.sql'), 'utf-8');
        tempDb.exec(schema);
        tempDb.close();
    }

    db = new Database(dbPath);
} else {
    // Mock database for client-side
    db = {
        prepare: () => ({
            all: () => [],
            get: () => undefined,
            run: () => {}
        })
    } as unknown as Database.Database;
}

export interface DredgingSection {
    id?: number;
    feature_id: string;
    status: string;
    notes?: string;
    last_updated?: string;
}

export function getDredgingSections(): DredgingSection[] {
    if (typeof window !== 'undefined') return [];
    const stmt = db.prepare('SELECT * FROM dredging_sections');
    return stmt.all() as DredgingSection[];
}

export function getDredgingSection(feature_id: string): DredgingSection | undefined {
    if (typeof window !== 'undefined') return undefined;
    const stmt = db.prepare('SELECT * FROM dredging_sections WHERE feature_id = ?');
    return stmt.get(feature_id) as DredgingSection | undefined;
}

export function updateDredgingSection(section: DredgingSection): void {
    if (typeof window !== 'undefined') return;
    const stmt = db.prepare(`
        INSERT INTO dredging_sections (feature_id, status, notes)
        VALUES (?, ?, ?)
        ON CONFLICT(feature_id) DO UPDATE SET
            status = excluded.status,
            notes = excluded.notes,
            last_updated = CURRENT_TIMESTAMP
    `);
    stmt.run(section.feature_id, section.status, section.notes);
} 