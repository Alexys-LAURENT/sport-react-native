import React, { useState, useRef, useMemo } from 'react';
import MapView, { MapStyleElement, Marker, Region } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { StyleSheet, View, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY!;

const waypoints = [
    { latitude: 48.88506238544102, longitude: 2.2937863020516205 },
    { latitude: 48.88538434872261, longitude: 2.2934576488620286 },
    { latitude: 48.88558121910085, longitude: 2.2919295900476784 },
    { latitude: 48.88409964630183, longitude: 2.2936645282387573 },
    { latitude: 48.883701541073485, longitude: 2.292893127443799 },
    { latitude: 48.88316299985647, longitude: 2.293500979104329 },
    { latitude: 48.88395356065056, longitude: 2.29500221168141 },
    { latitude: 48.88378804228189, longitude: 2.29543769512154 },
    { latitude: 48.88455774382171, longitude: 2.296793274496834 },
    { latitude: 48.88447222201324, longitude: 2.297063390013933 },
    { latitude: 48.88448537922407, longitude: 2.2976686487017948 },
    { latitude: 48.88455774382155, longitude: 2.2978737363563595 },
    { latitude: 48.88495245796466, longitude: 2.2981538560796673 },
    { latitude: 48.885156392384644, longitude: 2.2980888282867564 },
    { latitude: 48.88532414427568, longitude: 2.2984339758374284 },
    { latitude: 48.88521559900704, longitude: 2.3030209364595566 },
    { latitude: 48.88539321842041, longitude: 2.302955908666646 },
    { latitude: 48.8865181267346, longitude: 2.3014852800933028 },
    { latitude: 48.886597066717854, longitude: 2.3017603976786947 },
];

const darkMapStyle: MapStyleElement[] = [
    {
        elementType: "geometry",
        stylers: [{ color: "#212121" }]
    },
    {
        elementType: "labels.icon",
        stylers: [{ visibility: "off" }]
    },
    {
        elementType: "labels.text.fill",
        stylers: [{ color: "#757575" }]
    },
    {
        elementType: "labels.text.stroke",
        stylers: [{ color: "#212121" }]
    },
    {
        featureType: "administrative",
        elementType: "geometry",
        stylers: [{ color: "#757575" }]
    },
    {
        featureType: "administrative.country",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9e9e9e" }]
    },
    {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#bdbdbd" }]
    },
    {
        featureType: "poi",
        stylers: [{ visibility: "off" }]
    },
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#424242" }]
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9e9e9e" }]
    },
    {
        featureType: "road.arterial",
        elementType: "geometry",
        stylers: [{ color: "#373737" }]
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#3c3c3c" }]
    },
    {
        featureType: "road.highway.controlled_access",
        elementType: "geometry",
        stylers: [{ color: "#4e4e4e" }]
    },
    {
        featureType: "road.local",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9e9e9e" }]
    },
    {
        featureType: "transit",
        stylers: [{ visibility: "off" }]
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#000000" }]
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#3d3d3d" }]
    }
];

export function Map({ isRealTime, idTraining }: { isRealTime: boolean; idTraining: number }) {
    const [totalDistance, setTotalDistance] = useState(0);
    const mapRef = useRef<MapView>(null);
    const distancesRef = useRef<{ [key: number]: number }>({});

    // Calcul des limites de la carte et de la région optimale
    const mapSettings = useMemo(() => {
        const latitudes = waypoints.map(wp => wp.latitude);
        const longitudes = waypoints.map(wp => wp.longitude);

        const minLat = Math.min(...latitudes);
        const maxLat = Math.max(...latitudes);
        const minLng = Math.min(...longitudes);
        const maxLng = Math.max(...longitudes);

        // Centre de la carte
        const centerLat = (minLat + maxLat) / 2;
        const centerLng = (minLng + maxLng) / 2;

        // Calcul des deltas pour le zoom optimal
        const latDelta = (maxLat - minLat) * 1.2; // 20% de marge
        const lngDelta = (maxLng - minLng) * 1.2;

        // Ajustement du ratio en fonction de l'écran
        const { width, height } = Dimensions.get('window');
        const aspectRatio = width / height;

        const optimalRegion = {
            latitude: centerLat,
            longitude: centerLng,
            latitudeDelta: Math.max(latDelta, lngDelta / aspectRatio),
            longitudeDelta: Math.max(lngDelta, latDelta * aspectRatio),
        };

        return {
            optimalRegion,
            maxAllowedDelta: optimalRegion.latitudeDelta * 1, // zoom optimal
            center: { latitude: centerLat, longitude: centerLng },
            distanceThreshold: Math.max(maxLat - minLat, maxLng - minLng) * 1.5, // 150% de la taille du trajet
        };
    }, []);

    const handleRegionChange = (region: Region) => {
        const { optimalRegion, center, maxAllowedDelta, distanceThreshold } = mapSettings;

        // Calcul de la distance par rapport au centre
        const distanceFromCenter = Math.sqrt(
            Math.pow(region.latitude - center.latitude, 2) +
            Math.pow(region.longitude - center.longitude, 2)
        );

        // Vérifie uniquement le dezoom et la distance du centre
        if (region.latitudeDelta > maxAllowedDelta || distanceFromCenter > distanceThreshold) {
            mapRef.current?.animateToRegion(optimalRegion, 300);
        }
    };

    const handleDirectionsReady = (result: any, index: number) => {
        distancesRef.current[index] = result.distance;
        const total = Object.values(distancesRef.current).reduce((acc, curr) => acc + curr, 0);
        setTotalDistance(total);
    };

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                customMapStyle={darkMapStyle}
                initialRegion={mapSettings.optimalRegion}
                onRegionChangeComplete={handleRegionChange}
                showsUserLocation={isRealTime}
                followsUserLocation={isRealTime}
                showsMyLocationButton={isRealTime}
                showsCompass={true}
                showsScale={true}
                rotateEnabled={false}
            >
                <Marker
                    coordinate={waypoints[0]}
                    title="Départ"
                    image={require('@/assets/images/markerStart.png')}
                />

                <Marker
                    coordinate={waypoints[waypoints.length - 1]}
                    title="Arrivée"
                    image={require('@/assets/images/markerEnd.png')}
                />

                {waypoints.slice(0, -1).map((waypoint, index) => (
                    <MapViewDirections
                        key={index}
                        origin={waypoint}
                        destination={waypoints[index + 1]}
                        apikey={GOOGLE_MAPS_API_KEY}
                        strokeWidth={3}
                        strokeColor="#c6ff00"
                        mode="WALKING"
                        precision="high"
                        timePrecision="now"
                        onReady={(result) => handleDirectionsReady(result, index)}
                        onError={(error) => console.error('Directions Error:', error)}
                    />
                ))}
            </MapView>

            <View style={styles.distanceOverlay}>
                <ThemedText style={styles.distanceText}>
                    Distance totale: {totalDistance.toFixed(2)} km
                </ThemedText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    distanceOverlay: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 10,
        borderRadius: 8,
    },
    distanceText: {
        fontSize: 16,
        color: '#fff',
    },
});