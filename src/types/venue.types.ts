/**
 * Venue Types
 * Types for venues, specials, and deals
 */

export interface Venue {
  id: string;
  name: string;
  description: string;
  address: string;
  suburb: string;
  city: string;
  postcode: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  website?: string;
  imageUrl: string;
  images: string[];
  rating: number; // Out of 7 stars (as per screenshots)
  reviewCount: number;
  categories: VenueCategory[];
  specialsCount: number;
  distance?: number; // In kilometers
  isInsiderPick: boolean;
  isFavorite: boolean;
  operatingHours: OperatingHours;
  priceRange?: string; // '$', '$$', '$$$', '$$$$'
  createdAt: Date;
  updatedAt: Date;
}

export type VenueCategory =
  | 'Pub'
  | 'Bar'
  | 'Restaurant'
  | 'Brewery'
  | 'Club'
  | 'Cafe'
  | 'Wine Bar'
  | 'Cocktail Bar'
  | 'Whisky Bar'
  | 'Sports Bar'
  | 'Rooftop Bar'
  | 'Live Music'
  | 'Pizza'
  | 'Tapas'
  | 'Pool Tables'
  | 'Darts'
  | 'Trivia'
  | 'Beer Garden'
  | 'Arcade'
  | 'Thai'
  | 'Food'
  | 'Art';



export interface OperatingHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  open: string; // "17:00"
  close: string; // "22:00"
  isClosed: boolean;
}

export interface Special {
  id: string;
  venueId: string;
  venueName: string;
  title: string;
  description: string;
  type: SpecialType;
  price?: string; // e.g., "$7.50 schooners"
  availableDays: DayOfWeek[];
  startTime: string; // "17:00"
  endTime: string; // "19:00"
  imageUrl?: string;
  categories: string[];
  isActive: boolean;
  addedDate: Date;
  expiryDate?: Date;
}

export type SpecialType =
  | 'Happy Hour'
  | '2-for-1'
  | 'Bottomless'
  | 'Food Special'
  | 'Drink Special'
  | 'Event'
  | 'Trivia Night';

export type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export interface VenueFilters {
  what?: string[]; // Special types
  where?: string; // Location
  when?: string[]; // Days
  categories?: VenueCategory[];
  searchQuery?: string;
  sortBy?: 'distance' | 'rating' | 'name' | 'specials';
  priceRange?: [number, number];
  isInsiderPicksOnly?: boolean;
}

export interface AdvancedVenueFilters {
  sortBy?: 'distance' | 'rating' | 'specials';
  distance?: number; // In km
  minRating?: number; // 1-7
  openNow?: boolean;
  hasSpecials?: boolean;
  insiderPicksOnly?: boolean;
  amenities?: string[];
  priceRange?: string[]; // '$', '$$', '$$$', '$$$$'
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: AdvancedVenueFilters;
  createdAt: string;
  resultCount?: number;
}

export interface MapPin {
  id: string;
  venueId: string;
  latitude: number;
  longitude: number;
  specialsCount: number;
  isInsiderPick: boolean;
}

export interface VenueListItem {
  id: string;
  name: string;
  imageUrl: string;
  rating: number;
  latitude?: number;
  longitude?: number;
  distance?: number;

  specialsCount: number;
  address: string;
  suburb?: string;
  categories?: string[];
  priceRange?: string;
  isInsiderPick: boolean;
  isFavorite: boolean;
}

export type ViewMode = 'map' | 'list';

// Search filter options
export const WHAT_FILTER_OPTIONS = [
  { id: 'all', label: 'All Specials' },
  { id: 'insider', label: 'Insider Specials' },
  { id: 'venue', label: 'Specific venue' },
  { id: 'trivia', label: 'Trivia nights' },
  { id: 'events', label: 'Events' },
];

export const WHEN_FILTER_OPTIONS = [
  { id: 'now', label: 'On now' },
  { id: 'all', label: 'All days' },
  { id: 'monday', label: 'Monday' },
  { id: 'tuesday', label: 'Tuesday' },
  { id: 'wednesday', label: 'Wednesday' },
  { id: 'thursday', label: 'Thursday' },
  { id: 'friday', label: 'Friday' },
  { id: 'saturday', label: 'Saturday' },
  { id: 'sunday', label: 'Sunday' },
];

export const CATEGORY_QUICK_FILTERS = [
  { id: 'everything', label: 'Everything', icon: 'view-grid' },
  { id: 'on-now', label: 'On now', icon: 'clock' },
  { id: 'all-drinks', label: 'All Drinks', icon: 'glass-cocktail' },
  { id: 'all-food', label: 'All Food', icon: 'food' },
  { id: 'latest', label: 'Latest', icon: 'new-box' },
  { id: '2-for-1', label: '2 for 1', icon: 'numeric-2-box' },
  { id: 'bottomless', label: 'Bottomless', icon: 'glass-flute' },
  { id: 'pizza', label: 'Pizza', icon: 'pizza' },
  { id: 'burger', label: 'Burger', icon: 'hamburger' },
  { id: 'tacos', label: 'Tacos', icon: 'taco' },
];
