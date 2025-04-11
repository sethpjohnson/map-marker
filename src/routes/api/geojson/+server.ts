import { json } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        // Read the filtered GeoJSON file
        const geojsonPath = path.join(process.cwd(), 'static', 'phillippi_creek.geojson');
        
        // Check if file exists
        if (!fs.existsSync(geojsonPath)) {
            console.error('GeoJSON file not found at:', geojsonPath);
            return json({ error: 'GeoJSON file not found' }, { status: 404 });
        }

        // Read and parse the file
        const geojsonData = JSON.parse(fs.readFileSync(geojsonPath, 'utf-8'));
        console.log(`Serving ${geojsonData.features.length} Phillippi Creek features`);

        // Return the GeoJSON data
        return json(geojsonData);
    } catch (error) {
        console.error('Error processing GeoJSON:', error);
        return json({ 
            error: 'Failed to process GeoJSON data',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
} 