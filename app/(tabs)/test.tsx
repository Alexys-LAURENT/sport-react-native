import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Map } from '@/components/map/Map';

export default function MapScreen() {
    return (
        <View style={styles.container}>
            <Map isRealTime={false} idTraining={1} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});