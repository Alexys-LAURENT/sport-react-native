import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import React, { createContext, ReactNode, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';

// Nom de la tâche en arrière-plan
const BACKGROUND_LOCATION_TASK = 'background-location-task';

// Interface pour le stockage des positions
interface LocationData {
    locations: Location.LocationObject[];
}

// Interface pour le contexte d'entraînement
// Dans TrainingContext.tsx
interface TrainingContextProps {
    startTracking: () => Promise<void>;
    stopTracking: () => Promise<void>;
    setTrackingState: (isActive: boolean) => void; // Nouvelle méthode
    locationStatus: string;
    isTracking: boolean;
    currentLocation: Location.LocationObject | null;
}

// Création du contexte avec des valeurs par défaut
const TrainingContext = createContext<TrainingContextProps>({
    startTracking: async () => { },
    stopTracking: async () => { },
    setTrackingState: () => { },
    locationStatus: 'Aucune localisation active',
    isTracking: false,
    currentLocation: null
});

// Définir la tâche en arrière-plan si elle n'existe pas déjà
if (!TaskManager.isTaskDefined(BACKGROUND_LOCATION_TASK)) {
    TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }) => {
        if (error) {
            console.error('Erreur de la tâche en arrière-plan:', error);
            return;
        }
    });
}

const TrainingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
    const [locationStatus, setLocationStatus] = useState<string>('Aucune localisation active');
    const [isTracking, setIsTracking] = useState<boolean>(false);
    const locationIntervalRef = useRef<NodeJS.Timeout | null>(null);


    const setTrackingState = (isActive: boolean) => {
        setIsTracking(isActive);
    };

    // Nettoyage lors du démontage du composant
    useEffect(() => {
        return () => {
            if (locationIntervalRef.current) {
                clearInterval(locationIntervalRef.current);
                locationIntervalRef.current = null;
            }
            
            // Tenter d'arrêter le suivi en arrière-plan si actif
            Location.hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK)
                .then(hasStarted => {
                    if (hasStarted) {
                        Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK)
                            .catch(error => console.error('Erreur lors de l\'arrêt du tracking:', error));
                    }
                })
                .catch(error => console.error('Erreur lors de la vérification du statut:', error));
        };
    }, []);

    // Fonction pour demander les permissions de localisation
    const requestPermissions = async (): Promise<boolean> => {
        try {
            // Permission de premier plan
            const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
            if (foregroundStatus !== 'granted') {
                Alert.alert(
                    'Permission requise',
                    'L\'application a besoin d\'accéder à votre localisation pour suivre votre entraînement.',
                    [{ text: 'OK' }]
                );
                setLocationStatus('Permission de localisation refusée');
                return false;
            }

            // Permission d'arrière-plan
            const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
            if (backgroundStatus !== 'granted') {
                Alert.alert(
                    'Permission d\'arrière-plan',
                    'Pour suivre votre position même lorsque l\'application est en arrière-plan, veuillez autoriser l\'accès en arrière-plan.',
                    [{ text: 'OK' }]
                );
                // Continuer même sans permission d'arrière-plan
                setLocationStatus('Permission d\'arrière-plan refusée, suivi limité');
                return true;
            }

            setLocationStatus('Permissions accordées');
            return true;
        } catch (error) {
            console.error('Erreur de permission:', error);
            setLocationStatus(`Erreur: ${error}`);
            return false;
        }
    };

    // Fonction pour obtenir la position actuelle
    const updateCurrentLocation = async () => {
        try {
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.BestForNavigation,
            });
            console.info("Nouvelle position obtenue:", 
                location.coords.latitude, 
                location.coords.longitude,
                "timestamp:", new Date().toISOString()
            );
            setCurrentLocation(location);
            setLocationStatus('Position mise à jour à ' + new Date().toLocaleTimeString());
        } catch (error) {
            console.error('Erreur de localisation:', error);
            setLocationStatus(`Erreur de localisation: ${error}`);
        }
    };

    // Fonction pour démarrer le suivi de localisation
    const startTracking = async () => {
        if (isTracking) {
            Alert.alert('Info', 'Le suivi est déjà actif');
            return;
        }

        // Demander les permissions
        const permissionsGranted = await requestPermissions();
        if (!permissionsGranted) {
            return;
        }

        try {
            // Obtenir la position initiale
            await updateCurrentLocation();
            setLocationStatus('Démarrage du suivi en premier plan uniquement...');

            // Solution temporaire : utiliser uniquement le suivi en premier plan
            // sans démarrer le service d'arrière-plan qui cause l'erreur
            locationIntervalRef.current = setInterval(updateCurrentLocation, 2000);
            
            setIsTracking(true);
            setLocationStatus('Suivi actif (premier plan uniquement)');
        } catch (error) {
            console.error('Erreur de démarrage:', error);
            setLocationStatus(`Erreur de démarrage: ${error}`);
            
            // Nettoyer en cas d'erreur
            if (locationIntervalRef.current) {
                clearInterval(locationIntervalRef.current);
                locationIntervalRef.current = null;
            }
        }
    };

    // Fonction pour arrêter le suivi
    const stopTracking = async () => {
        try {
            // Arrêter l'intervalle
            if (locationIntervalRef.current) {
                clearInterval(locationIntervalRef.current);
                locationIntervalRef.current = null;
            }
            
            // Vérifier si le suivi est actif avant d'essayer de l'arrêter
            const hasStarted = await Location.hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
            if (hasStarted) {
                await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
            }

            setIsTracking(false);
            setLocationStatus('Suivi arrêté');
        } catch (error) {
            console.error('Erreur lors de l\'arrêt du suivi:', error);
            setLocationStatus(`Erreur d'arrêt: ${error}`);
        }
    };

    return (
        <TrainingContext.Provider 
            value={{ 
                startTracking, 
                stopTracking, 
                locationStatus, 
                setTrackingState,
                isTracking, 
                currentLocation 
            }}
        >
            {children}
        </TrainingContext.Provider>
    );
};

export { TrainingContext, TrainingProvider };

