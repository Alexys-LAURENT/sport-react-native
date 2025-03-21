import React, { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';

const API_URL = Constants.expoConfig?.extra?.API_URL;

export default function TrainingFeedbackScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { trainingId } = route.params || {};

    const [difficulty, setDifficulty] = useState(3); // 1-5: very easy to very difficult
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Labels for difficulty levels
    const difficultyLabels = ['Très simple', 'Simple', 'Modéré', 'Difficile', 'Très difficile'];

    const getDifficultyLabelPosition = () => {
        return (difficulty - 1) / 4; // 0 to 1 position for the slider
    };

    const handleSubmit = async () => {
        if (!trainingId) {
            setError("ID d'entraînement manquant");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/trainings/${trainingId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    difficulty,
                    feedback,
                }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour');
            }

            // Navigation à la page d'accueil ou page de succès
            navigation.navigate('Home');
        } catch (err) {
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
                    value={difficulty}
                    onValueChange={setDifficulty}
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
                                difficulty === index + 1 ? styles.activeDifficultyLabel : null
                            ]}
                        >
                            {label}
                        </Text>
                    ))}
                </View>
            </View>

            <View style={styles.feedbackContainer}>
                <Text style={styles.label}>? Votre ressenti :</Text>
                <TextInput
                    style={styles.feedbackInput}
                    placeholder="Décrivez ce que vous avez pensé de votre séance et/ou des notes à vous-même..."
                    placeholderTextColor="#666"
                    multiline
                    numberOfLines={5}
                    value={feedback}
                    onChangeText={setFeedback}
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
    feedbackContainer: {
        marginBottom: 30,
    },
    feedbackInput: {
        backgroundColor: '#222222',
        borderRadius: 10,
        padding: 15,
        color: '#FFFFFF',
        height: 120,
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