import React from 'react';
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet } from "react-native";
import { View, Image, Button } from "react-native";
import { Link } from 'expo-router';

export default function intro() {
    return (
        <ThemedView style={styles.mainContainer}>
            <Image
                style={styles.logo}
                source={{uri: "https://static.wikia.nocookie.net/the-doom-in-our-blood-comes-back/images/6/6f/House_Targaryen_Emblem.png/revision/latest?cb=20231201125707"}}
            />
            <View style={styles.but}>
                <Link style={styles.button} href="/login">Connexion</Link>
                <Link style={styles.button_bis} href="/signin">Inscription</Link>
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
    logo: {
        width: 300,
        height: 300,
        bottom: 100,
    },
    but: {
        position: 'absolute',
        bottom: 100,
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