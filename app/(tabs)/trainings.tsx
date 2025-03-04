import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import TrainingList from "@/components/TrainingList";
import React from "react";
import { StyleSheet } from "react-native";


export default function TrainingsScreen() {
  return (
    <ThemedView style={styles.mainContainer}>
        {/* Title */}
        <ThemedText style={styles.titleContainer} type="title">Vos derniers entrainements 💪</ThemedText>

        <TrainingList/>

    </ThemedView>
    );
}


const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'baseline',
        paddingTop: 32,
        paddingBottom: 16,
        fontSize: 20,
    },
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
});
