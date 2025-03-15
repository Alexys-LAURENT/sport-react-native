import { Image, StyleSheet, Button } from 'react-native';
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
      }>

      <ThemedView style={styles.mainContainer}>

        <ThemedText style={styles.titleContainer} type="title">Vos derniers entrainements 💪</ThemedText>

          <TrainingList />

        <ThemedText style={styles.titleContainer} type="title">Ne lachez rien</ThemedText>

        <Link style={styles.button} href="/(tabs)/home">Se Connecter</Link>


      </ThemedView>

    </ParallaxScrollView>

  );
}


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },

  banner: {
    height: '100%',
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },

  titleContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'baseline',
    paddingTop: 32,
    paddingBottom: 16,
    fontSize: 20,
  },
});