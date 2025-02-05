import { ThemedView } from "@/components/ThemedView";
import { StyleSheet } from "react-native";


export default function ProfileScreen() {
  return (
        <ThemedView style={styles.mainContainer}>
        </ThemedView>
        );
    }
    
    
    const styles = StyleSheet.create({
        mainContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 32,
        },
    });