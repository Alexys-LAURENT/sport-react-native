import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const formatTime = (milliseconds) => {
    if (!milliseconds) return '00:00:00';

    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes % 60).padStart(2, '0');
    const formattedSeconds = String(seconds % 60).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

const Timer = ({ startDate }) => {
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const start = new Date(startDate).getTime();
            setElapsedTime(now - start);
        }, 1000);

        return () => clearInterval(interval);
    }, [startDate]);

    return <Text style={styles.duration}>{formatTime(elapsedTime)}</Text>;
};

const TrainingItem = ({ training }) => {
    const { idTrainingType, startedDate, endedDate, duration, calories } = training;
    const status = endedDate ? 'completed' : 'in_progress';

    const getDuration = () => {
        if (!endedDate) return null;
        const start = new Date(startedDate).getTime();
        const end = new Date(endedDate).getTime();
        return formatTime(end - start);
    };

    return (
        <View style={[
            styles.container,
            status === 'in_progress' && styles.activeContainer
        ]}>
            <View style={styles.row}>
                <View style={styles.leftContent}>
                    <View style={styles.iconTextRow}>
                        <Text style={styles.icon}>{icon}</Text>
                        <Text style={styles.title}>{label}</Text>
                    </View>

                    <View style={styles.detailsRow}>
                        {status === 'in_progress' ? (
                            <Timer startDate={startedDate} />
                        ) : (
                            <Text style={styles.duration}>{getDuration()}</Text>
                        )}
                        <Text style={styles.date}>
                            {new Date(startedDate).toLocaleDateString()}
                        </Text>
                    </View>
                </View>

                <View style={styles.rightContent}>
                    {status === 'in_progress' ? (
                        <Text style={styles.statusText}>En cours</Text>
                    ) : (
                        <Text style={styles.calories}>{calories} Kcal</Text>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1C1C1E',
        borderRadius: 16,
        padding: 16,
        marginBottom: 8,
    },
    activeContainer: {
        backgroundColor: '#1C1C1E',
        borderWidth: 1,
        borderColor: '#4CAF50',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    leftContent: {
        flex: 1,
    },
    iconTextRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    icon: {
        fontSize: 16,
        marginRight: 8,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    duration: {
        color: '#8E8E93',
        fontSize: 14,
        marginRight: 8,
    },
    date: {
        color: '#8E8E93',
        fontSize: 14,
    },
    rightContent: {
        alignItems: 'flex-end',
    },
    statusText: {
        color: '#4CAF50',
        fontWeight: '600',
    },
    calories: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default TrainingItem;