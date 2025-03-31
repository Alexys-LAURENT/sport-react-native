import CustomButton from "@/components/CustomButton";
import CustomTextInput from "@/components/CustomTextInput";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from 'expo-constants';
import React, { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const API_URL = Constants.expoConfig?.extra?.API_URL;

// 🔹 Composant photo, nom
const ProfileHeader = ({ photo, fullName }: { photo: string; fullName: string }) => {
    return (
        <View style={styles.introView}>
            <View style={{ width: 100, height: 100, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Image 
                    style={styles.image} 
                    source={require('@/assets/images/defaultUserIcon.png')}
                />
            </View>
            <Text style={styles.nameStyle}>{fullName}</Text>
        </View>
    );
};

// Nouveau composant pour la sélection de genre
const GenderSelector = ({ label, value, onSelect }: { label: string; value: string; onSelect: (value: string) => void }) => (
    <View>
        <Text style={styles.textStyle}>{label}</Text>
        <View style={styles.selectorContainer}>
            <TouchableOpacity 
                style={[
                    styles.genderOption, 
                    value === "Homme" && styles.selectedGender
                ]} 
                onPress={() => onSelect("Homme")}
            >
                <Text style={[
                    styles.genderText, 
                    value === "Homme" && styles.selectedGenderText
                ]}>Homme</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[
                    styles.genderOption, 
                    value === "Femme" && styles.selectedGender
                ]} 
                onPress={() => onSelect("Femme")}
            >
                <Text style={[
                    styles.genderText, 
                    value === "Femme" && styles.selectedGenderText
                ]}>Femme</Text>
            </TouchableOpacity>
        </View>
    </View>
);


export default function ProfileScreen() {
    const [user, setUser] = useState({ 
        idUser: "", 
        prenom: "", 
        nom: "", 
        email: "", 
        sexe: "", 
        photo: "" 
    });

    const {logout} = useAuth();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Retrieve userId from AsyncStorage
                const userId = await AsyncStorage.getItem('userId');
                
                if (!userId) {
                    Alert.alert('Erreur', 'Impossible de récupérer l\'identifiant utilisateur');
                    return;
                }

                // Fetch user details
                const response = await fetch(`${API_URL}users/${userId}`);
                
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des données utilisateur');
                }

                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error("Erreur API :", error);
                Alert.alert('Erreur', 'Impossible de charger les informations utilisateur');
            }
        };
        
        fetchUser();
    }, []);

    const handleUpdateAccount = () => {
        Alert.alert("Mettre à jour", "Voulez-vous enregistrer les modifications ?", [
            { text: "Annuler", style: "cancel" },
            { text: "Oui", onPress: updateUser },
        ]);
    };

    const updateUser = async () => {
        try {
            const response = await fetch(`${API_URL}update/${user.idUser}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user),
            });
            
            
            // Log the raw response text first
            const responseText = await response.text();
            
            // Only try to parse as JSON if it looks like JSON
            let data;
            if (responseText.startsWith('{') || responseText.startsWith('[')) {
                try {
                    data = JSON.parse(responseText);
                    Alert.alert("Succès", "Profil mis à jour avec succès !");
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                    Alert.alert("Succès", "Profil mis à jour, mais les détails n'ont pas pu être affichés.");
                }
            } else {
                Alert.alert("Succès", "Profil mis à jour avec succès !");
            }
        } catch (error) {
            console.error("Error updating user:", error);
            Alert.alert("Erreur", "Échec de la mise à jour.");
        }
    };
    
    const handleDeleteAccount = () => {
        Alert.alert("Supprimer le compte", "Cette action est irréversible. Confirmez-vous la suppression ?", [
            { text: "Annuler", style: "cancel" },
            { text: "Supprimer", style: "destructive", onPress: deleteUser },
        ]);
    };

    const deleteUser = () => {
        fetch(`${API_URL}delete/${user.idUser}`, {
            method: "DELETE",
        })
            .then((response) => response.json())
            .then(() => Alert.alert("Compte supprimé", "Votre compte a été supprimé avec succès."))
            .catch(() => Alert.alert("Erreur", "Impossible de supprimer le compte."));
    };

    return (
        <ThemedView style={styles.mainContainer}>
            <View style={styles.mainView}>
                <ProfileHeader photo={user.photo} fullName={`${user.prenom} ${user.nom}`} />
                <View style={{ gap : 10 }}>
                    <CustomTextInput label="Prénom" value={user.prenom} onChangeText={(text) => setUser({ ...user, prenom: text })} />
                    <CustomTextInput label="Nom" value={user.nom} onChangeText={(text) => setUser({ ...user, nom: text })} />
                    <CustomTextInput label="Email" value={user.email} onChangeText={(text) => setUser({ ...user, email: text })} />
                    <GenderSelector label="Sexe" value={user.sexe} onSelect={(value) => setUser({ ...user, sexe: value })} />
                </View>

                <View style={styles.buttonContainer}>
                    <CustomButton
                        title="Mettre à jour"
                        onPress={handleUpdateAccount}
                        variant="primary"
                    />
                    <CustomButton
                        title="Déconnexion"
                        onPress={() => {
                            Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
                                { text: "Annuler", style: "cancel" },
                                { text: "Déconnexion", onPress: () => logout() },
                            ]);
                        }}
                        variant="danger"
                    />
                    <CustomButton
                        title="Supprimer le compte"
                        onPress={handleDeleteAccount}
                        variant="danger"
                    />
                </View>
            </View>
        </ThemedView>
    );
}

// 🔹 Styles
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },

    mainView: {
        width: "90%"
    },

    introView: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10
    },

    image: {
        width: 75,
        height: 75,
        borderRadius: 100
    },

    nameStyle: {
        fontSize: 28,
        marginLeft: 10,
        color: "white",
    },
    textStyle: {
        marginBottom: 5,
        color: "white",
    },

    input: {
        height: 45, borderWidth: 1,
        borderColor: "grey", padding: 10,
        borderRadius: 5, marginBottom: 20,
        color: "white",
    },

    buttonContainer: { marginTop: 20, 
        gap: 10,
     },

    actionButton: {
        padding: 12,
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 10
    },

    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold"
    },
    
    // Nouveaux styles pour le sélecteur de genre
    selectorContainer: {
        flexDirection: "row",
        marginBottom: 20
    },
    
    genderOption: {
        flex: 1,
        height: 45,
        borderWidth: 1,
        borderColor: "grey",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 5
    },
    
    genderText: {
        color: "white"
    },
    
    selectedGender: {
        backgroundColor: "#555",
        borderColor: "#fff"
    },
    
    selectedGenderText: {
        fontWeight: "bold"
    }
});