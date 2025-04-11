import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const inputPath = join(projectRoot, 'static', 'sarasota_water_bodies.geojson');
const outputPath = join(projectRoot, 'static', 'phillippi_creek.geojson');

try {
    // Read the input GeoJSON file
    const geojsonData = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
    
    // Filter features with wbid 1937
    const filteredFeatures = geojsonData.features.filter((feature: any) => {
        return feature.properties?.wbid === 1937;
    });

    // Create new GeoJSON with filtered features
    const filteredGeoJSON = {
        type: 'FeatureCollection',
        features: filteredFeatures
    };

    // Write the filtered GeoJSON to a new file
    fs.writeFileSync(outputPath, JSON.stringify(filteredGeoJSON, null, 2));
    
    console.log(`Filtered ${filteredFeatures.length} features with wbid 1937`);
    console.log(`Output written to: ${outputPath}`);
} catch (error) {
    console.error('Error processing GeoJSON:', error);
    process.exit(1);
} 