import React, { useEffect, useMemo, useState } from 'react';
import {
  Bookmark,
  Search,
  ArrowRight,
  UtensilsCrossed,
} from 'lucide-react';
import { INITIAL_RECIPES } from './data/recipes';
import {
  ActiveScreen,
  ActiveTimer,
  PantryItem,
  Recipe,
  ThemeMode,
  UnitSystem,
} from './types';
import { RecipeImage } from './components/RecipeImage';
import { FloatingCookBar } from './components/FloatingCookBar';
import { RecipeDetailView } from './components/RecipeDetailView';
import { CookModeView } from './components/CookModeView';
import { SavedPantryView } from './components/SavedPantryView';
import { ShareRecipeModal } from './components/ShareRecipeModal';
import {
  formatScaledAmount,
  playKitchenChime,
  speakInstructionText,
  stopSpeaking,
} from './utils/formatters';

const STORAGE_KEYS = {
  theme: 'kokken_theme_v1',
  recipes: 'kokken_recipes_v1',
  saved: 'kokken_saved_v1',
  pantry: 'kokken_pantry_v1',
  checked: 'kokken_checked_ing_v1',
};

const COURSE_FILTERS = ['All', 'Morning', 'Midday', 'Supper', 'Baking'] as const;

export default function App() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.theme);
    return saved === ThemeMode.Calm ? ThemeMode.Calm : ThemeMode.Nordic;
  });

  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.recipes);
      if (raw) {
        const parsed = JSON.parse(raw) as Recipe[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback to initial recipes
    }
    return INITIAL_RECIPES;
  });

  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.saved);
      if (raw) return JSON.parse(raw) as string[];
    } catch {
      // Default saved
    }
    return ['kardemummabullar-morning-knots', 'chamomile-poached-pears-oat-porridge'];
  });

  const [pantryItems, setPantryItems] = useState<PantryItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.pantry);
      if (raw) return JSON.parse(raw) as PantryItem[];
    } catch {
      // Default pantry items
    }
    return [
      {
        id: 'pantry-seed-1',
        name: 'Green cardamom pods, whole',
        quantityText: '14 g',
        recipeTitle: 'Spelt & Green Cardamom Morning Knots',
        aisle: 'Spices',
        checked: false,
      },
      {
        id: 'pantry-seed-2',
        name: 'Dried whole chamomile blossoms',
        quantityText: '8 g',
        recipeTitle: 'Chamomile-Poached Pears & Steel-Cut Oats',
        aisle: 'Spices',
        checked: false,
      },
      {
        id: 'pantry-seed-3',
        name: 'Slender young leeks',
        quantityText: '4 stalks',
        recipeTitle: 'Charred Leeks over Creamy Heirloom Beans',
        aisle: 'Produce',
        checked: true,
      },
    ];
  });

  const [checkedIngredients, setCheckedIngredients] = useState<
    Record<string, boolean>
  >(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.checked);
      if (raw) return JSON.parse(raw) as Record<string, boolean>;
    } catch {
      // Empty
    }
    return {};
  });

  const [activeScreen, setActiveScreen] = useState<ActiveScreen>(
    ActiveScreen.Discover
  );
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(
    INITIAL_RECIPES[0].id
  );
  const [servingsByRecipe, setServingsByRecipe] = useState<
    Record<string, number>
  >({});
  const [stepByRecipe, setStepByRecipe] = useState<Record<string, number>>({});
  const [unitSystem, setUnitSystem] = useState<UnitSystem>(UnitSystem.Metric);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCourse, setActiveCourse] = useState<string>('All');
  const [seasonalFilter, setSeasonalFilter] = useState<string>('Autumn & Winter');

  const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [pantryFeedback, setPantryFeedback] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Sync theme attribute on documentElement
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
    localStorage.setItem(STORAGE_KEYS.theme, themeMode);
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.recipes, JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.saved, JSON.stringify(savedIds));
  }, [savedIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.pantry, JSON.stringify(pantryItems));
  }, [pantryItems]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.checked,
      JSON.stringify(checkedIngredients)
    );
  }, [checkedIngredients]);

  // Persistent Kitchen Timer Interval
  useEffect(() => {
    if (!activeTimer || !activeTimer.running) return;
    const interval = window.setInterval(() => {
      setActiveTimer((prev) => {
        if (!prev || !prev.running) return prev;
        if (prev.remainingSeconds <= 1) {
          playKitchenChime();
          return {
            ...prev,
            remainingSeconds: 0,
            running: false,
            completed: true,
          };
        }
        return {
          ...prev,
          remainingSeconds: prev.remainingSeconds - 1,
        };
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [activeTimer]);

  const activeRecipe = useMemo(
    () => recipes.find((r) => r.id === selectedRecipeId) || recipes[0],
    [recipes, selectedRecipeId]
  );

  const featuredRecipe = useMemo(
    () => recipes.find((r) => r.featured) || recipes[0],
    [recipes]
  );

  const filteredRecipes = useMemo(() => {
    return recipes.filter((r) => {
      const matchesCourse =
        activeCourse === 'All' || r.category === activeCourse;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.subtitle.toLowerCase().includes(q) ||
        r.dietaryLabel.toLowerCase().includes(q) ||
        r.ingredients.some((i) => i.name.toLowerCase().includes(q));
      return matchesCourse && matchesQuery;
    });
  }, [recipes, activeCourse, searchQuery]);

  const seasonalRecipes = useMemo(() => {
    return recipes.filter(
      (r) => r.season === seasonalFilter || r.season === 'All Seasons'
    );
  }, [recipes, seasonalFilter]);

  const savedRecipes = useMemo(
    () => recipes.filter((r) => savedIds.includes(r.id)),
    [recipes, savedIds]
  );

  const currentServings =
    servingsByRecipe[activeRecipe.id] ?? activeRecipe.baseServings;
  const currentStepIndex = stepByRecipe[activeRecipe.id] ?? 0;

  const openRecipeDetail = (recipeId: string) => {
    setSelectedRecipeId(recipeId);
    setActiveScreen(ActiveScreen.RecipeDetail);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openCookModeForRecipe = (recipeId: string) => {
    setSelectedRecipeId(recipeId);
    setActiveScreen(ActiveScreen.CookMode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSave = (recipeId: string) => {
    setSavedIds((prev) =>
      prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId)
        : [recipeId, ...prev]
    );
  };

  const handleToggleIngredient = (ingredientId: string) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [ingredientId]: !prev[ingredientId],
    }));
  };

  const handleAddIngredientsToPantry = (recipe: Recipe, servings: number) => {
    const scaleFactor = servings / recipe.baseServings;
    const unchecked = recipe.ingredients.filter(
      (ing) => !checkedIngredients[ing.id]
    );
    const itemsToAdd: PantryItem[] = (
      unchecked.length > 0 ? unchecked : recipe.ingredients
    ).map((ing) => ({
      id: `pantry-${recipe.id}-${ing.id}-${Date.now()}`,
      name: ing.name,
      quantityText: formatScaledAmount(ing, scaleFactor, unitSystem),
      recipeTitle: recipe.title,
      aisle: ing.aisle,
      checked: false,
    }));

    setPantryItems((prev) => [...itemsToAdd, ...prev]);
    setPantryFeedback(`Added ${itemsToAdd.length} items to Pantry List`);
    setTimeout(() => setPantryFeedback(null), 2600);
  };

  const handleStartStepTimer = (
    recipe: Recipe,
    stepNumber: number,
    label: string,
    seconds: number
  ) => {
    setActiveTimer({
      recipeId: recipe.id,
      recipeTitle: recipe.title,
      stepNumber,
      label,
      totalSeconds: seconds,
      remainingSeconds: seconds,
      running: true,
      completed: false,
    });
  };

  const handleToggleVoice = () => {
    const next = !voiceEnabled;
    setVoiceEnabled(next);
    if (next) {
      const step = activeRecipe.steps[currentStepIndex];
      if (step) {
        speakInstructionText(
          `Step ${step.stepNumber}. ${step.title}. ${step.instruction}`
        );
      }
    } else {
      stopSpeaking();
    }
  };

  const handleNextStepFromBar = () => {
    const total = activeRecipe.steps.length;
    if (currentStepIndex + 1 < total) {
      const nextIdx = currentStepIndex + 1;
      setStepByRecipe((prev) => ({ ...prev, [activeRecipe.id]: nextIdx }));
      if (voiceEnabled) {
        const nextStep = activeRecipe.steps[nextIdx];
        if (nextStep) {
          speakInstructionText(
            `Step ${nextStep.stepNumber}. ${nextStep.title}. ${nextStep.instruction}`
          );
        }
      }
    } else {
      setStepByRecipe((prev) => ({ ...prev, [activeRecipe.id]: 0 }));
      if (activeScreen === ActiveScreen.CookMode) {
        setActiveScreen(ActiveScreen.RecipeDetail);
      }
    }
  };

  const handleAddCommunityNote = (
    recipeId: string,
    authorName: string,
    location: string,
    comment: string
  ) => {
    setRecipes((prev) =>
      prev.map((r) => {
        if (r.id !== recipeId) return r;
        return {
          ...r,
          notesCount: r.notesCount + 1,
          communityNotes: [
            {
              id: `note-${Date.now()}`,
              authorName,
              authorRole: 'Community Cook',
              location,
              dateLabel: 'Just now',
              comment,
            },
            ...r.communityNotes,
          ],
        };
      })
    );
  };

  const handlePublishRecipe = (newRecipe: Recipe) => {
    setRecipes((prev) => [newRecipe, ...prev]);
    setSelectedRecipeId(newRecipe.id);
    setActiveScreen(ActiveScreen.RecipeDetail);
  };

  const showFloatingBar =
    activeScreen === ActiveScreen.RecipeDetail ||
    activeScreen === ActiveScreen.CookMode ||
    activeTimer !== null;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--canvas)] text-[var(--text-primary)]">
      {/* Strict 3-Zone Top Bar Contract */}
      <header
        className="md:sticky md:top-0 z-30 border-b border-[var(--border-hairline)] backdrop-blur-md"
        style={{ backgroundColor: 'var(--glass-header)' }}
      >
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveScreen(ActiveScreen.Discover);
            }}
            className="font-display-theme text-xl font-semibold tracking-[-0.02em] text-[var(--text-primary)] whitespace-nowrap shrink-0"
          >
            Køkken
          </a>

          {/* Zone 2: 4 Single-line Navigation Links */}
          <nav
            aria-label="Primary"
            className="flex items-center gap-5 sm:gap-7 text-sm font-medium text-[var(--text-secondary)] overflow-x-auto"
          >
            <button
              type="button"
              onClick={() => setActiveScreen(ActiveScreen.Discover)}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                activeScreen === ActiveScreen.Discover
                  ? 'border-[var(--accent-primary)] text-[var(--text-primary)] font-semibold'
                  : 'border-transparent hover:text-[var(--text-primary)]'
              }`}
            >
              Recipes
            </button>
            <button
              type="button"
              onClick={() => setActiveScreen(ActiveScreen.Seasonal)}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                activeScreen === ActiveScreen.Seasonal
                  ? 'border-[var(--accent-primary)] text-[var(--text-primary)] font-semibold'
                  : 'border-transparent hover:text-[var(--text-primary)]'
              }`}
            >
              Seasonal
            </button>
            <button
              type="button"
              onClick={() => setActiveScreen(ActiveScreen.SavedBox)}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                activeScreen === ActiveScreen.SavedBox
                  ? 'border-[var(--accent-primary)] text-[var(--text-primary)] font-semibold'
                  : 'border-transparent hover:text-[var(--text-primary)]'
              }`}
            >
              Saved Box ({savedIds.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveScreen(ActiveScreen.CookMode)}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                activeScreen === ActiveScreen.CookMode
                  ? 'border-[var(--accent-primary)] text-[var(--text-primary)] font-semibold'
                  : 'border-transparent hover:text-[var(--text-primary)]'
              }`}
            >
              Cook Mode
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="h-10 px-4 sm:px-5 rounded-full text-xs sm:text-sm font-semibold text-white bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] active:scale-[0.98] transition-all whitespace-nowrap shrink-0"
            >
              Share Recipe
            </button>
          </div>
        </div>
      </header>

      {/* Workspace Atmosphere & Search Toolbar (Below Header) */}
      <div className="border-b border-[var(--border-hairline)] bg-[var(--surface)]/60">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          {/* Design System Atmosphere Selector (Nordic Kitchen vs. Calm Kitchen) */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-[var(--text-secondary)] hidden sm:inline">
              Kitchen Atmosphere:
            </span>
            <div
              className="inline-flex items-center p-1 rounded-full bg-[var(--surface-inset)] border border-[var(--border-hairline)]"
              role="group"
              aria-label="Design atmosphere"
            >
              <button
                type="button"
                onClick={() => setThemeMode(ThemeMode.Nordic)}
                className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  themeMode === ThemeMode.Nordic
                    ? 'bg-[var(--surface)] text-[var(--text-primary)] shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Nordic Kitchen
              </button>
              <button
                type="button"
                onClick={() => setThemeMode(ThemeMode.Calm)}
                className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  themeMode === ThemeMode.Calm
                    ? 'bg-[var(--surface)] text-[var(--text-primary)] shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Calm Kitchen
              </button>
            </div>
          </div>

          {/* Search Input when browsing */}
          {(activeScreen === ActiveScreen.Discover ||
            activeScreen === ActiveScreen.Seasonal) && (
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeScreen !== ActiveScreen.Discover) {
                    setActiveScreen(ActiveScreen.Discover);
                  }
                }}
                placeholder="Search ingredients, grains, dishes..."
                aria-label="Search recipes"
                className="w-full h-10 pl-9 pr-3.5 rounded-[var(--radius-control)] bg-[var(--surface-inset)] border border-[var(--border-hairline)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Content Router */}
      <main className="flex-1">
        {activeScreen === ActiveScreen.Discover && (
          <div className="max-w-[1200px] mx-auto px-5 sm:px-8 pt-8 pb-28 space-y-16">
            {/* Hero Featured Culinary Story */}
            {!searchQuery && activeCourse === 'All' && (
              <section
                aria-label="Featured seasonal recipe"
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch pb-14 border-b border-[var(--border-hairline)]"
              >
                <div className="lg:col-span-5 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)] mb-4 tabular-nums">
                      <span>{featuredRecipe.season}</span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {featuredRecipe.prepMinutes + featuredRecipe.cookMinutes}{' '}
                        min
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{featuredRecipe.difficulty}</span>
                    </div>

                    <h1 className="font-display-theme text-3xl sm:text-[42px] sm:leading-[50px] font-semibold tracking-[-0.02em] text-[var(--text-primary)] mb-4">
                      {featuredRecipe.title}
                    </h1>

                    <p className="text-base leading-[1.65] text-[var(--text-secondary)] mb-7">
                      {featuredRecipe.subtitle}
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => openRecipeDetail(featuredRecipe.id)}
                        className="h-12 px-7 rounded-full text-sm font-semibold text-white bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] active:scale-[0.98] transition-all inline-flex items-center gap-2 whitespace-nowrap shrink-0"
                      >
                        <span>Read &amp; Cook</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => openCookModeForRecipe(featuredRecipe.id)}
                        className="h-12 px-6 rounded-full text-sm font-semibold bg-[var(--surface-inset)] border border-[var(--border-hairline)] text-[var(--text-primary)] hover:border-[var(--accent-secondary)] transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0"
                      >
                        <UtensilsCrossed className="w-4 h-4" />
                        <span>Countertop Mode</span>
                      </button>
                    </div>

                    <p className="text-xs text-[var(--text-secondary)] pt-4 border-t border-[var(--border-hairline)]">
                      Recipe by{' '}
                      <span className="font-semibold text-[var(--text-primary)]">
                        {featuredRecipe.authorName}
                      </span>{' '}
                      · {featuredRecipe.authorLocation} ·{' '}
                      <span className="tabular-nums">
                        {featuredRecipe.notesCount} community kitchen notes
                      </span>
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <div
                    onClick={() => openRecipeDetail(featuredRecipe.id)}
                    className="cursor-pointer group overflow-hidden rounded-[var(--radius-card)] border border-[var(--border-hairline)] h-full min-h-[290px] sm:min-h-[390px]"
                    style={{ boxShadow: 'var(--shadow-card)' }}
                  >
                    <RecipeImage
                      src={featuredRecipe.imageUrl}
                      alt={featuredRecipe.imageAlt}
                      title={featuredRecipe.title}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.015]"
                    />
                  </div>
                </div>
              </section>
            )}

            {/* Community Recipe Collection & Course Filter Bar */}
            <section aria-labelledby="collection-heading">
              <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
                <div>
                  <h2
                    id="collection-heading"
                    className="font-display-theme text-2xl sm:text-[30px] font-semibold tracking-[-0.01em] text-[var(--text-primary)]"
                  >
                    {themeMode === ThemeMode.Nordic
                      ? 'From the Nordic Table'
                      : 'Mindful Kitchen Collection'}
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    Unhurried recipes tested for countertop clarity, metric precision, and seasonal pantry ingredients.
                  </p>
                </div>

                {/* Interactive Course Filter Segmented Control */}
                <div
                  className="flex items-center gap-1 p-1 rounded-full bg-[var(--surface-inset)] border border-[var(--border-hairline)] overflow-x-auto"
                  role="tablist"
                  aria-label="Filter recipes by course"
                >
                  {COURSE_FILTERS.map((course) => {
                    const active = activeCourse === course;
                    return (
                      <button
                        key={course}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setActiveCourse(course)}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                          active
                            ? 'bg-[var(--accent-secondary)] text-white'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        {course}
                      </button>
                    );
                  })}
                </div>
              </div>

              {filteredRecipes.length === 0 ? (
                <div className="p-12 rounded-[var(--radius-card)] bg-[var(--surface)] border border-[var(--border-hairline)] text-center">
                  <p className="font-display-theme text-lg font-medium text-[var(--text-primary)] mb-2">
                    No recipes matched “{searchQuery}”
                  </p>
                  <p className="text-sm text-[var(--text-secondary)] mb-5">
                    Try searching for cardamom, leeks, oats, rye, or miso, or reset the active filter.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCourse('All');
                    }}
                    className="h-10 px-5 rounded-full text-xs font-semibold bg-[var(--surface-inset)] text-[var(--text-primary)] border border-[var(--border-hairline)]"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                  {filteredRecipes.map((recipe) => {
                    const saved = savedIds.includes(recipe.id);
                    const totalTime = recipe.prepMinutes + recipe.cookMinutes;
                    return (
                      <article
                        key={recipe.id}
                        onClick={() => openRecipeDetail(recipe.id)}
                        className="group cursor-pointer rounded-[var(--radius-card)] bg-[var(--surface)] border border-[var(--border-hairline)] overflow-hidden flex flex-col transition-transform duration-150 hover:-translate-y-0.5"
                        style={{ boxShadow: 'var(--shadow-card)' }}
                      >
                        <div
                          className={`overflow-hidden bg-[var(--surface-inset)] ${
                            themeMode === ThemeMode.Calm
                              ? 'aspect-[4/3]'
                              : 'aspect-[16/10]'
                          }`}
                        >
                          <RecipeImage
                            src={recipe.imageUrl}
                            alt={recipe.imageAlt}
                            title={recipe.title}
                            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                          />
                        </div>

                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div>
                            {/* Clean Unboxed Metadata */}
                            <div className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--text-secondary)] tabular-nums mb-2.5">
                              <span>{recipe.category}</span>
                              <span aria-hidden="true">·</span>
                              <span>{totalTime} min</span>
                              <span aria-hidden="true">·</span>
                              <span>{recipe.difficulty}</span>
                              <span aria-hidden="true">·</span>
                              <span>{recipe.dietaryLabel}</span>
                            </div>

                            <h3 className="font-display-theme text-xl font-semibold leading-snug text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-primary)] transition-colors">
                              {recipe.title}
                            </h3>

                            <p className="text-sm leading-relaxed text-[var(--text-secondary)] line-clamp-2 mb-5">
                              {recipe.subtitle}
                            </p>
                          </div>

                          <div className="pt-4 border-t border-[var(--border-hairline)] flex items-center justify-between gap-3 text-xs">
                            <div className="min-w-0">
                              <p className="font-semibold text-[var(--text-primary)] truncate">
                                {recipe.authorName}
                              </p>
                              <p className="text-[var(--text-muted)] tabular-nums">
                                {recipe.rating.toFixed(1)} rating ·{' '}
                                {recipe.notesCount} notes
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleSave(recipe.id);
                              }}
                              className={`h-9 px-3 rounded-full inline-flex items-center gap-1.5 font-semibold border transition-colors shrink-0 ${
                                saved
                                  ? 'bg-[var(--accent-secondary)] border-[var(--accent-secondary)] text-white'
                                  : 'bg-[var(--surface-inset)] border-[var(--border-hairline)] text-[var(--text-primary)] hover:border-[var(--accent-secondary)]'
                              }`}
                              aria-label={
                                saved
                                  ? `Remove ${recipe.title} from saved box`
                                  : `Save ${recipe.title}`
                              }
                            >
                              <Bookmark
                                className={`w-3.5 h-3.5 ${
                                  saved ? 'fill-current' : ''
                                }`}
                              />
                              <span>{saved ? 'Saved' : 'Save'}</span>
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Community Field Notes & Craft Proof Section */}
            <section
              aria-labelledby="rituals-heading"
              className="pt-12 border-t border-[var(--border-hairline)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              <div className="lg:col-span-4">
                <h2
                  id="rituals-heading"
                  className="font-display-theme text-2xl font-semibold text-[var(--text-primary)] mb-2"
                >
                  Tested in Real Home Kitchens
                </h2>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                  Every recipe pairs gram-accurate measurements with sensory cues—so you cook by aroma, texture, and gentle sound rather than kitchen stress.
                </p>
              </div>

              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <blockquote className="p-6 rounded-[var(--radius-card)] bg-[var(--surface)] border border-[var(--border-hairline)]">
                  <p className="text-sm leading-relaxed text-[var(--text-primary)] mb-4">
                    “Switching to gram weights and countertop step timers cut our Sunday cardamom bake prep by 20 minutes—and every knot came out evenly caramelized without checking my phone with floury hands.”
                  </p>
                  <footer className="text-xs text-[var(--text-secondary)]">
                    <strong className="font-semibold text-[var(--text-primary)]">
                      Soren Halvorsen
                    </strong>{' '}
                    · Home Baker · Oslo Kitchen Collective
                  </footer>
                </blockquote>

                <blockquote className="p-6 rounded-[var(--radius-card)] bg-[var(--surface)] border border-[var(--border-hairline)]">
                  <p className="text-sm leading-relaxed text-[var(--text-primary)] mb-4">
                    “The Calm Kitchen view replaced three cluttered browser tabs during weeknight dinner. Having sensory cues right next to the 6-minute egg timer makes broth nights effortless.”
                  </p>
                  <footer className="text-xs text-[var(--text-secondary)]">
                    <strong className="font-semibold text-[var(--text-primary)]">
                      Klara Sjöberg
                    </strong>{' '}
                    · Clinical Nutritionist · Gothenburg
                  </footer>
                </blockquote>
              </div>
            </section>
          </div>
        )}

        {activeScreen === ActiveScreen.Seasonal && (
          <div className="max-w-[1200px] mx-auto px-5 sm:px-8 pt-8 pb-28">
            <div className="flex flex-wrap items-end justify-between gap-4 pb-8 mb-10 border-b border-[var(--border-hairline)]">
              <div>
                <h1 className="font-display-theme text-3xl sm:text-4xl font-semibold text-[var(--text-primary)] mb-2">
                  Seasonal Larder &amp; Gatherings
                </h1>
                <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-xl">
                  Dishes organized around cool-weather root cellars, toasted whole grains, and bright spring botanicals.
                </p>
              </div>

              <div
                className="inline-flex items-center p-1 rounded-full bg-[var(--surface-inset)] border border-[var(--border-hairline)]"
                role="tablist"
                aria-label="Seasonal collection selector"
              >
                {['Autumn & Winter', 'Spring & Summer'].map((season) => (
                  <button
                    key={season}
                    type="button"
                    role="tab"
                    aria-selected={seasonalFilter === season}
                    onClick={() => setSeasonalFilter(season)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                      seasonalFilter === season
                        ? 'bg-[var(--accent-primary)] text-white'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {season}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {seasonalRecipes.map((recipe) => (
                <article
                  key={recipe.id}
                  onClick={() => openRecipeDetail(recipe.id)}
                  className="group cursor-pointer rounded-[var(--radius-card)] bg-[var(--surface)] border border-[var(--border-hairline)] overflow-hidden grid grid-cols-1 sm:grid-cols-12"
                  style={{ boxShadow: 'var(--shadow-card)' }}
                >
                  <div className="sm:col-span-5 bg-[var(--surface-inset)] min-h-[200px]">
                    <RecipeImage
                      src={recipe.imageUrl}
                      alt={recipe.imageAlt}
                      title={recipe.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="sm:col-span-7 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] tabular-nums mb-2">
                        <span>{recipe.season}</span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {recipe.prepMinutes + recipe.cookMinutes} min
                        </span>
                      </div>
                      <h2 className="font-display-theme text-xl font-semibold text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-primary)] transition-colors">
                        {recipe.title}
                      </h2>
                      <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-4">
                        {recipe.subtitle}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-[var(--border-hairline)] text-xs">
                      <span className="text-[var(--text-secondary)]">
                        {recipe.ingredients.length} pantry ingredients
                      </span>
                      <span className="font-semibold text-[var(--accent-primary)] inline-flex items-center gap-1">
                        <span>Open Recipe</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {activeScreen === ActiveScreen.RecipeDetail && (
          <RecipeDetailView
            recipe={activeRecipe}
            themeMode={themeMode}
            unitSystem={unitSystem}
            onChangeUnitSystem={setUnitSystem}
            servings={currentServings}
            onChangeServings={(next) =>
              setServingsByRecipe((prev) => ({
                ...prev,
                [activeRecipe.id]: next,
              }))
            }
            checkedIngredients={checkedIngredients}
            onToggleIngredient={handleToggleIngredient}
            isSaved={savedIds.includes(activeRecipe.id)}
            onToggleSave={handleToggleSave}
            onAddIngredientsToPantry={handleAddIngredientsToPantry}
            pantryFeedback={pantryFeedback}
            currentStepIndex={currentStepIndex}
            onSelectStep={(idx) =>
              setStepByRecipe((prev) => ({ ...prev, [activeRecipe.id]: idx }))
            }
            onStartStepTimer={handleStartStepTimer}
            activeTimer={activeTimer}
            onEnterCookMode={() => setActiveScreen(ActiveScreen.CookMode)}
            onBack={() => setActiveScreen(ActiveScreen.Discover)}
            onAddCommunityNote={handleAddCommunityNote}
          />
        )}

        {activeScreen === ActiveScreen.CookMode && (
          <CookModeView
            recipe={activeRecipe}
            servings={currentServings}
            unitSystem={unitSystem}
            currentStepIndex={currentStepIndex}
            onChangeStep={(nextIdx) =>
              setStepByRecipe((prev) => ({
                ...prev,
                [activeRecipe.id]: nextIdx,
              }))
            }
            onStartStepTimer={handleStartStepTimer}
            activeTimer={activeTimer}
            voiceEnabled={voiceEnabled}
            onExitCookMode={() => setActiveScreen(ActiveScreen.RecipeDetail)}
          />
        )}

        {activeScreen === ActiveScreen.SavedBox && (
          <SavedPantryView
            savedRecipes={savedRecipes}
            pantryItems={pantryItems}
            themeMode={themeMode}
            onOpenRecipe={openRecipeDetail}
            onRemoveSaved={handleToggleSave}
            onTogglePantryItem={(itemId) =>
              setPantryItems((prev) =>
                prev.map((item) =>
                  item.id === itemId ? { ...item, checked: !item.checked } : item
                )
              )
            }
            onAddCustomPantryItem={(name, quantityText) =>
              setPantryItems((prev) => [
                {
                  id: `custom-pantry-${Date.now()}`,
                  name,
                  quantityText,
                  recipeTitle: 'Pantry Staple',
                  aisle: 'Pantry',
                  checked: false,
                },
                ...prev,
              ])
            }
            onClearCheckedPantry={() =>
              setPantryItems((prev) => prev.filter((item) => !item.checked))
            }
            onBrowseRecipes={() => setActiveScreen(ActiveScreen.Discover)}
          />
        )}
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-[var(--border-hairline)] py-8 pb-24 text-xs text-[var(--text-secondary)]">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 flex flex-wrap items-center justify-between gap-4">
          <p>
            Køkken — Nordic Kitchen Community &amp; Calm Kitchen Culinary Journal
          </p>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => setActiveScreen(ActiveScreen.Discover)}
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              Recipes
            </button>
            <button
              type="button"
              onClick={() => setActiveScreen(ActiveScreen.SavedBox)}
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              Market List
            </button>
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              Contribute Recipe
            </button>
          </div>
        </div>
      </footer>

      {/* Signature Persistent Floating Cook Bar */}
      {showFloatingBar && (
        <FloatingCookBar
          recipe={activeRecipe}
          currentStepIndex={currentStepIndex}
          servings={currentServings}
          unitSystem={unitSystem}
          themeMode={themeMode}
          checkedIngredients={checkedIngredients}
          onToggleIngredient={handleToggleIngredient}
          activeTimer={activeTimer}
          onToggleTimerPlay={() =>
            setActiveTimer((prev) =>
              prev
                ? {
                    ...prev,
                    running: !prev.running,
                    remainingSeconds:
                      prev.remainingSeconds === 0
                        ? prev.totalSeconds
                        : prev.remainingSeconds,
                    completed: false,
                  }
                : null
            )
          }
          onResetTimer={() =>
            setActiveTimer((prev) =>
              prev
                ? {
                    ...prev,
                    remainingSeconds: prev.totalSeconds,
                    running: false,
                    completed: false,
                  }
                : null
            )
          }
          onDismissTimer={() => setActiveTimer(null)}
          onNextStep={handleNextStepFromBar}
          onOpenCookMode={() => setActiveScreen(ActiveScreen.CookMode)}
          voiceEnabled={voiceEnabled}
          onToggleVoice={handleToggleVoice}
          isCookModeOpen={activeScreen === ActiveScreen.CookMode}
        />
      )}

      {/* Share Recipe Modal */}
      <ShareRecipeModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onPublishRecipe={handlePublishRecipe}
      />
    </div>
  );
}
