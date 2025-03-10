import React from 'react';
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet, TouchableOpacity } from "react-native";
import { View, Text, Alert, TextInput, Image, Button } from "react-native";

export default function ProfileScreen() {
    const user = {
        firstName: "Rhaegar",
        lastName: "Targaryen",
        email: "rhaegartargaryen@example.com",
        gender: "Homme",
        photo: "https://static.wikia.nocookie.net/gameofthronesfanon/images/8/8d/Rhaegar_Targaryen_%28ASOIAF%29.png/revision/latest/thumbnail/width/360/height/360?cb=20190315025149",
    };
    const handleDeleteAccount = () => {
        Alert.alert(
            "Supprimer le compte",
            "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.",
            [
                { text: "Annuler", style: "cancel" },
                { text: "Supprimer", style: "destructive", onPress: () => deleteUser() },
            ]
        );
    };

    const handleUpdateAccount = () => {
        Alert.alert(
            "Mettre à jour",
            "Êtes-vous sûr de vouloir mettre à jour votre compte ?",
            [
                { text: "Annuler", style: "cancel" },
                { text: "Mettre à jour", style: "default", onPress: () => updateUser() },
            ]
        );
    };

    const deleteUser = () => {
        console.log("Compte supprimé");
    };

    const updateUser = () => {
        console.log("Compte mise à jour");
    };
    const [prenom, onChangePrenom] = React.useState('');
    const [nom, onChangeNom] = React.useState('');
    const [email, onChangeMail] = React.useState('');
    const [sexe, onChangeSexe] = React.useState('');
    return (
        <ThemedView style={styles.mainContainer}>
            <View style={styles.mainView}>
                <View style={styles.introView}>
                    <Image
                        style={styles.image}
                        source={{ uri: user.photo }}
                    />
                    <Text style={styles.nameStyle} className="text-lg">{user.firstName} {user.lastName}</Text>
                </View>

                <Text style={styles.textStyle} className="text-lg">Prénom</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangePrenom}
                    value={prenom}
                    placeholder={user.firstName}
                />

                <Text style={styles.textStyle} className="text-lg">Nom</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeNom}
                    value={nom}
                    placeholder={user.lastName}

                />

                <Text style={styles.textStyle} className="text-lg">Adresse Email</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeMail}
                    value={email}
                    placeholder={user.email}
                />

                <Text style={styles.textStyle} className="text-lg">Sexe</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeSexe}
                    value={sexe}
                    placeholder={user.gender}
                />

                 <View style={styles.updateView}>
                    <TouchableOpacity
                        style={styles.updateButton}
                        onPress={handleUpdateAccount}
                    >
                        <Text style={styles.ButtonText}>Mettre à jour</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.separator} />

                <View style={styles.endingView}>
                    <Text style={styles.textStyle} className="text-lg">Supprimer votre compte</Text>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleDeleteAccount}
                    >
                        <Text style={styles.ButtonText}>Supprimer définitivement</Text>
                    </TouchableOpacity>
                </View>

               

            </View>
        </ThemedView>
    );
}


const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
    },
    mainView: {
        width: '90%',

    },

    inputContainer: {
    },

    introView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        textAlign: 'center',
        marginBottom: 10,

    },
    endingView: {
        marginTop: 20,
    },

    updateView: {
    },

    separator: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 20,
    },

    deleteButton: {
        backgroundColor: '#FA795D',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },

    updateButton: {
        color: 'white',
        backgroundColor: '#43A047',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
    },

    ButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },

    input: {
        height: 45,
        marginTop: 6,
        marginBottom: 30,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        borderColor: 'grey',

    },
    textStyle: {
        color: 'white',
        marginBottom: 1,

    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'flex-start',
    },
    nameStyle: {
        color: 'white',
        fontSize: 28,
        marginLeft: 10,
        marginTop: 36,
    }
});