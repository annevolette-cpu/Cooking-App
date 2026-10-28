export enum ThemeMode {
  Nordic = 'nordic',
  Calm = 'calm',
}

export enum UnitSystem {
  Metric = 'metric',
  Imperial = 'imperial',
}

export enum ActiveScreen {
  Discover = 'discover',
  Seasonal = 'seasonal',
  RecipeDetail = 'recipe_detail',
  CookMode = 'cook_mode',
  SavedBox = 'saved_box',
}

export interface Ingredient {
  id: string;
  name: string;
  note?: string;
  metricAmount: number;
  metricUnit: string;
  imperialAmount: number;
  imperialUnit: string;
  aisle: string;
}

export interface RecipeStep {
  stepNumber: number;
  title: string;
  instruction: string;
  sensoryCue: string;
  timerSeconds?: number;
  timerLabel?: string;
}

export interface CommunityNote {
  id: string;
  authorName: string;
  authorRole: string;
  location: string;
  dateLabel: string;
  comment: string;
}

export interface Recipe {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  season: string;
  prepMinutes: number;
  cookMinutes: number;
  difficulty: 'Gentle' | 'Moderate' | 'Attentive';
  dietaryLabel: string;
  baseServings: number;
  rating: number;
  notesCount: number;
  authorName: string;
  authorLocation: string;
  imageUrl: string;
  imageAlt: string;
  featured?: boolean;
  nutrition: {
    calories: number;
    proteinGrams: number;
    fiberGrams: number;
    carbsGrams: number;
  };
  ingredients: Ingredient[];
  steps: RecipeStep[];
  communityNotes: CommunityNote[];
}

export interface PantryItem {
  id: string;
  name: string;
  quantityText: string;
  recipeTitle: string;
  aisle: string;
  checked: boolean;
}

export interface ActiveTimer {
  recipeId: string;
  recipeTitle: string;
  stepNumber: number;
  label: string;
  totalSeconds: number;
  remainingSeconds: number;
  running: boolean;
  completed: boolean;
}
