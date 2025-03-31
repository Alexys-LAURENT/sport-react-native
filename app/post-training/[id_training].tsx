import Slider from '@react-native-community/slider';
import Constants from 'expo-constants';
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const API_URL = Constants.expoConfig?.extra?.API_URL;

export default function TrainingFeedbackScreen() {
    const { id_training } = useLocalSearchParams<{ id_training: string }>();
    const [difficultyIndex, setDifficultyIndex] = useState(2);
    const [feeling, setFeeling] = useState('');
    const [calories, setCalories] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const difficultyLabels = ['très facile', 'facile', 'modéré', 'difficile', 'très difficile'];
    if(!id_training){
        router.push('/(tabs)/home')
    }
    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        const difficulty=difficultyLabels[difficultyIndex -1]||difficultyLabels[2]
        try {
            const response = await fetch(`${API_URL}api/trainings/${id_training}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    difficulty:difficulty,
                    calories:calories||0,
                    feeling:feeling||"",
                }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour');
            }

            // Navigation à la page d'accueil ou page de succès
            router.push('/(tabs)/home')
        } catch (err:any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Comment était votre séance ?</Text>

            <View style={styles.difficultyContainer}>
                <Text style={styles.label}>⚡ Difficulté :</Text>

                <Slider
                    style={styles.slider}
                    minimumValue={1}
                    maximumValue={5}
                    step={1}
                    value={difficultyIndex}
                    onValueChange={setDifficultyIndex}
                    minimumTrackTintColor="#CCFF00"
                    maximumTrackTintColor="#333333"
                    thumbTintColor="#CCFF00"
                />

                <View style={styles.difficultyLabelsContainer}>
                    {difficultyLabels.map((label, index) => (
                        <Text
                            key={index}
                            style={[
                                styles.difficultyLabel,
                                difficultyIndex === index + 1 ? styles.activeDifficultyLabel : null
                            ]}
                        >
                            {label}
                        </Text>
                    ))}
                </View>
            </View>

            <Text style={styles.label}>🔥 Calories dépensées :</Text>
            <TextInput
                style={styles.caloriesInput}
                placeholder="Calories dépensées"
                keyboardType="numeric"
                value={calories.toString()}
                onChangeText={(text) => setCalories(Number(text))}
            />

            <View style={styles.feedbackContainer}>
                <Text style={styles.label}>? Votre ressenti :</Text>
                <TextInput
                    style={styles.feedbackInput}
                    placeholder="Décrivez ce que vous avez pensé de votre séance et/ou des notes à vous-même..."
                    placeholderTextColor="#666"
                    multiline
                    numberOfLines={5}
                    value={feeling}
                    onChangeText={setFeeling}
                />
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#000" />
                ) : (
                    <Text style={styles.submitButtonText}>Enregistrer</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A1A1A',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginTop: 40,
        marginBottom: 30,
    },
    difficultyContainer: {
        marginBottom: 30,
    },
    label: {
        fontSize: 16,
        color: '#FFFFFF',
        marginBottom: 15,
    },
    slider: {
        height: 40,
    },
    difficultyLabelsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    difficultyLabel: {
        fontSize: 12,
        color: '#999999',
    },
    activeDifficultyLabel: {
        color: '#CCFF00',
        fontWeight: 'bold',
    },
    caloriesInput: {
        backgroundColor:'#1E2021',
        width: '100%',
        height: 50,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        color: '#FFFFFF',
        marginBottom: 15,
    },
    feedbackContainer: {
        marginBottom: 30,
    },
    feedbackInput: {
        backgroundColor:'#1E2021',
        width: '100%',
        height: 120,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        color: '#FFFFFF',
        textAlignVertical: 'top',
    },
    errorText: {
        color: '#FF6B6B',
        marginBottom: 15,
    },
    submitButton: {
        backgroundColor: '#CCFF00',
        borderRadius: 10,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
    },
});