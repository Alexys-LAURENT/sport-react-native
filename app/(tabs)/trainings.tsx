import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import TrainingList from "@/components/TrainingList";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { StyleSheet } from "react-native";


export default function TrainingsScreen() {
  const [refreshKey, setRefreshKey] = useState(0);

    useFocusEffect(
      useCallback(() => {
        // Cette fonction sera appelée chaque fois que l'écran est focalisé
        setRefreshKey(prevKey => prevKey + 1);
        
        return () => {
          // Nettoyage si nécessaire quand l'écran perd le focus
        };
      }, [])
    );

  return (
    <ThemedView style={styles.mainContainer}>
        {/* Title */}
        <ThemedText style={styles.titleContainer} type="title">Vos derniers entrainements 💪</ThemedText>

        <TrainingList key={refreshKey} />

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
        paddingVertical: 32,
        paddingHorizontal: 22,
    },
});
