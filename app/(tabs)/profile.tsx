import React from 'react';
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet } from "react-native";
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
    const deleteUser = () => {
        console.log("Compte supprimé");
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
                        source={{uri: user.photo}}
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
                <View style={styles.endingView}>
                    <Text style={styles.textStyle} className="text-lg">Supprimer votre compte</Text>
                    <Button
                        title="Supprimer définitivement"
                        color="red"
                        onPress={handleDeleteAccount}
                    />
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
    introView: {
        flexDirection: 'row',
        flexWrap: 'wrap', 
        textAlign: 'center',
        marginBottom: 20,
    },
    endingView: {
        marginTop: 20,
    },
    input: {
        height: 50,
        marginTop: 6,
        marginBottom: 6,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        borderColor:'grey',
    },
    textStyle: {
        color: 'white',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'flex-start',
    },
    nameStyle : {
        color: 'white',
        fontSize: 28,
        marginLeft: 10,
        marginTop: 36,
    }
});