import { Map } from '@/components/map/Map';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Constants from 'expo-constants';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';


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
}
const API_URL = Constants.expoConfig?.extra?.API_URL;


export default function TrainingScreen() {
    const { id_training } = useLocalSearchParams<{ id_training: string }>();
    const trainingId = id_training ? parseInt(id_training) : null;
    const [training, setTraining] = useState<Training | null>(null);
    const [waypoints, setWaypoints] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URL}api/trainingPage/getTrainingInfoById/${trainingId}`);
                const data = await response.json();
                setTraining(data.trainingInfo);
                setWaypoints(data.waypoints);
            } catch (error) {
                console.error('Error fetching training:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }
    , [id_training]);

  return training && waypoints && !loading && (
    <ThemedView style={styles.container}>
        <Map isRealTime={false} waypoints={waypoints} />
        <ThemedView style={styles.infosContainer}>
            <ThemedText style={styles.title}>
                Entrainement du {new Date(training.startedDate).toLocaleDateString()}
            </ThemedText>
            <ThemedText>
                Type d'entrainement: {training.idTrainingType}
            </ThemedText>
            <ThemedText>
                Durée: {(() => {
                    const start = new Date(training.startedDate);
                    const end = new Date(training.endedDate);
                    const diffMs = end.getTime() - start.getTime();
                    const hours = Math.floor(diffMs / (1000 * 60 * 60));
                    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                    return `${hours.toString().padStart(2, '0')} h ${minutes.toString().padStart(2, '0')} min`;
                })()}
            </ThemedText>
            <ThemedText>
                Kcal dépensées: {training.calories} kcal
            </ThemedText>
            <ThemedText>
                Difficulté: {training.difficulty}
            </ThemedText>
            <ThemedText>
                Distance parcourue: {training.distance ? training.distance.toFixed(2) + 'km' : null }
            </ThemedText>
            <ThemedText>
                Votre ressenti:
            </ThemedText>
            <ThemedView style={styles.feelingContainer}>
                <ThemedText style={styles.feelingText}>
                    {training.feeling}Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </ThemedText>
            </ThemedView>
        </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    infosContainer: {
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingBottom: 25,
    },
    feelingContainer: {
        padding: 10,
        backgroundColor: '#1e2021',
        borderRadius: 8,
        borderWidth: 1,
        borderColor : '#343637',
    },
    feelingText: {
        fontSize: 14,
    },
});
