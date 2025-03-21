import React from 'react';
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet } from "react-native";
import { Image, View, Button, Text, TextInput } from "react-native";
import Constants from 'expo-constants';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';

const API_URL = Constants.expoConfig?.extra?.API_URL;

export default function login() {
    const [email, onChangeMail] = React.useState('');
    const [password, onChangePassword] = React.useState('');
    const router = useRouter();

    const login = async () => {
        try {
            const response = await fetch(API_URL+"/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    hashedPass: password,
                }),
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Token JWT :", data.token);
                router.push("/(tabs)/home");
            } else {
                console.log("Erreur", "Identifiants invalides");
            }
        } catch (error) {
            alert("Erreur de connexion :"+error);
            console.error("Erreur de connexion :", error);
        }
    };
    return (
        <ThemedView style={styles.mainContainer}>
            <Image
                style={styles.logo}
                source={{uri: "https://lh6.googleusercontent.com/proxy/vU5w1R8N9COetJHBUkqlPSdAAfvG_8S8YPdPQN7pKW3a7rHHuCvjikuMyxQuCSMMVxDMdaH_33GAsmcI2vi9yFmhk6k_VeOZjgfSB5Z_IzIHgpSfSoblffxL0xsa7TPeNqf13Bgr"}}
            />
            <Text style={styles.titleStyle}>Connexion</Text>
            <View style={styles.mainView}>
                <Text style={styles.textStyle}>Email</Text>
                <TextInput
                    style={[styles.input, { color: "white" }]}
                    onChangeText={onChangeMail}
                    value={email}
                />
                <Text style={styles.textStyle}>Mot de Passe</Text>
                <TextInput 
                    style={[styles.input, { color: "white" }]}
                    secureTextEntry
                    onChangeText={onChangePassword}
                    value={password}
                />
                <Button title="Se Connecter" onPress={login}/>
                <Link style={styles.button_bis} href="/signin">Pas encore de compte ? Cliquez ici</Link>
            </View>
            <Link style={styles.button_tres} href="/">Mot de passe oublié ? Cliquez ici</Link>
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
        top: 50,
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
        top: 250,
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
    button_bis: {
        textAlign: 'center',
        color: "white",
    },
    button_tres: {
        position: "absolute",
        textAlign: 'center',
        color: "white",
        bottom: 50,
    }
});