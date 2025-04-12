import { json } from '@sveltejs/kit';

export async function GET() {
    try {
        // The file is now served directly from static/phillippi_creek.geojson
        return new Response(null, {
            status: 301,
            headers: {
                Location: '/phillippi_creek.geojson'
            }
        });
    } catch (error) {
        console.error('Error processing GeoJSON:', error);
        return json({ 
            error: 'Failed to process GeoJSON data',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
} 