import React, { useEffect, useState } from "react";
import { Alert, View, Text, TextInput, Image, TouchableOpacity, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";

// 🔹 Composant photo, nom
const ProfileHeader = ({ photo, fullName }: { photo: string; fullName: string }) => (
    <View style={styles.introView}>
        <Image style={styles.image} source={{ uri: photo }} />
        <Text style={styles.nameStyle}>{fullName}</Text>
    </View>
);

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
    const [user, setUser] = useState({ id: "", firstName: "", lastName: "", email: "", gender: "", photo: "" });

    useEffect(() => {
        fetch(`http://localhost:8080/users/1`) // Remplace 1 par un ID valide
            .then((response) => response.json())
            .then((data) => setUser(data))
            .catch((error) => console.error("Erreur API :", error));
    }, []);

    const handleUpdateAccount = () => {
        Alert.alert("Mettre à jour", "Voulez-vous enregistrer les modifications ?", [
            { text: "Annuler", style: "cancel" },
            { text: "Oui", onPress: updateUser },
        ]);
    };

    const updateUser = () => {
        fetch(`https://localhost:8080/update/${user.id}`, {
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
        fetch(`https://localhost:8080/delete/${user.id}`, {
            method: "DELETE",
        })
            .then((response) => response.json())
            .then(() => Alert.alert("Compte supprimé", "Votre compte a été supprimé avec succès."))
            .catch(() => Alert.alert("Erreur", "Impossible de supprimer le compte."));
    };

    return (
        <ThemedView style={styles.mainContainer}>
            <View style={styles.mainView}>
                <ProfileHeader photo={user.photo} fullName={`${user.firstName} ${user.lastName}`} />
                <ProfileField label="Prénom" value={user.firstName} onChangeText={(text) => setUser({ ...user, firstName: text })} />
                <ProfileField label="Nom" value={user.lastName} onChangeText={(text) => setUser({ ...user, lastName: text })} />
                <ProfileField label="Email" value={user.email} onChangeText={(text) => setUser({ ...user, email: text })} />
                <ProfileField label="Sexe" value={user.gender} onChangeText={(text) => setUser({ ...user, gender: text })} />

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
        width: 100,
        height: 100,
        borderRadius: 50
    },

    nameStyle: {
        fontSize: 28,
        marginLeft: 10
    },
    textStyle: {
        marginBottom: 5,
        color: "white",

    },

    input: {
        height: 45, borderWidth: 1,
        borderColor: "grey", padding: 10,
        borderRadius: 5, marginBottom: 20
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
