import { Map } from '@/components/map/Map';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { TrainingContext } from '@/context/TrainingContext';
import Constants from 'expo-constants';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Training {
    calories: number;
    difficulty: string;
    distance: number;
    endedDate: string;
    feeling: string;
    idTraining: number;
    idTrainingType: number;
    idUser: number;
    startedDate: string;
    icon: string;
    label: string;
}

const API_URL = Constants.expoConfig?.extra?.API_URL;

export default function TrainingScreen() {
    const { id_training } = useLocalSearchParams<{ id_training: string }>();
    const trainingId = id_training ? parseInt(id_training) : null;
    const [training, setTraining] = useState<Training | null>(null);
    const [waypoints, setWaypoints] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [isRealTime, setIsRealTime] = useState(false);
    
    // Utilisation du contexte de suivi
    const { startTracking, stopTracking, setTrackingState, isTracking, locationStatus, currentLocation } = useContext(TrainingContext);

    // Timer pour afficher le temps écoulé
    const [timer, setTimer] = useState('00:00:00');
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Format du temps d'entraînement
    const formatDuration = (startDate: string, endDate?: Date) => {
        const start = new Date(startDate);
        const end = endDate || new Date();
        const diffMs = end.getTime() - start.getTime();
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const updateTimer = () => {
        if (training) {
            const start = new Date(training.startedDate);
            const now = new Date();
            const diffMs = now.getTime() - start.getTime();
            
            // Si la différence est négative, afficher 00:00:00
            if (diffMs < 0) {
                setTimer('00:00:00');
                return;
            }
            
            const hours = Math.floor(diffMs / (1000 * 60 * 60));
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
            
            setTimer(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }
    };

    // Mettre en place le timer avec useEffect
    useEffect(() => {
        if (training && isRealTime) {
            // Mettre à jour immédiatement
            updateTimer();
            
            // Configurer l'intervalle pour mettre à jour chaque seconde
            timerRef.current = setInterval(updateTimer, 1000);
            
            // Nettoyage au démontage du composant
            return () => {
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                }
            };
        }
    }, [training, isRealTime]);

    // Charger les données de l'entraînement
    useFocusEffect(() => {
        const fetchData = async () => {
            if (!trainingId) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_URL}api/trainingPage/getTrainingInfoById/${trainingId}`);
                
                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }
                
                const data = await response.json();
                if(!data.trainingInfo.difficulty && data.trainingInfo.endedDate){
                    router.push({
                        pathname: "/post-training/[id_training]",
                        params: {
                            id_training: trainingId || 0,
                            date: data.trainingInfo.startedDate || new Date().toISOString()
                        }
                    })
                }
                setTraining(data.trainingInfo);
                if(!data.trainingInfo.endedDate && !isTracking){
                    startTrackingBasedOnType()
                }
                setIsRealTime(data.trainingInfo?.endedDate === "");
                setWaypoints(data.waypoints || []);
            } catch (error) {
                console.error('Erreur chargement entraînement:', error);
                Alert.alert(
                    'Erreur', 
                    'Impossible de charger les détails de l\'entraînement. Veuillez réessayer.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    });

    // Envoyer la position actuelle à l'API
    useEffect(() => {
        const sendLocationToAPI = async () => {
            if (currentLocation && isRealTime && training && (training.idTrainingType === 1 || training.idTrainingType === 2)) {
                try {
                    const res = await fetch(`${API_URL}api/geo`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            idTraining: trainingId,
                            date: new Date().toISOString(),
                            localization: JSON.stringify({
                                latitude: currentLocation.coords.latitude,
                                longitude: currentLocation.coords.longitude,
                            }),
                        }),
                    });

                    console.log("Réponse envoi position:", res.status);
                } catch (error) {
                    console.error('Erreur lors de l\'envoi de la position:', error);
                }
            }
        };

        sendLocationToAPI();
    }, [currentLocation, isRealTime, training, trainingId]);


    // Fonction pour démarrer le tracking spécifique au type d'entraînement
    const startTrackingBasedOnType = async () => {
        try {
            if (training && (training.idTrainingType === 1 || training.idTrainingType === 2)) {
                // Pour les types 1 et 2 (courses, randonnées, etc.), activer le tracking GPS
                await startTracking();
            } else {
                // Pour les autres types d'entraînement, ne pas activer le GPS
                // mais marquer comme démarré dans l'UI
                setTrackingState(true);
                console.log("Entraînement sans GPS démarré");
            }
        } catch (error) {
            console.error('Erreur lors du démarrage:', error);
            Alert.alert('Erreur', `Impossible de démarrer l'entraînement: ${error}`);
        }
    };
    
    // Fonction pour arrêter le tracking spécifique au type d'entraînement
    const stopTrackingBasedOnType = async () => {
        if (training && (training.idTrainingType === 1 || training.idTrainingType === 2)) {
            // Pour les types 1 et 2, arrêter le tracking GPS
            await stopTracking();
        } else {
            // Pour les autres types, juste arrêter dans l'UI
            setTrackingState(false);
            console.log("Entraînement sans GPS arrêté");
        }
    };
    // Gestion des actions d'entraînement
    const handleTrainingAction = () => {
        if (isTracking) {
            // Confirmation avant d'arrêter
            Alert.alert(
                'Arrêter l\'entraînement', 
                'Voulez-vous vraiment arrêter le suivi de cet entraînement ?',
                [
                    { text: 'Annuler', style: 'cancel' },
                    { 
                        text: 'Arrêter', 
                        style: 'destructive',
                        onPress: async () => {
                            await stopTrackingBasedOnType();
                            // Navigation vers la page post-entraînement

                            await fetch(`${API_URL}api/trainings/end/${id_training}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                }, 
                            });

                            router.push({
                                pathname: "/post-training/[id_training]",
                                params: {
                                    id_training: trainingId || 0,
                                    date: training?.startedDate || new Date().toISOString()
                                }
                            });
                        }
                    }
                ]
            );
        } else {
            // Démarrer le suivi
            Alert.alert(
                'Démarrer l\'entraînement',
                'Commencer le suivi de cet entraînement ?',
                [
                    { text: 'Annuler', style: 'cancel' },
                    { 
                        text: 'Démarrer', 
                        onPress: () => startTrackingBasedOnType()
                    }
                ]
            );
        }
    };

    // Calcul de distance entre deux points GPS
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371; // Rayon de la Terre en km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c; // Distance en km
    };
    
    // Calcul de la distance totale des waypoints
    const calculateTotalDistance = (waypoints: any) => {
        if (!waypoints || waypoints.length < 2) return 0;
        
        let totalDistance = 0;
        for (let i = 0; i < waypoints.length - 1; i++) {
            const currentPoint = waypoints[i];
            const nextPoint = waypoints[i + 1];
            
            totalDistance += calculateDistance(
                currentPoint.latitude, 
                currentPoint.longitude, 
                nextPoint.latitude, 
                nextPoint.longitude
            );
        }
        
        return totalDistance.toFixed(2);
    };

    // Vérifier si la carte doit être affichée
    const shouldShowMap = training && (training.idTrainingType === 1 || training.idTrainingType === 2);

    // Rendu pendant le chargement
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Chargement de l'entraînement...</Text>
            </View>
        );
    }

    if(!training?.difficulty  && training?.endedDate){
        return <></>
    }

    // Entraînement terminé (avec date de fin)
    if (training && waypoints && training.endedDate) {
        return (
            <ScrollView contentContainerStyle={styles.container}>
                {shouldShowMap && (
                    <Map trainingId={trainingId?.toString() || ""} isRealTime={false} waypoints={waypoints} />
                )}
                <View style={styles.infosContainer}>
                    <Text style={styles.infoLabel}>
                        {training.icon} <Text style={styles.boldText}>Type d'entrainement:</Text> {training.label.slice(0, 1).toUpperCase() + training.label.slice(1).toLowerCase()}
                    </Text>
                    <Text style={styles.infoLabel}>
                        ⏲️ <Text style={styles.boldText}>Durée :</Text> {formatDuration(training.startedDate, new Date(training.endedDate))}
                    </Text>
                    {training.calories > 0 && <Text style={styles.infoLabel}>
                        🔥 <Text style={styles.boldText}>Kcal dépensées : </Text> {training.calories} kcal
                    </Text>}
                    <Text style={styles.infoLabel}>
                        ⚡ <Text style={styles.boldText}>Difficulté :</Text> {training.difficulty.slice(0, 1).toUpperCase() + training.difficulty.slice(1).toLowerCase()}
                    </Text>
                    
                    {shouldShowMap && (
                        <Text style={styles.infoLabel}>
                            🗺️ <Text style={styles.boldText}>Distance parcourue : </Text> 
                            {training.distance 
                                ? `${training.distance.toFixed(2)} km` 
                                : waypoints && waypoints.length > 1 
                                    ? `${calculateTotalDistance(waypoints)} km` 
                                    : 'Non disponible'
                            }
                        </Text>
                    )}
                    
                    <Text style={styles.infoLabel}>
                        ❔ <Text style={styles.boldText}>Votre ressenti :</Text>
                    </Text>
                    <View style={styles.feelingContainer}>
                        <Text style={styles.feelingText}>
                            {training.feeling || 'Aucun ressenti enregistré pour cet entraînement.'}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        );
    } 
    
    // Entraînement en cours ou nouveau
    if (training && waypoints) {
        return (
            <View style={styles.mainContainer}>
                {/* ScrollView pour le contenu principal */}
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {shouldShowMap && (
                        <Map trainingId={trainingId?.toString() || ""} isRealTime={true} waypoints={waypoints} />
                    )}
                    <View style={styles.infosContainer}>
                        {/* Affichage du timer */}
                        <View style={styles.timerCard}>
                            <IconSymbol size={28} name="clock" color={'#FFFFFF'} />
                            <Text style={styles.timerText}>
                                {timer}
                            </Text>
                        </View>
                        
                        {/* Informations de base sur l'entraînement */}
                        <Text style={styles.infoLabel}>
                            {training.icon} <Text style={styles.boldText}>Type d'entrainement:</Text> {training.label.slice(0, 1).toUpperCase() + training.label.slice(1).toLowerCase()}
                        </Text>
                        
                        
                        {/* Espace supplémentaire pour que la ScrollView puisse défiler au-dessus du bouton fixe */}
                        <View style={styles.buttonPlaceholder} />
                    </View>
                </ScrollView>
                
                {/* Bouton fixe en bas de l'écran, hors de la ScrollView */}
                <View style={styles.fixedButtonContainer}>
                    {
                        isTracking ? (
                            <TouchableOpacity 
                            style={[
                                styles.actionButton, 
                                isTracking ? styles.stopButton : styles.startButton
                            ]} 
                            onPress={handleTrainingAction}
                        >
                            <Text style={styles.actionButtonText}>
                            Arrêter l'entraînement
                            </Text>
                        </TouchableOpacity>
                        ) : (
                            <ActivityIndicator size="large" color="#4CAF50" />
                        )
                    }
                </View>
            </View>
        );
    }

    // Cas d'erreur ou pas de données
    return (
        <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
                Impossible de charger les détails de l'entraînement.
            </Text>
            <TouchableOpacity 
                style={styles.reloadButton}
                onPress={() => setLoading(true)} // Relancer le chargement
            >
                <Text style={styles.reloadButtonText}>Réessayer</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        position: 'relative', // Important pour positionner le bouton fixe
    },
    scrollContent: {
        paddingBottom: 100, // Espace pour le bouton fixe
    },
    container: {
        paddingBottom: 80,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
    },
    loadingText: {
        marginTop: 10,
        color: 'white',
        fontSize: 16,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#121212',
    },
    errorText: {
        color: 'white',
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    reloadButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    reloadButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    infosContainer: {
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 15,
    },
    infoLabel: {
        color: 'white',
        fontSize: 16,
    },
    boldText: {
        fontWeight: '700',
    },
    feelingContainer: {
        padding: 15,
        backgroundColor: '#1e2021',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#343637',
    },
    feelingText: {
        fontSize: 14,
        color: 'white',
        lineHeight: 20,
    },
    timerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: 15,
        backgroundColor: '#1e2021',
        borderWidth: 1,
        borderColor: '#343637',
        borderRadius: 8,
        marginBottom: 10,
    },
    timerText: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    statusCard: {
        padding: 15,
        backgroundColor: '#1e2021',
        borderWidth: 1,
        borderColor: '#343637',
        borderRadius: 8,
        marginBottom: 10,
    },
    statusText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    noTrackingCard: {
        padding: 15,
        backgroundColor: '#2c2c2c',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#4CAF50',
        marginVertical: 10,
    },
    noTrackingText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 14,
    },
    locationStatusText: {
        color: '#aaa',
        fontSize: 14,
        marginBottom: 10,
    },
    coordsContainer: {
        backgroundColor: '#2c2c2c',
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
    },
    coordsText: {
        color: '#ddd',
        fontSize: 13,
    },
    // Conteneur pour le bouton fixe
    fixedButtonContainer: {
        position: 'absolute',
        bottom: 100,
        left: 20,
        right: 20,
        zIndex: 10,
    },
    // Espace réservé pour que la ScrollView puisse défiler derrière le bouton fixe
    buttonPlaceholder: {
        height: 70, // Hauteur du bouton + marge
    },
    actionButton: {
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    startButton: {
        backgroundColor: '#C6FF00',
    },
    stopButton: {
        backgroundColor: '#FF3B30',
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },
});