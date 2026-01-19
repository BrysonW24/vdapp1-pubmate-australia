/**
 * Venue Slice
 * Redux state management for venues, specials, and search
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Venue, Special, VenueFilters, AdvancedVenueFilters, SavedSearch, ViewMode, MapPin } from '../../types/venue.types';

interface VenueState {
  venues: Venue[];
  specials: Special[];
  selectedVenue: Venue | null;
  favorites: string[]; // Venue IDs
  filters: VenueFilters;
  advancedFilters: AdvancedVenueFilters;
  savedSearches: SavedSearch[];
  viewMode: ViewMode;
  isLoading: boolean;
  error: string | null;
  searchResults: string[]; // Venue IDs
  mapCenter: {
    latitude: number;
    longitude: number;
  };
  userLocation: {
    latitude: number;
    longitude: number;
  } | null;
}

const initialState: VenueState = {
  venues: [],
  specials: [],
  selectedVenue: null,
  favorites: [],
  filters: {},
  advancedFilters: {
    sortBy: 'distance',
    distance: 5,
    minRating: 1,
    openNow: false,
    hasSpecials: false,
    insiderPicksOnly: false,
    amenities: [],
    priceRange: [],
  },
  savedSearches: [],
  viewMode: 'map',
  isLoading: false,
  error: null,
  searchResults: [],
  mapCenter: {
    latitude: -33.8688, // Sydney
    longitude: 151.2093,
  },
  userLocation: null,
};

// Async thunks
export const fetchVenues = createAsyncThunk(
  'venue/fetchVenues',
  async (filters: VenueFilters | undefined, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/venues?' + new URLSearchParams(filters));
      // const data = await response.json();
      // return data;

      // Mock data for now
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchVenueById = createAsyncThunk(
  'venue/fetchVenueById',
  async (venueId: string, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSpecials = createAsyncThunk(
  'venue/fetchSpecials',
  async (filters: VenueFilters | undefined, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleFavorite = createAsyncThunk(
  'venue/toggleFavorite',
  async (venueId: string, { rejectWithValue, getState }) => {
    try {
      // TODO: Save to backend
      return venueId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const venueSlice = createSlice({
  name: 'venue',
  initialState,
  reducers: {
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload;
    },
    setFilters: (state, action: PayloadAction<VenueFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setMapCenter: (state, action: PayloadAction<{ latitude: number; longitude: number }>) => {
      state.mapCenter = action.payload;
    },
    setUserLocation: (state, action: PayloadAction<{ latitude: number; longitude: number }>) => {
      state.userLocation = action.payload;
    },
    setSelectedVenue: (state, action: PayloadAction<Venue | null>) => {
      state.selectedVenue = action.payload;
    },
    addFavorite: (state, action: PayloadAction<string>) => {
      if (!state.favorites.includes(action.payload)) {
        state.favorites.push(action.payload);
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter((id) => id !== action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
    setAdvancedFilters: (state, action: PayloadAction<AdvancedVenueFilters>) => {
      state.advancedFilters = { ...state.advancedFilters, ...action.payload };
    },
    clearAdvancedFilters: (state) => {
      state.advancedFilters = initialState.advancedFilters;
    },
    saveSearch: (state, action: PayloadAction<{ name: string; filters: AdvancedVenueFilters; resultCount?: number }>) => {
      const newSearch: SavedSearch = {
        id: `search_${Date.now()}`,
        name: action.payload.name,
        filters: action.payload.filters,
        createdAt: new Date().toISOString(),
        resultCount: action.payload.resultCount,
      };
      state.savedSearches.unshift(newSearch);
    },
    deleteSavedSearch: (state, action: PayloadAction<string>) => {
      state.savedSearches = state.savedSearches.filter((search) => search.id !== action.payload);
    },
    loadSavedSearch: (state, action: PayloadAction<string>) => {
      const search = state.savedSearches.find((s) => s.id === action.payload);
      if (search) {
        state.advancedFilters = search.filters;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch venues
    builder
      .addCase(fetchVenues.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVenues.fulfilled, (state, action) => {
        state.isLoading = false;
        state.venues = action.payload;
        state.searchResults = action.payload.map((v: Venue) => v.id);
      })
      .addCase(fetchVenues.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch venue by ID
    builder
      .addCase(fetchVenueById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVenueById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedVenue = action.payload;
      })
      .addCase(fetchVenueById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch specials
    builder
      .addCase(fetchSpecials.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSpecials.fulfilled, (state, action) => {
        state.isLoading = false;
        state.specials = action.payload;
      })
      .addCase(fetchSpecials.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Toggle favorite
    builder
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const venueId = action.payload;
        if (state.favorites.includes(venueId)) {
          state.favorites = state.favorites.filter((id) => id !== venueId);
        } else {
          state.favorites.push(venueId);
        }
      });
  },
});

export const {
  setViewMode,
  setFilters,
  clearFilters,
  setMapCenter,
  setUserLocation,
  setSelectedVenue,
  addFavorite,
  removeFavorite,
  clearError,
  setAdvancedFilters,
  clearAdvancedFilters,
  saveSearch,
  deleteSavedSearch,
  loadSavedSearch,
} = venueSlice.actions;

export default venueSlice.reducer;
