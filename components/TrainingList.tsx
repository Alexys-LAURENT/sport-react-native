import { Training } from '@/types/entities';
import Constants from 'expo-constants';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import TrainingItem from './TrainingItem'; // Composant pour afficher un entraînement

const API_URL = Constants.expoConfig?.extra?.API_URL;
// TODO : change this to the current user id
const ID_USER = 1

const TrainingList = () => {
    const [trainings, setTrainings] = useState<Training[]>([]); // Stocke les entraînements
    const [loading, setLoading] = useState(true); // Gère le chargement

    useEffect(() => {
        const fetchTrainings = async () => {
            try {
                const response = await fetch(API_URL+`api/trainings/${ID_USER}`);
                const data = await response.json();
                console.log(data);
                setTrainings(data.trainings);
            } catch (error) {
                console.error('Erreur lors de la récupération des entraînements:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrainings();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#4CAF50" />;
    }

    return (
        <ScrollView style={{width:'100%'}} contentContainerStyle={{width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {
                trainings.length > 0 ? (
                    trainings.map((training) => (
                        <TrainingItem key={training.idTraining} training={training} />
                    ))
                ) : (
                    <View>
                        <Text>Aucun entraînement</Text>
                    </View>
                )
            }
        </ScrollView>
    );
};

export default TrainingList;
