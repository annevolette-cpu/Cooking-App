import React, { useState } from 'react';
import {
  ArrowLeft,
  Bookmark,
  Check,
  Clock,
  Minus,
  Plus,
  ShoppingBag,
  Play,
  UtensilsCrossed,
} from 'lucide-react';
import {
  ActiveTimer,
  Recipe,
  ThemeMode,
  UnitSystem,
} from '../types';
import { RecipeImage } from './RecipeImage';
import { formatScaledAmount, formatTimerClock } from '../utils/formatters';

interface RecipeDetailViewProps {
  recipe: Recipe;
  themeMode: ThemeMode;
  unitSystem: UnitSystem;
  onChangeUnitSystem: (unit: UnitSystem) => void;
  servings: number;
  onChangeServings: (nextServings: number) => void;
  checkedIngredients: Record<string, boolean>;
  onToggleIngredient: (ingredientId: string) => void;
  isSaved: boolean;
  onToggleSave: (recipeId: string) => void;
  onAddIngredientsToPantry: (recipe: Recipe, servings: number) => void;
  pantryFeedback: string | null;
  currentStepIndex: number;
  onSelectStep: (stepIdx: number) => void;
  onStartStepTimer: (
    recipe: Recipe,
    stepNumber: number,
    label: string,
    seconds: number
  ) => void;
  activeTimer: ActiveTimer | null;
  onEnterCookMode: () => void;
  onBack: () => void;
  onAddCommunityNote: (
    recipeId: string,
    authorName: string,
    location: string,
    comment: string
  ) => void;
}

export const RecipeDetailView: React.FC<RecipeDetailViewProps> = ({
  recipe,
  themeMode,
  unitSystem,
  onChangeUnitSystem,
  servings,
  onChangeServings,
  checkedIngredients,
  onToggleIngredient,
  isSaved,
  onToggleSave,
  onAddIngredientsToPantry,
  pantryFeedback,
  currentStepIndex,
  onSelectStep,
  onStartStepTimer,
  activeTimer,
  onEnterCookMode,
  onBack,
  onAddCommunityNote,
}) => {
  const [noteAuthor, setNoteAuthor] = useState('');
  const [noteLocation, setNoteLocation] = useState('');
  const [noteText, setNoteText] = useState('');
  const [noteSubmitted, setNoteSubmitted] = useState(false);

  const scaleFactor = servings / recipe.baseServings;
  const totalMinutes = recipe.prepMinutes + recipe.cookMinutes;
  const isCalm = themeMode === ThemeMode.Calm;

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    onAddCommunityNote(
      recipe.id,
      noteAuthor.trim() || 'Home Cook',
      noteLocation.trim() || 'Community Kitchen',
      noteText.trim()
    );
    setNoteAuthor('');
    setNoteLocation('');
    setNoteText('');
    setNoteSubmitted(true);
    setTimeout(() => setNoteSubmitted(false), 3000);
  };

  return (
    <article className="max-w-[1160px] mx-auto px-5 sm:px-8 pt-6 pb-28">
      {/* Top Return & Actions Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors whitespace-nowrap shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Recipes</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onToggleSave(recipe.id)}
            className={`h-10 px-4 rounded-full text-xs font-semibold flex items-center gap-2 border transition-colors whitespace-nowrap shrink-0 ${
              isSaved
                ? 'bg-[var(--accent-secondary)] border-[var(--accent-secondary)] text-white'
                : 'bg-[var(--surface)] border-[var(--border-hairline)] text-[var(--text-primary)] hover:bg-[var(--surface-inset)]'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
            <span>{isSaved ? 'Saved in Box' : 'Save Recipe'}</span>
          </button>

          <button
            type="button"
            onClick={onEnterCookMode}
            className="h-10 px-5 rounded-full text-xs font-semibold text-white bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Start Cook Mode</span>
          </button>
        </div>
      </div>

      {/* Editorial Hero Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch mb-12 pb-10 border-b border-[var(--border-hairline)]">
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div>
            {/* Unboxed Clean Metadata Line */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[var(--text-secondary)] mb-4 tabular-nums">
              <span>{recipe.category}</span>
              <span aria-hidden="true">·</span>
              <span>{totalMinutes} min total</span>
              <span aria-hidden="true">·</span>
              <span>{recipe.difficulty}</span>
              <span aria-hidden="true">·</span>
              <span>{recipe.dietaryLabel}</span>
            </div>

            <h1 className="font-display-theme text-3xl sm:text-[40px] sm:leading-[48px] font-semibold tracking-[-0.02em] text-[var(--text-primary)] mb-4">
              {recipe.title}
            </h1>

            <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-6 max-w-[60ch]">
              {recipe.subtitle}
            </p>
          </div>

          <div className="pt-6 border-t border-[var(--border-hairline)] flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                By {recipe.authorName}
              </p>
              <p className="text-xs text-[var(--text-secondary)]">
                {recipe.authorLocation} · {recipe.rating.toFixed(1)} rating ({recipe.notesCount}{' '}
                kitchen notes)
              </p>
            </div>

            {/* Nutritional Summary in Tabular Numerals */}
            <div className="flex items-center gap-5 text-xs text-[var(--text-secondary)] tabular-nums">
              <div>
                <span className="block font-semibold text-[var(--text-primary)]">
                  {recipe.nutrition.calories} kcal
                </span>
                <span>Energy</span>
              </div>
              <div>
                <span className="block font-semibold text-[var(--text-primary)]">
                  {recipe.nutrition.proteinGrams}g
                </span>
                <span>Protein</span>
              </div>
              <div>
                <span className="block font-semibold text-[var(--text-primary)]">
                  {recipe.nutrition.fiberGrams}g
                </span>
                <span>Fiber</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--border-hairline)] h-full min-h-[280px] sm:min-h-[360px]">
            <RecipeImage
              src={recipe.imageUrl}
              alt={recipe.imageAlt}
              title={recipe.title}
              className="w-full h-full object-cover aspect-[16/10] lg:aspect-auto"
            />
          </div>
        </div>
      </div>

      {/* Main Two-Column Culinary Studio: Ingredients Left, Preparation Steps Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Left Column: Interactive Ingredient Checklist */}
        <section
          aria-labelledby="ingredients-heading"
          className="lg:col-span-5 lg:sticky lg:top-20 bg-[var(--surface)] border border-[var(--border-hairline)] rounded-[var(--radius-card)] p-6 sm:p-7"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-[var(--border-hairline)]">
            <h2
              id="ingredients-heading"
              className="font-display-theme text-xl font-semibold text-[var(--text-primary)]"
            >
              Ingredients
            </h2>

            {/* Unit Toggle Control */}
            <div
              className="inline-flex items-center p-1 rounded-full bg-[var(--surface-inset)] border border-[var(--border-hairline)]"
              role="group"
              aria-label="Measurement units"
            >
              <button
                type="button"
                onClick={() => onChangeUnitSystem(UnitSystem.Metric)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  unitSystem === UnitSystem.Metric
                    ? 'bg-[var(--surface)] text-[var(--text-primary)] shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Metric
              </button>
              <button
                type="button"
                onClick={() => onChangeUnitSystem(UnitSystem.Imperial)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  unitSystem === UnitSystem.Imperial
                    ? 'bg-[var(--surface)] text-[var(--text-primary)] shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Imperial
              </button>
            </div>
          </div>

          {/* Servings Scaler */}
          <div className="flex items-center justify-between py-2.5 px-3.5 mb-5 rounded-[var(--radius-control)] bg-[var(--surface-inset)]">
            <span className="text-xs font-semibold text-[var(--text-secondary)]">
              Yield / Servings
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onChangeServings(Math.max(1, servings - 1))}
                disabled={servings <= 1}
                className="w-7 h-7 rounded-full flex items-center justify-center bg-[var(--surface)] border border-[var(--border-hairline)] text-[var(--text-primary)] disabled:opacity-40 hover:border-[var(--accent-primary)] transition-colors"
                aria-label="Decrease servings"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-sm font-bold tabular-nums text-[var(--text-primary)] min-w-[2ch] text-center">
                {servings}
              </span>
              <button
                type="button"
                onClick={() => onChangeServings(Math.min(24, servings + 1))}
                className="w-7 h-7 rounded-full flex items-center justify-center bg-[var(--surface)] border border-[var(--border-hairline)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-colors"
                aria-label="Increase servings"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Ingredient Rows */}
          <ul className="divide-y divide-[var(--border-hairline)] mb-6">
            {recipe.ingredients.map((ing) => {
              const checked = !!checkedIngredients[ing.id];
              return (
                <li key={ing.id} className="py-3">
                  <button
                    type="button"
                    onClick={() => onToggleIngredient(ing.id)}
                    className="w-full flex items-start justify-between gap-4 text-left group focus-visible:outline-2 focus-visible:outline-[var(--accent-primary)] rounded-sm"
                  >
                    <span className="flex items-start gap-3 min-w-0">
                      <span
                        className={`mt-0.5 w-5 h-5 shrink-0 flex items-center justify-center border-[1.5px] transition-colors ${
                          isCalm ? 'rounded-[6px]' : 'rounded-full'
                        } ${
                          checked
                            ? isCalm
                              ? 'bg-[#8AA39B] border-[#8AA39B] text-white'
                              : 'bg-[#657257] border-[#657257] text-white'
                            : 'border-[var(--border-hairline)] bg-[var(--surface)] group-hover:border-[var(--accent-secondary)]'
                        }`}
                      >
                        {checked && <Check className="w-3 h-3 stroke-[2.5]" />}
                      </span>
                      <span className="min-w-0">
                        <span
                          className={`block text-sm leading-snug transition-colors ${
                            checked
                              ? 'line-through text-[var(--text-muted)]'
                              : 'text-[var(--text-primary)]'
                          }`}
                        >
                          {ing.name}
                        </span>
                        {ing.note && (
                          <span className="block text-xs text-[var(--text-muted)] mt-0.5">
                            {ing.note}
                          </span>
                        )}
                      </span>
                    </span>

                    <span
                      className={`text-sm font-semibold tabular-nums shrink-0 transition-colors ${
                        checked
                          ? 'text-[var(--text-muted)] line-through'
                          : 'text-[var(--text-primary)]'
                      }`}
                    >
                      {formatScaledAmount(ing, scaleFactor, unitSystem)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            onClick={() => onAddIngredientsToPantry(recipe, servings)}
            className="w-full h-11 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-2 bg-[var(--surface-inset)] text-[var(--text-primary)] border border-[var(--border-hairline)] hover:border-[var(--accent-secondary)] transition-colors whitespace-nowrap"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>
              {pantryFeedback || 'Send Unchecked Items to Pantry List'}
            </span>
          </button>
        </section>

        {/* Right Column: Preparation Steps & Community Dialogue */}
        <div className="lg:col-span-7 space-y-12">
          <section aria-labelledby="method-heading">
            <div className="flex items-baseline justify-between pb-4 mb-6 border-b border-[var(--border-hairline)]">
              <h2
                id="method-heading"
                className="font-display-theme text-2xl font-semibold text-[var(--text-primary)]"
              >
                Preparation Method
              </h2>
              <span className="text-xs text-[var(--text-secondary)] tabular-nums">
                {recipe.steps.length} mindful steps
              </span>
            </div>

            <ol className="space-y-6">
              {recipe.steps.map((step, idx) => {
                const isActive = currentStepIndex === idx;
                const isTimerRunningForStep =
                  activeTimer?.recipeId === recipe.id &&
                  activeTimer?.stepNumber === step.stepNumber;

                return (
                  <li
                    key={step.stepNumber}
                    onClick={() => onSelectStep(idx)}
                    className={`p-6 sm:p-7 rounded-[var(--radius-card)] bg-[var(--surface)] border transition-colors cursor-pointer ${
                      isActive
                        ? 'border-[var(--accent-primary)]'
                        : 'border-[var(--border-hairline)] hover:border-[var(--text-muted)]'
                    }`}
                    style={{ boxShadow: 'var(--shadow-card)' }}
                  >
                    <div className="flex items-start gap-4 sm:gap-5">
                      <span className="font-display-theme text-2xl sm:text-3xl font-semibold tabular-nums text-[var(--accent-secondary)] leading-none pt-0.5 select-none">
                        {String(step.stepNumber).padStart(2, '0')}
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <h3 className="font-display-theme text-lg font-semibold text-[var(--text-primary)]">
                            {step.title}
                          </h3>
                          {isActive && (
                            <span className="text-xs font-semibold text-[var(--accent-primary)]">
                              Current Step
                            </span>
                          )}
                        </div>

                        <p className="text-[15px] sm:text-base leading-[1.7] text-[var(--text-primary)] mb-4">
                          {step.instruction}
                        </p>

                        <div className="pt-3 border-t border-[var(--border-hairline)] flex flex-wrap items-center justify-between gap-3">
                          <p className="text-xs text-[var(--text-secondary)] italic">
                            Sensory cue: {step.sensoryCue}
                          </p>

                          {step.timerSeconds && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onStartStepTimer(
                                  recipe,
                                  step.stepNumber,
                                  step.timerLabel || `Step ${step.stepNumber}`,
                                  step.timerSeconds!
                                );
                              }}
                              className={`h-9 px-3.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
                                isTimerRunningForStep
                                  ? 'bg-[var(--accent-primary)] text-white'
                                  : 'bg-[var(--surface-inset)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] border border-[var(--border-hairline)]'
                              }`}
                            >
                              {isTimerRunningForStep ? (
                                <>
                                  <Clock className="w-3.5 h-3.5" />
                                  <span className="tabular-nums">
                                    {formatTimerClock(activeTimer.remainingSeconds)}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Play className="w-3 h-3 fill-current" />
                                  <span className="tabular-nums">
                                    {step.timerLabel || 'Timer'} ·{' '}
                                    {Math.round(step.timerSeconds / 60)} min
                                  </span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          {/* Community Kitchen Notes Section */}
          <section
            aria-labelledby="community-notes-heading"
            className="pt-8 border-t border-[var(--border-hairline)]"
          >
            <div className="flex items-baseline justify-between mb-6">
              <div>
                <h2
                  id="community-notes-heading"
                  className="font-display-theme text-2xl font-semibold text-[var(--text-primary)]"
                >
                  Community Kitchen Notes
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  Substitutions, flour hydrations, and quiet observations from fellow home cooks.
                </p>
              </div>
              <span className="text-xs font-medium text-[var(--text-secondary)] tabular-nums">
                {recipe.communityNotes.length} shared
              </span>
            </div>

            <div className="divide-y divide-[var(--border-hairline)] mb-8">
              {recipe.communityNotes.map((note) => (
                <div key={note.id} className="py-5 first:pt-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-secondary)] mb-2">
                    <span className="font-semibold text-[var(--text-primary)]">
                      {note.authorName}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{note.authorRole}</span>
                    <span aria-hidden="true">·</span>
                    <span>{note.location}</span>
                    <span aria-hidden="true">·</span>
                    <span>{note.dateLabel}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-[var(--text-primary)]">
                    “{note.comment}”
                  </p>
                </div>
              ))}
            </div>

            {/* Add a Kitchen Note Form */}
            <form
              onSubmit={handleNoteSubmit}
              className="p-6 rounded-[var(--radius-card)] bg-[var(--surface)] border border-[var(--border-hairline)] space-y-4"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <h3 className="font-display-theme text-base font-semibold text-[var(--text-primary)]">
                Leave a Kitchen Note
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="note-author"
                    className="block text-xs font-medium text-[var(--text-secondary)] mb-1"
                  >
                    Your Name
                  </label>
                  <input
                    id="note-author"
                    type="text"
                    value={noteAuthor}
                    onChange={(e) => setNoteAuthor(e.target.value)}
                    placeholder="e.g., Ingrid Solberg"
                    className="w-full h-11 px-3.5 rounded-[var(--radius-control)] bg-[var(--surface-inset)] border border-[var(--border-hairline)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="note-location"
                    className="block text-xs font-medium text-[var(--text-secondary)] mb-1"
                  >
                    Kitchen / City
                  </label>
                  <input
                    id="note-location"
                    type="text"
                    value={noteLocation}
                    onChange={(e) => setNoteLocation(e.target.value)}
                    placeholder="e.g., Bergen, Norway"
                    className="w-full h-11 px-3.5 rounded-[var(--radius-control)] bg-[var(--surface-inset)] border border-[var(--border-hairline)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="note-comment"
                  className="block text-xs font-medium text-[var(--text-secondary)] mb-1"
                >
                  What did you notice or adapt while cooking?
                </label>
                <textarea
                  id="note-comment"
                  rows={3}
                  required
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Share oven timings, grain swaps, or seasonal pairings..."
                  className="w-full p-3.5 rounded-[var(--radius-control)] bg-[var(--surface-inset)] border border-[var(--border-hairline)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-[var(--accent-secondary)] font-medium">
                  {noteSubmitted ? 'Thank you — your note has been added above.' : ''}
                </span>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-full text-xs font-semibold text-white bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] transition-colors whitespace-nowrap shrink-0"
                >
                  Post Kitchen Note
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </article>
  );
};
