import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Text, Button, IconButton, Surface, Divider, Avatar } from 'react-native-paper';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { useAppSelector, useAppDispatch } from '../store';
import { markAsGoing, markAsInterested, removeAttendance } from '../store/slices/eventSlice';
import EventService from '../services/EventService';
import { Event } from '../types/event.types';
import { pubmateColors } from '../theme';

const { width } = Dimensions.get('window');

type EventDetailRouteProp = RouteProp<RootStackParamList, 'EventDetail'>;

export default function EventDetailScreen() {
    const route = useRoute<EventDetailRouteProp>();
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const { id } = route.params;

    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);

    const { userEvents, userInterested } = useAppSelector((state) => state.event);

    const isGoing = userEvents.includes(id);
    const isInterested = userInterested.includes(id);

    useEffect(() => {
        const loadEvent = async () => {
            setLoading(true);
            const fetchedEvent = await EventService.getEventById(id);
            setEvent(fetchedEvent);
            setLoading(false);
        };
        loadEvent();
    }, [id]);

    if (loading || !event) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading event details...</Text>
            </View>
        );
    }

    const handleGoing = () => {
        if (isGoing) {
            dispatch(removeAttendance(id));
        } else {
            dispatch(markAsGoing(id));
        }
    };

    const handleInterested = () => {
        if (isInterested) {
            dispatch(removeAttendance(id));
        } else {
            dispatch(markAsInterested(id));
        }
    };

    const handleVenuePress = () => {
        navigation.navigate('Details', {
            id: event.location.venueId,
            title: event.location.venueName,
            description: event.location.address,
        });
    };

    return (
        <ScrollView style={styles.container} bounces={false}>
            {/* Hero Section */}
            <View style={styles.heroContainer}>
                <Image source={{ uri: event.imageUrl }} style={styles.heroImage} />
                <Surface style={styles.categoryBadge} elevation={2}>
                    <Text style={styles.categoryText}>{event.category}</Text>
                </Surface>
                <IconButton
                    icon="close"
                    containerColor="rgba(0,0,0,0.3)"
                    iconColor="white"
                    size={24}
                    style={styles.closeButton}
                    onPress={() => navigation.goBack()}
                />
            </View>

            <View style={styles.content}>
                <Text variant="headlineMedium" style={styles.title}>{event.title}</Text>

                <TouchableOpacity onPress={handleVenuePress} style={styles.venueRow}>
                    <View style={styles.venueIconContainer}>
                        <IconButton icon="store" iconColor={pubmateColors.orange} size={24} />
                    </View>
                    <View>
                        <Text variant="titleMedium" style={styles.venueName}>{event.location.venueName}</Text>
                        <Text variant="bodySmall" style={styles.venueAddress}>{event.location.address}</Text>
                    </View>
                    <IconButton icon="chevron-right" style={styles.chevron} />
                </TouchableOpacity>

                <Divider style={styles.divider} />

                {/* Date & Time */}
                <View style={styles.infoRow}>
                    <IconButton icon="calendar" iconColor="#666" size={20} />
                    <View style={styles.infoTextContainer}>
                        <Text variant="bodyLarge">{new Date(event.startDate).toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
                        <Text variant="bodySmall" style={styles.infoSubtitle}>{event.startTime} - {event.endTime || 'Late'}</Text>
                    </View>
                </View>

                {/* Price */}
                <View style={styles.infoRow}>
                    <IconButton icon="ticket" iconColor="#666" size={20} />
                    <View style={styles.infoTextContainer}>
                        <Text variant="bodyLarge">
                            {event.priceType === 'free' ? 'Free Entry' : event.price ? `$${event.price}` : 'Entry Fee Applies'}
                        </Text>
                        {event.priceDescription && <Text variant="bodySmall" style={styles.infoSubtitle}>{event.priceDescription}</Text>}
                    </View>
                </View>

                <Divider style={styles.divider} />

                {/* Description */}
                <View style={styles.section}>
                    <Text variant="titleLarge" style={styles.sectionTitle}>About this event</Text>
                    <Text variant="bodyMedium" style={styles.description}>{event.description}</Text>
                </View>

                {/* Attendance */}
                <View style={styles.attendanceSection}>
                    <Text variant="titleMedium" style={styles.attendanceTitle}>
                        {event.goingCount} people going • {event.interestedCount} interested
                    </Text>
                    <View style={styles.attendanceButtons}>
                        <Button
                            mode={isGoing ? "contained" : "outlined"}
                            onPress={handleGoing}
                            style={[styles.attBtn, isGoing && styles.goingBtnActive]}
                            icon={isGoing ? "check" : "calendar-plus"}
                        >
                            {isGoing ? "I'm Going" : "Go"}
                        </Button>
                        <Button
                            mode={isInterested ? "contained" : "outlined"}
                            onPress={handleInterested}
                            style={[styles.attBtn, isInterested && styles.interestedBtnActive]}
                            icon={isInterested ? "heart" : "heart-outline"}
                        >
                            Interested
                        </Button>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroContainer: {
        width: '100%',
        height: 300,
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    categoryBadge: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        backgroundColor: pubmateColors.orange,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    categoryText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },
    closeButton: {
        position: 'absolute',
        top: 48,
        right: 16,
    },
    content: {
        padding: 20,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 20,
        color: pubmateColors.charcoal,
    },
    venueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    venueIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFF0E6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    venueName: {
        fontWeight: 'bold',
    },
    venueAddress: {
        color: '#666',
    },
    chevron: {
        marginLeft: 'auto',
    },
    divider: {
        marginVertical: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    infoTextContainer: {
        marginLeft: 8,
    },
    infoSubtitle: {
        color: '#666',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 8,
    },
    description: {
        lineHeight: 24,
        color: '#333',
    },
    attendanceSection: {
        backgroundColor: '#F9F9F9',
        padding: 20,
        borderRadius: 12,
        marginTop: 10,
    },
    attendanceTitle: {
        textAlign: 'center',
        marginBottom: 16,
        color: '#666',
    },
    attendanceButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    attBtn: {
        flex: 1,
        borderRadius: 8,
    },
    goingBtnActive: {
        backgroundColor: '#4CAF50',
    },
    interestedBtnActive: {
        backgroundColor: pubmateColors.orange,
    },
});
