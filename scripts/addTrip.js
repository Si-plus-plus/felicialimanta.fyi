import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.resolve(__dirname, '../src/lib/data/travelData.json');

async function main() {
    const args = process.argv.slice(2);
    if (args.length < 3) {
        console.error('Usage: npm run add-trip "<City, Country>" "<YYYY-MM>" "<Purpose>"');
        console.error('Example: npm run add-trip "Paris, France" "2027-08" "ICPC World Finals"');
        process.exit(1);
    }

    const [location, period, purpose] = args;
    const [city, country] = location.split(',').map(s => s.trim());

    if (!city || !country) {
        console.error('Error: Location must be in format "City, Country"');
        process.exit(1);
    }

    console.log(`Geocoding ${city}, ${country}...`);

    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&format=json&limit=1`, {
            headers: {
                'User-Agent': 'TravelHistoryApp/1.0'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.length === 0) {
            console.error(`Error: Could not find coordinates for ${location}`);
            process.exit(1);
        }

        const { lat, lon } = data[0];
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);
        
        // Very basic continent inference based on longitude/latitude logic is too complex here, 
        // falling back to manual or generic. We will prompt to edit.
        const continent = "TBD - Please update in JSON";

        const travelData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        
        const nextId = (Math.max(...travelData.map((t: any) => parseInt(t.id, 10) || 0)) + 1).toString();

        const newTrip = {
            id: nextId,
            city,
            country,
            continent,
            latitude,
            longitude,
            period,
            purpose
        };

        travelData.push(newTrip);

        // Sort by period
        travelData.sort((a: any, b: any) => a.period.localeCompare(b.period));

        fs.writeFileSync(dataPath, JSON.stringify(travelData, null, 2));

        console.log(`\nSuccessfully added new trip!`);
        console.log(newTrip);
        console.log(`\nPlease remember to manually update the continent in src/lib/data/travelData.json if necessary.`);

    } catch (error) {
        console.error("Failed to add trip:", error);
    }
}

main();
