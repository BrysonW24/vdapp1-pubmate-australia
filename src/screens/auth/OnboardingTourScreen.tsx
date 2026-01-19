import React, { useRef, useState } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    Image,
} from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthStackParamList } from '../../navigation/types';
import { pubmateColors } from '../../theme';
import { useAppDispatch } from '../../store';
import { setOnboardingStep } from '../../store/slices/authSlice';

const { width, height } = Dimensions.get('window');

type OnboardingTourScreenNavigationProp = NativeStackNavigationProp<
    AuthStackParamList,
    'OnboardingTour'
>;

interface TourSlide {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
}

const slides: TourSlide[] = [
    {
        id: '1',
        title: 'Find Australia\'s Best Pubs',
        description: 'Discover the top-rated pubs, bars, and breweries near you with our interactive map and curated lists.',
        icon: 'map-search-outline',
        color: '#1A0A3E',
    },
    {
        id: '2',
        title: 'Exclusive Deals & Specials',
        description: 'Never miss a happy hour again. Get real-time alerts for specials and exclusive offers at your favorite venues.',
        icon: 'ticket-percent-outline',
        color: '#FFA500',
    },
    {
        id: '3',
        title: 'Earn Rewards as You Sip',
        description: 'Pay securely through the app and earn loyalty points on every round. Redeem points for free drinks and meals.',
        icon: 'gift-outline',
        color: '#2D1B69',
    },
    {
        id: '4',
        title: 'Personalized Just For You',
        description: 'Tell us what you like and we\'ll serve up recommendations tailored to your taste and vibe.',
        icon: 'star-face',
        color: '#FFB700',
    },
];

export default function OnboardingTourScreen() {
    const navigation = useNavigation<OnboardingTourScreenNavigationProp>();
    const dispatch = useAppDispatch();
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            flatListRef.current?.scrollToIndex({
                index: currentIndex + 1,
                animated: true,
            });
        } else {
            handleFinish();
        }
    };

    const handleFinish = () => {
        dispatch(setOnboardingStep('complete'));
        // Usually here we would navigate to the Main app flow
        // Managed by RootNavigator's isAuthenticated/onboardingStep logic
    };

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const renderSlide = ({ item }: { item: TourSlide }) => (
        <View style={styles.slide}>
            <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                <Icon name={item.icon} size={120} color="#FFF" />
            </View>
            <View style={styles.textContainer}>
                <Text variant="headlineMedium" style={styles.title}>
                    {item.title}
                </Text>
                <Text variant="bodyLarge" style={styles.description}>
                    {item.description}
                </Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.skipButton} onPress={handleFinish}>
                <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            <FlatList
                ref={flatListRef}
                data={slides}
                renderItem={renderSlide}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
                keyExtractor={(item) => item.id}
            />

            <View style={styles.footer}>
                <View style={styles.pagination}>
                    {slides.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                currentIndex === index ? styles.activeDot : styles.inactiveDot,
                            ]}
                        />
                    ))}
                </View>

                <Button
                    mode="contained"
                    onPress={handleNext}
                    style={styles.nextButton}
                    contentStyle={styles.nextButtonContent}
                    labelStyle={styles.nextButtonLabel}
                >
                    {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
                </Button>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    skipButton: {
        position: 'absolute',
        top: 50,
        right: 24,
        zIndex: 10,
    },
    skipText: {
        color: '#999',
        fontSize: 16,
        fontWeight: '600',
    },
    slide: {
        width,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    iconContainer: {
        width: 220,
        height: 220,
        borderRadius: 110,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 60,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
    },
    textContainer: {
        alignItems: 'center',
    },
    title: {
        textAlign: 'center',
        fontWeight: '900',
        color: pubmateColors.charcoal,
        marginBottom: 20,
    },
    description: {
        textAlign: 'center',
        color: '#666',
        lineHeight: 26,
    },
    footer: {
        padding: 40,
        alignItems: 'center',
    },
    pagination: {
        flexDirection: 'row',
        marginBottom: 30,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: pubmateColors.orange,
        width: 25,
    },
    inactiveDot: {
        backgroundColor: '#EEE',
    },
    nextButton: {
        width: '100%',
        backgroundColor: pubmateColors.orange,
        borderRadius: 12,
    },
    nextButtonContent: {
        height: 56,
    },
    nextButtonLabel: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});
