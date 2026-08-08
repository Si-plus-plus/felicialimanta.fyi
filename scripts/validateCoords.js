import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.resolve(__dirname, '../src/lib/data/travelData.json');

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    const travelData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    let updated = false;

    for (let trip of travelData) {
        console.log(`Checking ${trip.city}, ${trip.country}...`);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(trip.city)}&country=${encodeURIComponent(trip.country)}&format=json&limit=1`, {
                headers: { 'User-Agent': 'TravelHistoryApp/1.0' }
            });
            const data = await response.json();
            
            if (data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                
                // If the difference is significant (> 0.1 degrees), update it
                if (Math.abs(trip.latitude - lat) > 0.1 || Math.abs(trip.longitude - lon) > 0.1) {
                    console.log(`  Updating ${trip.city}: (${trip.latitude}, ${trip.longitude}) -> (${lat}, ${lon})`);
                    trip.latitude = lat;
                    trip.longitude = lon;
                    updated = true;
                } else {
                    console.log(`  ${trip.city} is accurate.`);
                }
            } else {
                console.log(`  Could not find ${trip.city} on Nominatim.`);
            }
        } catch (e) {
            console.error(`  Failed to fetch for ${trip.city}:`, e.message);
        }
        
        // Respect Nominatim rate limit (1 request per second)
        await delay(1200);
    }

    if (updated) {
        fs.writeFileSync(dataPath, JSON.stringify(travelData, null, 2));
        console.log("\nUpdated travelData.json with corrected coordinates.");
    } else {
        console.log("\nAll coordinates look correct according to Nominatim.");
    }
}

main();
