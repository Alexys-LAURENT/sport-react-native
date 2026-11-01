import { Training } from '@/types/entities';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import TrainingItem from './TrainingItem';

const API_URL = Constants.expoConfig?.extra?.API_URL;

const TrainingList = ({ limit }: { limit?: number }) => {
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem('userId');
                setUserId(storedUserId);
            } catch (error) {
                console.error("Erreur lors de la récupération de l'ID utilisateur:", error);
            }
        };

        fetchUserId();
    }, []);

    useEffect(() => {
        const fetchTrainings = async () => {
            if (!userId) return;

            try {
                const response = await fetch(`${API_URL}api/trainings/${userId}${limit ? `?limit=${limit}` : ''}`);
                const data = await response.json();
                setTrainings(data.trainings);
            } catch (error) {
                console.error("Erreur lors de la récupération des entraînements:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrainings();
    }, [userId, limit]);

    if (loading) {
        return <ActivityIndicator size="large" color="#4CAF50" />;
    }

    return (
        <ScrollView style={{ width: '100%' }} contentContainerStyle={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {trainings.length > 0 ? (
                trainings.map((training) => <TrainingItem key={training.idTraining} training={training} />)
            ) : (
                <View>
                    <Text style={{ color:"white" }}>Aucun entraînement</Text>
                </View>
            )}
        </ScrollView>
    );
};

export default TrainingList;