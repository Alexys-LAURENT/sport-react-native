import { ThemedView } from "@/components/ThemedView";
import Constants from 'expo-constants';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Button, Image, StyleSheet, Text, TextInput, View } from "react-native";

const API_URL = Constants.expoConfig?.extra?.API_URL;

export default function signin() {
    const [prenom, onChangePrenom] = React.useState('');
    const [nom, onChangeNom] = React.useState('');
    const [email, onChangeMail] = React.useState('');
    const [sexe, onChangeSexe] = React.useState('');
    const [password, onChangePassword] = React.useState('');
    const router = useRouter();
    const signIn = async () => {
        try {
            const response = await fetch(API_URL+"inscription", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nom: nom,
                    prenom: prenom,
                    sexe: sexe,
                    email: email,
                    hashedPass: password,
                }),
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Token JWT :", data.token);
                router.push("/(tabs)/home");
            } else {
                const data = await response.json();
                alert("Identifiants déjà utilisé");
                console.log("Erreur", "Identifiants déjà utilisé");
            }
        } catch (error) {
            console.error("Erreur d'inscription :", error);
        }
    };
    return (
        <ThemedView style={styles.mainContainer}>
            <Image
                style={styles.logo}
                source={{uri: "https://lh6.googleusercontent.com/proxy/vU5w1R8N9COetJHBUkqlPSdAAfvG_8S8YPdPQN7pKW3a7rHHuCvjikuMyxQuCSMMVxDMdaH_33GAsmcI2vi9yFmhk6k_VeOZjgfSB5Z_IzIHgpSfSoblffxL0xsa7TPeNqf13Bgr"}}
            />
            <Text style={styles.titleStyle}>Inscription</Text>
            <View style={styles.mainView}>
                <Text style={styles.textStyle} className="text-lg">Prénom</Text>
                <TextInput
                    style={[styles.input, { color: "white" }]}
                    onChangeText={onChangePrenom}
                    value={prenom}
                />
                <Text style={styles.textStyle} className="text-lg">Nom</Text>
                <TextInput
                    style={[styles.input, { color: "white" }]}
                    onChangeText={onChangeNom}
                    value={nom}
                />
                <Text style={styles.textStyle} className="text-lg">Adresse Email</Text>
                <TextInput
                    style={[styles.input, { color: "white" }]}
                    onChangeText={onChangeMail}
                    value={email}
                />
                <Text style={styles.textStyle} className="text-lg">Sexe</Text>
                <TextInput
                    style={[styles.input, { color: "white" }]}
                    onChangeText={onChangeSexe}
                    value={sexe}
                />
                <Text style={styles.textStyle}>Mot de Passe</Text>
                <TextInput 
                    style={[styles.input, { color: "white" }]}
                    secureTextEntry
                    onChangeText={onChangePassword}
                    value={password}
                />
                <Button title="S'inscrire" onPress={signIn}/>
            </View>
            <Link style={styles.button_tres} href="/login">Vous avez déjà un compte ? Cliquez ici</Link>
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
        top: 100,
        width: '90%',
    },
    logo: {
        position: 'absolute',
        width: 100,
        height: 100,
        top: 100,
    },
    titleStyle: {
        textAlign: 'center',
        top: 200,
        position: 'absolute',
        fontSize: 48,
        color: 'white',
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
    button: {
        textAlign: 'center',
        marginTop: 20,
        paddingLeft: 120,
        paddingRight: 120,
        paddingTop: 15,
        paddingBottom: 15,
        color: "black",
        borderRadius: 10,
        backgroundColor: "#C6FF00",
        marginBottom: 15,
    },
    button_tres: {
        position: "absolute",
        textAlign: 'center',
        color: "white",
        bottom: 50,
    }
});