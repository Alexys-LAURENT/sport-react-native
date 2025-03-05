const { Client } = require('pg');

// Configuration de la connexion à la base de données
const client = new Client({
    user: 'fitness_user',
    host: 'localhost',
    database: 'fitness_db',
    password: 'fitness_password',
    port: 5432,
});

// Connexion à la base de données
client.connect();

// Fonction pour générer un point de localisation suivant un parcours
function generateNextLocation(previousLocation) {
    const { latitude, longitude } = previousLocation;
    // Générer un petit décalage pour simuler un mouvement
    const newLatitude = latitude + (Math.random() - 0.5) * 0.001;
    const newLongitude = longitude + (Math.random() - 0.5) * 0.001;
    return { latitude: newLatitude, longitude: newLongitude };
}

// Point de départ (vous pouvez utiliser le dernier point inséré dans votre base de données)
let currentLocation = { latitude: 48.8588443, longitude: 2.2943506 };

// Fonction pour insérer une nouvelle ligne dans la table geo
async function insertGeoData() {
    const newLocation = generateNextLocation(currentLocation);
    currentLocation = newLocation;

    const query = `
    INSERT INTO geo (id_training, "date", localization)
    VALUES ($1, NOW(), $2)
  `;

    try {
        await client.query(query, [1, `{"latitude" : ${newLocation.latitude}, "longitude" : ${newLocation.longitude}}`]);
        console.log('Nouvelle ligne insérée avec succès.');
    } catch (err) {
        console.error('Erreur lors de l\'insertion de la ligne :', err);
    }
}

// Insérer une nouvelle ligne toutes les 2 secondes
setInterval(insertGeoData, 2000);