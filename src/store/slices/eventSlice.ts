import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Event, EventListItem, EventFilters, EventCategory } from '../../types/event.types';

interface EventState {
  events: EventListItem[];
  selectedEvent: Event | null;
  filters: EventFilters;
  isLoading: boolean;
  error: string | null;
  userEvents: string[]; // Event IDs user is going to
  userInterested: string[]; // Event IDs user is interested in
}

const initialState: EventState = {
  events: [],
  selectedEvent: null,
  filters: {
    categories: [],
  },
  isLoading: false,
  error: null,
  userEvents: [],
  userInterested: [],
};

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<EventListItem[]>) => {
      state.events = action.payload;
    },
    setSelectedEvent: (state, action: PayloadAction<Event | null>) => {
      state.selectedEvent = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<EventFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { categories: [] };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    // Attendance management
    markAsGoing: (state, action: PayloadAction<string>) => {
      const eventId = action.payload;
      if (!state.userEvents.includes(eventId)) {
        state.userEvents.push(eventId);
      }
      // Remove from interested if it was there
      state.userInterested = state.userInterested.filter(id => id !== eventId);

      // Update event in list
      const event = state.events.find(e => e.id === eventId);
      if (event) {
        if (event.userAttendanceStatus === 'interested') {
          event.interestedCount--;
        }
        event.goingCount++;
        event.userAttendanceStatus = 'going';
      }
    },
    markAsInterested: (state, action: PayloadAction<string>) => {
      const eventId = action.payload;
      if (!state.userInterested.includes(eventId)) {
        state.userInterested.push(eventId);
      }
      // Remove from going if it was there
      state.userEvents = state.userEvents.filter(id => id !== eventId);

      // Update event in list
      const event = state.events.find(e => e.id === eventId);
      if (event) {
        if (event.userAttendanceStatus === 'going') {
          event.goingCount--;
        }
        event.interestedCount++;
        event.userAttendanceStatus = 'interested';
      }
    },
    removeAttendance: (state, action: PayloadAction<string>) => {
      const eventId = action.payload;
      const wasGoing = state.userEvents.includes(eventId);
      const wasInterested = state.userInterested.includes(eventId);

      state.userEvents = state.userEvents.filter(id => id !== eventId);
      state.userInterested = state.userInterested.filter(id => id !== eventId);

      // Update event in list
      const event = state.events.find(e => e.id === eventId);
      if (event) {
        if (wasGoing) {
          event.goingCount--;
        }
        if (wasInterested) {
          event.interestedCount--;
        }
        event.userAttendanceStatus = null;
      }
    },
    // Add a new event (for organizers/admins)
    addEvent: (state, action: PayloadAction<EventListItem>) => {
      state.events.unshift(action.payload);
    },
    // Update an event
    updateEvent: (state, action: PayloadAction<EventListItem>) => {
      const index = state.events.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
    // Remove an event
    removeEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(e => e.id !== action.payload);
    },
  },
});

export const {
  setEvents,
  setSelectedEvent,
  setFilters,
  clearFilters,
  setLoading,
  setError,
  markAsGoing,
  markAsInterested,
  removeAttendance,
  addEvent,
  updateEvent,
  removeEvent,
} = eventSlice.actions;

export default eventSlice.reducer;
