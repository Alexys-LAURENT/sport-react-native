import { ThemedView } from "@/components/ThemedView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from 'expo-constants';
import React, { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

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

const ProfileField = ({ label, value, onChangeText }: { label: string; value: string; onChangeText: (text: string) => void }) => (
    <View>
        <Text style={styles.textStyle}>{label}</Text>
        <TextInput style={styles.input} onChangeText={onChangeText} value={value} />
    </View>
);

const ActionButton = ({ title, onPress, color }: { title: string; onPress: () => void; color: string }) => (
    <TouchableOpacity style={[styles.actionButton, { backgroundColor: color }]} onPress={onPress}>
        <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
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

    const updateUser = () => {
        fetch(`${API_URL}update/${user.idUser}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        })
            .then((response) => response.json())
            .then((data) => Alert.alert("Succès", "Profil mis à jour avec succès !"))
            .catch(() => Alert.alert("Erreur", "Échec de la mise à jour."));
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
                <ProfileField label="Prénom" value={user.prenom} onChangeText={(text) => setUser({ ...user, prenom: text })} />
                <ProfileField label="Nom" value={user.nom} onChangeText={(text) => setUser({ ...user, nom: text })} />
                <ProfileField label="Email" value={user.email} onChangeText={(text) => setUser({ ...user, email: text })} />
                <ProfileField label="Sexe" value={user.sexe} onChangeText={(text) => setUser({ ...user, sexe: text })} />

                <View style={styles.buttonContainer}>
                    <ActionButton title="Mettre à jour" onPress={handleUpdateAccount} color="#43A047" />
                    <ActionButton title="Supprimer le compte" onPress={handleDeleteAccount} color="#D32F2F" />
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

    buttonContainer: { marginTop: 20 },

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
});
