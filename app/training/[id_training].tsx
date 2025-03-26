import { Map } from '@/components/map/Map';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { TrainingContext } from '@/context/TrainingContext';
import Constants from 'expo-constants';
import { useLocalSearchParams } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


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
    const { text, startTraining, stopTraining } = useContext(TrainingContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URL}api/trainingPage/getTrainingInfoById/${trainingId}`);
                const data = await response.json();
                setTraining(data.trainingInfo);
                setIsRealTime(data.trainingInfo.endedDate === "");
                setWaypoints(data.waypoints);
            } catch (error) {
                console.error('Error fetching training:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id_training]);

    return loading ? (
        <View style={{ flex: 1, paddingTop: 50, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#4CAF50" />
        </View>
    ) :
        training && waypoints && training.endedDate ? (
            <ScrollView contentContainerStyle={styles.container}>
                <Map trainingId={id_training} isRealTime={isRealTime} waypoints={waypoints} />
                <View style={styles.infosContainer}>
                    <Text style={{ color: 'white', fontSize: 16 }}>
                        {training.icon} <Text style={{ fontWeight: '700' }}>Type d'entrainement:</Text> {training.label.slice(0, 1).toUpperCase() + training.label.slice(1).toLowerCase()}
                    </Text>
                    <Text style={{ color: 'white', fontSize: 16 }}>
                        ⏲️ <Text style={{ fontWeight: '700' }}>Durée :</Text> {(() => {
                            const start = new Date(training.startedDate);
                            const end = new Date(training.endedDate);
                            const diffMs = end.getTime() - start.getTime();
                            const hours = Math.floor(diffMs / (1000 * 60 * 60));
                            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                            return `${hours.toString().padStart(2, '0')} h ${minutes.toString().padStart(2, '0')} min`;
                        })()}
                    </Text>
                    <Text style={{ color: 'white', fontSize: 16 }}>
                        🔥 <Text style={{ fontWeight: '700' }}>Kcal dépensées :</Text> {training.calories} kcal
                    </Text>
                    <Text style={{ color: 'white', fontSize: 16 }}>
                        ⚡ <Text style={{ fontWeight: '700' }}>Difficulté :</Text> {training.difficulty.slice(0, 1).toUpperCase() + training.difficulty.slice(1).toLowerCase()}
                    </Text>
                    <Text style={{ color: 'white', fontSize: 16 }}>
                        🗺️ <Text style={{ fontWeight: '700' }}>Distance parcourue :</Text> {training.distance ? training.distance.toFixed(2) + 'km' : null}
                    </Text>
                    <Text style={{ color: 'white', fontSize: 16 }}>
                        ❔ <Text style={{ fontWeight: '700' }}>Votre ressenti :</Text>
                    </Text>
                    <View style={styles.feelingContainer}>
                        <Text style={styles.feelingText}>
                            {training.feeling}Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor inLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor inLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor inLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor inLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor inLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor inLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor inLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        ) : training && waypoints && (
            <ScrollView contentContainerStyle={styles.container}>
                <Map trainingId={id_training} isRealTime={isRealTime} waypoints={waypoints} />
                <View style={styles.infosContainer}>
                    <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ width: "100%", display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: '#343637', padding: 10, borderRadius: 8 }}>
                            {/* Timer between startedDate and now */}
                            <IconSymbol size={28} name="clock" color={'#FFFFFF'} />
                            <Text style={{ color: 'white', fontSize: 16 }}>
                                {(() => {
                                    const start = new Date(training.startedDate);
                                    const end = new Date();
                                    const diffMs = end.getTime() - start.getTime();
                                    const hours = Math.floor(diffMs / (1000 * 60 * 60));
                                    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                                    return `${hours.toString().padStart(2, '0')} h ${minutes.toString().padStart(2, '0')} min`;
                                })()}
                            </Text>
                        </View>
                    </View>
                    <View>
                        <TouchableOpacity style={styles.button} onPress={() => startTraining()}>
                            <Text>
                                {text}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => stopTraining()}>
                            <Text>
                                Terminer l'entrainement
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView >
        );
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 80,
    },
    infosContainer: {
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
    },
    feelingContainer: {
        padding: 10,
        backgroundColor: '#1e2021',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#343637',
    },
    feelingText: {
        fontSize: 14,
        color: 'white'
    },
    button: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        color: "black",
        borderRadius: 10,
        backgroundColor: "#C6FF00",
    },
});
