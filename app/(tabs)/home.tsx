import { Image, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { ThemedText } from "@/components/ThemedText";
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';
import TrainingList from "@/components/TrainingList";
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/banner.png')}
          style={styles.banner}
        />
      }
    >
      <ThemedView style={styles.mainContainer}>
        
        <ThemedText style={styles.title} type="title">
          Vos derniers entraînements 💪
        </ThemedText>

        <TrainingList limit={5} />

        {/* Bouton Voir plus */}
        <TouchableOpacity style={styles.seeMoreButton}>
          <Text style={styles.seeMoreText}>Voir plus</Text>
        </TouchableOpacity>

        {/* Section motivation */}
        <ThemedText style={styles.subtitle} type="title">
          Ne lâchez rien !
        </ThemedText>

        {/* Bouton Commencer l'entraînement */}
        <Link style={styles.startButton} href="/(tabs)/trainings">
          Commencer l'entrainement !
        </Link>

      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: 10,
    marginHorizontal: -10, // Élargit en supprimant la marge extérieure
  },
  

  banner: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    borderRadius: 15,
    overflow: 'hidden',
  },

  title: {
    alignSelf: 'flex-start',
    fontSize: 21,
    fontWeight: 'bold',
    paddingBottom: 20,
    color: "#FFF"
  },

  subtitle: {
    alignSelf: 'flex-start', // Aligné à gauche
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: "#FFF"
  },

  startButton: {
    width: "100%", 
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold', 
    marginTop: 15,
    paddingVertical: 15,
    color: "black",
    borderRadius: 10,
    backgroundColor: "#C6FF00",
  },

  seeMoreButton: {
    width: "100%", // Largeur ajustée
    backgroundColor: "#222",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },

  seeMoreText: {
    color: "#C6FF00",
    fontSize: 14,
    fontWeight: "bold",
  },
});
