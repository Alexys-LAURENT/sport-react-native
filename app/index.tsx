import { ThemedView } from "@/components/ThemedView";
import { Link } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, View } from "react-native";

export default function intro() {
    return (
        <ThemedView style={styles.mainContainer}>
            <View style={{display:'flex', flexDirection:'column', height: '70%', justifyContent: 'center', alignItems: 'center', gap: 16}}>
           <Image
                style={styles.logo}
                source={ require('@/assets/images/splash-icon.png') } // Remplacez par le chemin vers votre image
            />
            <Text style={styles.titleStyle}>FitTrack</Text>
            </View>
            <View style={{display:'flex', flexDirection:'column', height: '30%', justifyContent: 'center', alignItems: 'center'}}>
                <Link style={styles.button} href="/login">Connexion</Link>
                <Link style={styles.button_bis} href="/signup">Inscription</Link>
            </View>
        </ThemedView>
    );
}
  
const styles = StyleSheet.create({
    titleStyle: {
        fontSize: 24,
        color: 'white',
    },
    mainContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    logo: {
        width: 125,
        height: 125,
    },
    button: {
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
        paddingLeft: 120,
        paddingRight: 120,
        paddingTop: 15,
        paddingBottom: 15,
        color: "#C6FF00",
        borderRadius: 10,
        borderColor: "#C6FF00",
        borderWidth: 0.2,
    }
});