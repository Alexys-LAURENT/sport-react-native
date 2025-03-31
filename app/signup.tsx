import CustomButton from "@/components/CustomButton";
import CustomTextInput from "@/components/CustomTextInput";
import { ThemedView } from "@/components/ThemedView";
import Constants from 'expo-constants';
import { Link, Stack, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";

const API_URL = Constants.expoConfig?.extra?.API_URL;

export default function Signup() {
    const [prenom, setPrenom] = useState('');
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [sexe, setSexe] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const scrollViewRef = useRef(null);
    
    const handleSignUp = async () => {
        // Validation de base
        if (!prenom || !nom || !email || !sexe || !password) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs');
            return;
        }

        try {
            const response = await fetch(`${API_URL}inscription`, {
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
                router.push("/login");
            } else {
                Alert.alert("Erreur", "Identifiants déjà utilisés");
                console.error("Erreur", "Identifiants déjà utilisés");
            }
        } catch (error) {
            console.error("Erreur d'inscription :", error);
            Alert.alert("Erreur de connexion", "Impossible de s'inscrire. Vérifiez votre connexion.");
        }
    };

    return (
        <>
        {/* Cette ligne désactive l'en-tête pour cette page spécifique */}
        <Stack.Screen options={{ headerShown: false }} />
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
        >
            <ThemedView style={styles.mainContainer}>
                <ScrollView 
                    ref={scrollViewRef}
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={true}
                >
                    <View style={styles.contentWrapper}>
                        <Image
                            style={styles.logo}
                            source={require('@/assets/images/icon.png')}
                        />
                        <Text style={styles.titleStyle}>Inscription</Text>
                        
                        <View style={styles.formContainer}>
                            <CustomTextInput 
                                label="Prénom" 
                                value={prenom} 
                                onChangeText={setPrenom}
                                placeholder="Entrez votre prénom"
                            
                            />
                            <CustomTextInput 
                                label="Nom" 
                                value={nom} 
                                onChangeText={setNom} 
                                placeholder="Entrez votre nom"
                            />
                            <CustomTextInput 
                                label="Adresse Email" 
                                value={email} 
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholder="Entrez votre email"
                            />
                            <CustomTextInput 
                                label="Sexe" 
                                value={sexe} 
                                onChangeText={setSexe} 
                                placeholder="Entrez votre sexe (M/F)"
                            />
                            <CustomTextInput 
                                label="Mot de Passe" 
                                value={password} 
                                onChangeText={setPassword}
                                isPassword={true}
                                placeholder="Entrez votre mot de passe"
                            />
                            
                            <View style={styles.buttonContainer}>
                                <CustomButton 
                                    title="S'inscrire" 
                                    onPress={handleSignUp} 
                                />
                                
                                <Link style={styles.linkText} href="/login">
                                    Vous avez déjà un compte ? Cliquez ici
                                </Link>
                            </View>
                        
                        </View>
                    </View>
                </ScrollView>
            </ThemedView>
        </KeyboardAvoidingView>
        </>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingVertical: 20,
    },
    contentWrapper: {
        alignItems: 'center',
        paddingBottom: 120, // Espace supplémentaire en bas pour le défilement
    },
    logo: {
        width: 100,
        height: 100,
        marginVertical: 20,
    },
    titleStyle: {
        fontSize: 36,
        color: 'white',
        marginBottom: 30,
    },
    formContainer: {
        width: '85%',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },
    linkText: {
        textAlign: 'center',
        color: "white",
        marginTop: 15,
        marginBottom: 10,
    }
});