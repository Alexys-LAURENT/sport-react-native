import ParallaxScrollViewNoimage from "@/components/ParallaxScrollViewNoImage";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet } from "react-native";


export default function TrainingsScreen() {
  return (
    <ThemedView style={styles.mainContainer}>
        {/* Title */}
        <ThemedText style={styles.titleContainer} type="title">Vos derniers entrainements 💪</ThemedText>
        
        {/* Scroll de la liste des entrainements */}
        <ParallaxScrollViewNoimage headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}>
            
        </ParallaxScrollViewNoimage>
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
