import CustomButton from "@/components/CustomButton";
import CustomTextInput from "@/components/CustomTextInput";
import { ThemedView } from "@/components/ThemedView";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View
} from "react-native";
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
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ThemedView style={styles.mainContainer}>
                    <ScrollView 
                        contentContainerStyle={styles.scrollContainer}
                        keyboardShouldPersistTaps="handled"
                    >
                        <Image
                            style={styles.logo}
                            source={ require('@/assets/images/icon.png') } // Remplacez par le chemin vers votre image
                        />
                        <Text style={styles.titleStyle}>Connexion</Text>
                        
                        <View style={styles.formContainer}>
                            <CustomTextInput 
                            label="Email" 
                            value={email} 
                            onChangeText={setEmail} 
                            keyboardType="email-address"
                            placeholder="Entrez votre email"
                            />
                            <CustomTextInput 
                            label="Mot de Passe" 
                            value={password} 
                            onChangeText={setPassword} 
                            bottomLink={{text: "Mot de passe oublié ? Cliquez ici", url: "/"}} 
                            isPassword={true}
                            placeholder="Entrez votre mot de passe"
                            />
                            <CustomButton title="Se connecter" onPress={handleLogin} />
                            <Link style={styles.linkText} href="/signup">
                                Pas encore de compte ? Cliquez ici
                            </Link>
                        </View>
                    </ScrollView>
                </ThemedView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    titleStyle: {
        fontSize: 36,
        color: 'white',
        marginBottom: 30,
    },
    formContainer: {
        width: '85%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
    },
    linkText: {
        textAlign: 'center',
        color: "white",
    }
});