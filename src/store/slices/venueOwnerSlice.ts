/**
 * Venue Owner Redux Slice
 * Manages state for venue owner dashboard and analytics
 */

import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
  VenueAnalytics,
  VenueInsight,
  CustomerDemographics,
  CompetitorAnalysis,
  SpecialPerformance,
} from '../../types/venueOwner.types';
import { VenueOwnerService } from '../../services/VenueOwnerService';

interface VenueOwnerState {
  // Current venue being managed
  currentVenueId: string | null;

  // Analytics
  analytics: VenueAnalytics | null;
  analyticsPeriod: 'today' | 'week' | 'month' | 'year';

  // Insights
  insights: VenueInsight[];

  // Demographics
  demographics: CustomerDemographics | null;

  // Competitors
  competitorAnalysis: CompetitorAnalysis | null;

  // Special Performance
  specialPerformance: SpecialPerformance[];

  // UI State
  loading: boolean;
  error: string | null;

  // Filters
  insightsFilter: 'all' | 'actionable' | 'peak_hours' | 'recommendation';
}

const initialState: VenueOwnerState = {
  currentVenueId: null,
  analytics: null,
  analyticsPeriod: 'week',
  insights: [],
  demographics: null,
  competitorAnalysis: null,
  specialPerformance: [],
  loading: false,
  error: null,
  insightsFilter: 'all',
};

// Async Thunks
export const fetchVenueAnalytics = createAsyncThunk(
  'venueOwner/fetchAnalytics',
  async ({ venueId, period }: { venueId: string; period: 'today' | 'week' | 'month' | 'year' }) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    return VenueOwnerService.getVenueAnalytics(venueId, period);
  }
);

export const fetchVenueInsights = createAsyncThunk(
  'venueOwner/fetchInsights',
  async (venueId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return VenueOwnerService.getVenueInsights(venueId);
  }
);

export const fetchCustomerDemographics = createAsyncThunk(
  'venueOwner/fetchDemographics',
  async (venueId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return VenueOwnerService.getCustomerDemographics(venueId);
  }
);

export const fetchCompetitorAnalysis = createAsyncThunk(
  'venueOwner/fetchCompetitors',
  async (venueId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return VenueOwnerService.getCompetitorAnalysis(venueId);
  }
);

export const fetchSpecialPerformance = createAsyncThunk(
  'venueOwner/fetchSpecialPerformance',
  async ({ venueId, period }: { venueId: string; period: string }) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return VenueOwnerService.getSpecialPerformance(venueId, period);
  }
);

const venueOwnerSlice = createSlice({
  name: 'venueOwner',
  initialState,
  reducers: {
    setCurrentVenue: (state, action: PayloadAction<string>) => {
      state.currentVenueId = action.payload;
    },

    setAnalyticsPeriod: (state, action: PayloadAction<'today' | 'week' | 'month' | 'year'>) => {
      state.analyticsPeriod = action.payload;
    },

    setInsightsFilter: (
      state,
      action: PayloadAction<'all' | 'actionable' | 'peak_hours' | 'recommendation'>
    ) => {
      state.insightsFilter = action.payload;
    },

    dismissInsight: (state, action: PayloadAction<string>) => {
      state.insights = state.insights.filter((insight) => insight.id !== action.payload);
    },

    clearError: (state) => {
      state.error = null;
    },

    resetVenueOwner: () => initialState,
  },

  extraReducers: (builder) => {
    // Fetch Analytics
    builder.addCase(fetchVenueAnalytics.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchVenueAnalytics.fulfilled, (state, action) => {
      state.loading = false;
      state.analytics = action.payload;
    });
    builder.addCase(fetchVenueAnalytics.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch analytics';
    });

    // Fetch Insights
    builder.addCase(fetchVenueInsights.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchVenueInsights.fulfilled, (state, action) => {
      state.loading = false;
      state.insights = action.payload;
    });
    builder.addCase(fetchVenueInsights.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch insights';
    });

    // Fetch Demographics
    builder.addCase(fetchCustomerDemographics.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchCustomerDemographics.fulfilled, (state, action) => {
      state.loading = false;
      state.demographics = action.payload;
    });
    builder.addCase(fetchCustomerDemographics.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch demographics';
    });

    // Fetch Competitor Analysis
    builder.addCase(fetchCompetitorAnalysis.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchCompetitorAnalysis.fulfilled, (state, action) => {
      state.loading = false;
      state.competitorAnalysis = action.payload;
    });
    builder.addCase(fetchCompetitorAnalysis.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch competitor analysis';
    });

    // Fetch Special Performance
    builder.addCase(fetchSpecialPerformance.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSpecialPerformance.fulfilled, (state, action) => {
      state.loading = false;
      state.specialPerformance = action.payload;
    });
    builder.addCase(fetchSpecialPerformance.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch special performance';
    });
  },
});

export const {
  setCurrentVenue,
  setAnalyticsPeriod,
  setInsightsFilter,
  dismissInsight,
  clearError,
  resetVenueOwner,
} = venueOwnerSlice.actions;

export default venueOwnerSlice.reducer;
