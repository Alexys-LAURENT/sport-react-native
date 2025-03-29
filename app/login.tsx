import { ThemedView } from "@/components/ThemedView";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, Image, StyleSheet, Text, TextInput, View } from "react-native";

const API_URL = Constants.expoConfig?.extra?.API_URL;

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        // Basic input validation
        if (!email || !password) {
            Alert.alert('Erreur', 'Veuillez saisir votre email et mot de passe');
            return;
        }

        try {
            const response = await fetch(`${API_URL}login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    hashedPass: password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Login successful:', data);
                // Store the JWT token securely
                await AsyncStorage.setItem('userToken', data.token);
            
                // Store user info in AsyncStorage
                await AsyncStorage.setItem('userId', data.idUser.toString());
                await AsyncStorage.setItem('userEmail', data.email);
                await AsyncStorage.setItem('userFirstName', data.firstName);
                await AsyncStorage.setItem('userLastName', data.lastName);
                await AsyncStorage.setItem('userGender', data.gender);
            
                // Navigate to home screen
                router.push("/(tabs)/home");
            } else {
                // Handle login failure
                Alert.alert('Erreur', data.error || 'Identifiants invalides');
            }
        } catch (error) {
            console.error('Login error:', error);
            Alert.alert('Erreur de connexion', 'Impossible de se connecter. Vérifiez votre connexion.');
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
                    onChangeText={setEmail}
                    value={email}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <Text style={styles.textStyle}>Mot de Passe</Text>
                <TextInput 
                    style={[styles.input, { color: "white" }]}
                    secureTextEntry
                    onChangeText={setPassword}
                    value={password}
                />
                <Button title="Se Connecter" onPress={handleLogin}/>
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