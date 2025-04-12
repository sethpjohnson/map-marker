import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const inputPath = join(projectRoot, 'data', 'water_bodies.geojson');
const outputPath = join(projectRoot, 'static', 'phillippi_creek.geojson');

try {
    // Read the input GeoJSON file
    const geojsonData = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
    
    // Filter features that are part of Phillippi Creek (wbid: '1937')
    const phillippiFeatures = geojsonData.features.filter(feature => {
        return feature.properties?.name === 'PHILLIPPI CREEK' || 
            feature.properties?.objectid === 296 ||  // Seclusion Lake
            feature.properties?.objectid === 3440 || // Seclusion Lake
            feature.properties?.objectid === 8346 || // Seculsion Lake
            feature.properties?.objectid === 470 || // Blossom Brook Canal
            feature.properties?.objectid === 1106 || // Misc Creek
            feature.properties?.objectid === 1888;  // Canal to Creek
    });

    // Create new GeoJSON with filtered features
    const filteredGeoJSON = {
        type: 'FeatureCollection',
        features: phillippiFeatures
    };

    // Write the filtered GeoJSON to a new file
    fs.writeFileSync(outputPath, JSON.stringify(filteredGeoJSON, null, null));
    
    console.log(`Original features count: ${geojsonData.features.length}`);
    console.log(`Filtered ${phillippiFeatures.length} Phillippi Creek features (wbid: 1937)`);
    
    // Log some stats about the filtered features
    if (phillippiFeatures.length > 0) {
        const containmentTypes = new Set();
        const subtypes = new Set();
        phillippiFeatures.forEach(feature => {
            containmentTypes.add(feature.properties.containmenttype);
            subtypes.add(feature.properties.subtype);
        });
        console.log('\nContainment types in filtered features:', Array.from(containmentTypes));
        console.log('Subtypes in filtered features:', Array.from(subtypes));
    }
    
    console.log(`\nOutput written to: ${outputPath}`);
} catch (error) {
    console.error('Error processing GeoJSON:', error);
    process.exit(1);
} 