import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from '@/components/ThemedView';
import TrainingList from "@/components/TrainingList";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const API_URL = Constants.expoConfig?.extra?.API_URL;

// Training types data
const trainingTypes = [
  { id: 1, icon: '🏃‍♂️', label: 'running', color: '#FA795D' },
  { id: 2, icon: '🚴‍♂️', label: 'vélo', color: '#85FA5D' },
  { id: 3, icon: '🤸‍♂️', label: 'fitness', color: '#5DFAF0' },
  { id: 4, icon: '🏋️‍♂️', label: 'Musculation', color: '#A25DFA' },
  { id: 5, icon: '🏊‍♂️', label: 'Natation', color: '#FA5D82' },
  { id: 6, icon: '💪', label: 'Autre', color: '#FFFFFF' }
];

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const handleTrainingTypeSelect = async (type: any) => {
    try {
      // Get the user ID from AsyncStorage
      const userId = await AsyncStorage.getItem('userId');
      
      if (!userId) {
        Alert.alert('Erreur', 'Impossible de récupérer l\'identifiant utilisateur');
        return;
      }
  
      // Prepare the training data
      const trainingData = {
        idUser: parseInt(userId),
        idTrainingType: type.id
      };
  
      console.log('Sending training creation request:', trainingData);
  
      // Send request to create training
      const response = await fetch(`${API_URL}api/trainings/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trainingData)
      });
  
      console.log('Response status:', response.status);
  
      if (!response.ok) {
        // Try to get error details
        const errorBody = await response.text();
        console.error('Error response body:', errorBody);
        
        throw new Error(`Erreur lors de la création de l'entraînement: ${errorBody}`);
      }
  
      // Parse the response
      const createdTraining = await response.json();
      console.log('Created training:', createdTraining);
  
      // Close the modal
      setModalVisible(false);
  
      // Navigate to the training screen with the new training ID
      router.push({
        pathname: "/training/[id_training]",
        params: {
          id_training: createdTraining.id,
        }
      });
  
    } catch (error:any) {
      console.error('Erreur détaillée de création d\'entraînement:', error);
      Alert.alert('Erreur', `Impossible de créer l'entraînement: ${error.message}`);
    }
  };

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
        <TouchableOpacity 
          style={styles.startButton} 
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.startButtonText}>Commencer l'entrainement !</Text>
        </TouchableOpacity>

        {/* Modal de sélection de type d'entraînement */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ThemedText style={styles.modalTitle} type="title">
                Choisissez un type d'entraînement
              </ThemedText>
              
              <View style={styles.trainingTypeGrid}>
                {trainingTypes.map((type) => (
                  <TouchableOpacity 
                    key={type.id}
                    style={[
                      styles.trainingTypeButton, 
                      { backgroundColor: type.color }
                    ]}
                    onPress={() => handleTrainingTypeSelect(type)}
                  >
                    <Text style={styles.trainingTypeIcon}>{type.icon}</Text>
                    <Text style={styles.trainingTypeLabel}>{type.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: 10,
    marginHorizontal: -10,
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
    alignSelf: 'flex-start',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: "#FFF"
  },

  startButton: {
    width: "100%", 
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: "#C6FF00",
  },

  startButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: 'bold',
  },

  seeMoreButton: {
    width: "100%",
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

  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  modalContent: {
    width: '90%',
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },

  trainingTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  trainingTypeButton: {
    width: '45%',
    margin: 5,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  trainingTypeIcon: {
    fontSize: 40,
    marginBottom: 10,
  },

  trainingTypeLabel: {
    color: 'black',
    fontWeight: 'bold',
  },

  closeButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#333',
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },

  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});