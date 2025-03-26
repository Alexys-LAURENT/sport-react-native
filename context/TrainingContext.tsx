import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import React, { createContext, ReactNode, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

// Constante pour le nom de la tâche en arrière-plan
const BACKGROUND_LOCATION_TASK = 'background-location-tracking';

// Interface pour le stockage des positions
interface LocationData {
    locations: Location.LocationObject[];
}

// Interface pour le contexte d'entraînement
interface TrainingContextProps {
    startTraining: () => Promise<void>;
    stopTraining: () => Promise<void>;
    text: string;
    isTracking: boolean;
}

// Création du contexte avec des valeurs par défaut
const TrainingContext = createContext<TrainingContextProps>({
    startTraining: async () => { },
    stopTraining: async () => { },
    text: 'En attente...',
    isTracking: false
});

// Définir la tâche en arrière-plan
TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }) => {
    if (error) {
        console.error('Erreur dans la tâche en arrière-plan:', error);
        return null;
    }
    if (data) {
        const { locations } = data as LocationData;
        if (locations && locations.length > 0) {
            console.log('Position mise à jour en arrière-plan:', locations[0]);
            // Ici vous pourriez envoyer les données à un serveur ou les stocker localement
        }
    }
    return null;
});

const TrainingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isTracking, setIsTracking] = useState<boolean>(false);

    // Référence pour l'intervalle de localisation
    const locationIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Fonction pour obtenir les permissions de localisation
    const requestLocationPermissions = async (): Promise<boolean> => {
        try {
            // Permission en premier plan
            let { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
            if (foregroundStatus !== 'granted') {
                setErrorMsg('Permission pour accéder à la localisation refusée');
                return false;
            }

            // Permission en arrière-plan
            let { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
            if (backgroundStatus !== 'granted') {
                setErrorMsg('Permission pour accéder à la localisation en arrière-plan refusée');
                return false;
            }

            return true;
        } catch (error) {
            setErrorMsg(`Erreur lors de la demande de permissions: ${error}`);
            return false;
        }
    };

    // Fonction pour obtenir la position actuelle
    const getCurrentLocation = async () => {
        try {
            let location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.BestForNavigation
            });
            console.log('Position actuelle:', location);
            setLocation(location);
            setErrorMsg(null);
        } catch (error) {
            console.error('Erreur getCurrentLocation:', error);
            setErrorMsg(`Erreur lors de la récupération de la position: ${error}`);
        }
    };

    // Nettoyage lors du démontage du composant
    useEffect(() => {
        return () => {
            stopTrainingInternal();
        };
    }, []);

    // Fonction interne pour arrêter l'entraînement
    const stopTrainingInternal = async () => {
        console.log('Arrêt interne de l\'entraînement');

        // Arrêter l'intervalle de mise à jour
        if (locationIntervalRef.current) {
            clearInterval(locationIntervalRef.current);
            locationIntervalRef.current = null;
        }

        // Arrêter le suivi en arrière-plan
        try {
            const hasStarted = await Location.hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
            if (hasStarted) {
                console.log('Arrêt du suivi en arrière-plan');
                await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
            }
        } catch (error) {
            console.error('Erreur lors de l\'arrêt du suivi en arrière-plan:', error);
        }

        setIsTracking(false);
    };

    // Fonction pour démarrer l'entraînement
    const startTraining = async () => {
        console.log('Démarrage de l\'entraînement');

        // Éviter de démarrer plusieurs fois
        if (isTracking) {
            console.log('Entraînement déjà en cours');
            return;
        }

        // Demander les permissions
        const permissionsGranted = await requestLocationPermissions();
        if (!permissionsGranted) {
            console.log('Permissions refusées');
            return;
        }

        // Assurer que tout précédent suivi est arrêté
        await stopTrainingInternal();

        try {
            // Obtenir la position initiale
            await getCurrentLocation();

            // Démarrer le suivi en arrière-plan
            console.log('Démarrage du suivi en arrière-plan');
            const options: Location.LocationTaskOptions = {
                accuracy: Location.Accuracy.BestForNavigation,
                timeInterval: 1000, // Mise à jour toutes les secondes
                distanceInterval: 0, // Mise à jour même sans déplacement
                deferredUpdatesInterval: 1000, // Pour iOS
                deferredUpdatesDistance: 0, // Pour iOS
                showsBackgroundLocationIndicator: true, // Pour iOS
                pausesUpdatesAutomatically: false,
            };

            // Ajouter le foregroundService uniquement sur Android et si app.json est configuré
            if (Platform.OS === 'android') {
                try {
                    const { status } = await Location.getForegroundPermissionsAsync();
                    if (status === 'granted') {
                        options.foregroundService = {
                            notificationTitle: 'Suivi d\'entraînement actif',
                            notificationBody: 'Votre position est suivie en temps réel',
                            notificationColor: '#FF0000'
                        };
                    } else {
                        console.log('Foreground permissions non accordées, tracking uniquement en premier plan');
                    }
                } catch (error) {
                    console.log('Impossible de vérifier les permissions de foreground:', error);
                }
            }

            await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, options);

            // Configurer l'intervalle pour les mises à jour en premier plan
            locationIntervalRef.current = setInterval(async () => {
                await getCurrentLocation();
            }, 1000);

            setIsTracking(true);
            console.log('Entraînement démarré avec succès');
        } catch (error) {
            console.error('Erreur lors du démarrage de l\'entraînement:', error);
            setErrorMsg(`Erreur lors du démarrage de l'entraînement: ${error}`);
            await stopTrainingInternal();
        }
    };

    // Fonction pour arrêter l'entraînement (version exposée)
    const stopTraining = async () => {
        console.log('Demande d\'arrêt d\'entraînement');
        await stopTrainingInternal();
        console.log('Entraînement arrêté avec succès');
    };

    // Préparer le texte pour le contexte
    let text = 'En attente...';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }

    return (
        <TrainingContext.Provider value={{ startTraining, stopTraining, text, isTracking }}>
            {children}
        </TrainingContext.Provider>
    );
};

export { TrainingContext, TrainingProvider };

