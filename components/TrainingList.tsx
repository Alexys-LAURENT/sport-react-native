import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import TrainingItem from './TrainingItem'; // Composant pour afficher un entraînement

const API_URL = 'http://127.0.0.1:8080/api/trainings/'; // Remplace par l'URL de ton API
type training = {
    idTraining : number,
    date : string,
    calories : number,
    icon: string,
    label: string
}
const TrainingList = () => {
    const [trainings, setTrainings] = useState<training[]>([]); // Stocke les entraînements
    const [loading, setLoading] = useState(true); // Gère le chargement

    useEffect(() => {
        const fetchTrainings = async () => {
            try {
                const response = await fetch(API_URL);
                const data = await response.json();
                console.log();
                setTrainings(data);
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
        <View>
            <FlatList
                data={trainings}
                keyExtractor={(item) => item.idTraining.toString()}
                renderItem={({ item }) => <TrainingItem training={item} />}
            />
        </View>
    );
};

export default TrainingList;
