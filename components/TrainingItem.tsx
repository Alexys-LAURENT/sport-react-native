import { Training } from '@/types/entities';
import dayjs from 'dayjs';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


const TrainingItem = ({ training }: { training: Training }) => {

    const getDuration = (startedDate: string, endedDate: string) => {
        const started = dayjs(startedDate);
        const ended = dayjs(endedDate);
        const duration = ended.diff(started);
        const minutes = Math.floor(duration / 60000);
        const seconds = ((duration % 60000) / 1000).toFixed(0);
        return `${minutes} min ${seconds} sec`;
    }

    return (
        <Link
            href={{
                pathname: "/training/[id_training]",
                params: {
                    id_training: training.idTraining,
                    date: training.startedDate
                }
            }}
        >
            <View style={[styles.container, {
                borderColor: training.endedDate ? 'rgba(255, 255, 255, 0.1)' : '#C6FF00'
            }]}>
                <View style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <View>
                        <Text style={{ color: '#D9D9D9', fontSize: 20 }}>{training.icon} {training.label}</Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
                        <Text style={{ color: '#D9D9D9', fontSize: 13 }}>{dayjs(training.startedDate).format('DD/MM/YYYY')}</Text>
                        {
                            training.endedDate && <Text style={{ color: '#D9D9D9', fontSize: 13 }}>{getDuration(training.startedDate, training.endedDate)}</Text>
                        }
                    </View>
                </View>
                <View>
                    {
                        training.endedDate ? (
                            training.calories > 0 && <Text style={{ color: '#D9D9D9' }}>{training.calories} Kcal</Text>
                        ) : (
                            <Text style={{ color: '#C6FF00' }}>En cours</Text>
                        )
                    }
                </View>
            </View>
        </Link>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: 16,
        backgroundColor: '#1E2021',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
});

export default TrainingItem;
