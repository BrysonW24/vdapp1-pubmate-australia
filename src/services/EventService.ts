/**
 * Event Service
 * Service for fetching and filtering events
 */

import { Event, EventListItem, EventFilters, EventCategory } from '../types/event.types';

// Mock Events Data
export const MOCK_EVENTS: Event[] = [
    {
        id: 'e1',
        title: 'Pub Trivia Night',
        description: 'Gather your smartest friends for our weekly trivia night! Great prizes to be won, including a $50 venue voucher.',
        category: 'Trivia',
        imageUrl: 'https://images.unsplash.com/photo-1606131731446-5568d87113aa?auto=format&fit=crop&w=800&q=80',
        location: {
            venueId: '1',
            venueName: 'Bopp & Tone',
            address: '50 Carrington St, Sydney',
            coordinates: { latitude: -33.8658, longitude: 151.2063 }
        },
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        startTime: '19:00',
        endTime: '21:30',
        recurrence: 'weekly',
        priceType: 'free',
        attendees: [],
        goingCount: 24,
        interestedCount: 45,
        isFeatured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'e2',
        title: 'Live Acoustic Sessions',
        description: 'Enjoy live acoustic music from local artists every Friday night in our atrium.',
        category: 'Live Music',
        imageUrl: 'https://images.unsplash.com/photo-1514525253344-48cd93cc0794?auto=format&fit=crop&w=800&q=80',
        location: {
            venueId: '2',
            venueName: 'The Establishment',
            address: '252 George St, Sydney',
            coordinates: { latitude: -33.8638, longitude: 151.2083 }
        },
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        startTime: '18:00',
        endTime: '22:00',
        recurrence: 'weekly',
        priceType: 'free',
        attendees: [],
        goingCount: 86,
        interestedCount: 120,
        isFeatured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'e3',
        title: 'Rooftop DJ Sets',
        description: 'Sydney CBD\'s best rooftop party. House and disco all night long.',
        category: 'DJ Night',
        imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80',
        location: {
            venueId: '4',
            venueName: 'The Glenmore Hotel',
            address: '96 Cumberland St, The Rocks',
            coordinates: { latitude: -33.8598, longitude: 151.2063 }
        },
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        startTime: '21:00',
        endTime: '02:00',
        priceType: 'paid',
        price: 20,
        attendees: [],
        goingCount: 150,
        interestedCount: 300,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

class EventService {
    /**
     * Fetch events with optional filters
     */
    async getEvents(filters?: EventFilters): Promise<Event[]> {
        let filtered = [...MOCK_EVENTS];

        if (filters) {
            if (filters.categories && filters.categories.length > 0) {
                filtered = filtered.filter(e => filters.categories.includes(e.category));
            }
            if (filters.onlyFeatured) {
                filtered = filtered.filter(e => e.isFeatured);
            }
        }

        return filtered;
    }

    /**
     * Get event by ID
     */
    async getEventById(id: string): Promise<Event | null> {
        return MOCK_EVENTS.find(e => e.id === id) || null;
    }

    /**
     * Convert Events to List Items for UI
     */
    toEventListItems(events: Event[]): EventListItem[] {
        return events.map(e => ({
            id: e.id,
            title: e.title,
            category: e.category,
            imageUrl: e.imageUrl,
            venueId: e.location.venueId,
            venueName: e.location.venueName,
            startDate: e.startDate,
            startTime: e.startTime,
            endTime: e.endTime,
            goingCount: e.goingCount,
            interestedCount: e.interestedCount,
            price: e.price,
            priceType: e.priceType,
            recurrence: e.recurrence,
            isPromoted: e.isPromoted,
            isFeatured: e.isFeatured
        }));
    }
}

export default new EventService();
