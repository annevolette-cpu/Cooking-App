import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ListChecks,
  Volume2,
  VolumeX,
  X,
  Check,
} from 'lucide-react';
import {
  ActiveTimer,
  Recipe,
  ThemeMode,
  UnitSystem,
} from '../types';
import { formatScaledAmount, formatTimerClock } from '../utils/formatters';

interface FloatingCookBarProps {
  recipe: Recipe;
  currentStepIndex: number;
  servings: number;
  unitSystem: UnitSystem;
  themeMode: ThemeMode;
  checkedIngredients: Record<string, boolean>;
  onToggleIngredient: (ingredientId: string) => void;
  activeTimer: ActiveTimer | null;
  onToggleTimerPlay: () => void;
  onResetTimer: () => void;
  onDismissTimer: () => void;
  onNextStep: () => void;
  onOpenCookMode: () => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  isCookModeOpen: boolean;
}

export const FloatingCookBar: React.FC<FloatingCookBarProps> = ({
  recipe,
  currentStepIndex,
  servings,
  unitSystem,
  themeMode,
  checkedIngredients,
  onToggleIngredient,
  activeTimer,
  onToggleTimerPlay,
  onResetTimer,
  onDismissTimer,
  onNextStep,
  onOpenCookMode,
  voiceEnabled,
  onToggleVoice,
  isCookModeOpen,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const scaleFactor = servings / recipe.baseServings;
  const totalSteps = recipe.steps.length;
  const safeStep = Math.min(currentStepIndex + 1, totalSteps);
  const isCalm = themeMode === ThemeMode.Calm;

  return (
    <div className="fixed bottom-3 left-0 right-0 z-40 px-3 sm:px-6 pointer-events-none">
      <div className="max-w-4xl mx-auto pointer-events-auto">
        {drawerOpen && (
          <div
            className="mb-2.5 p-5 bg-[var(--surface)] border border-[var(--border-hairline)] rounded-[var(--radius-card)] max-h-64 overflow-y-auto"
            style={{ boxShadow: 'var(--shadow-float)' }}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border-hairline)]">
              <span className="font-display-theme text-base font-semibold text-[var(--text-primary)]">
                Quick Ingredient Check ({servings} servings)
              </span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-inset)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent-primary)]"
                aria-label="Close ingredient drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <ul className="divide-y divide-[var(--border-hairline)]">
              {recipe.ingredients.map((ing) => {
                const isChecked = !!checkedIngredients[ing.id];
                return (
                  <li key={ing.id} className="py-2">
                    <button
                      type="button"
                      onClick={() => onToggleIngredient(ing.id)}
                      className="w-full flex items-center justify-between gap-4 text-left group"
                    >
                      <span className="flex items-center gap-3 min-w-0">
                        <span
                          className={`w-5 h-5 shrink-0 flex items-center justify-center border transition-colors ${
                            isCalm ? 'rounded-md' : 'rounded-full'
                          } ${
                            isChecked
                              ? isCalm
                                ? 'bg-[#8AA39B] border-[#8AA39B] text-white'
                                : 'bg-[#657257] border-[#657257] text-white'
                              : 'border-[var(--border-hairline)] bg-[var(--surface)]'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[2.5]" />}
                        </span>
                        <span
                          className={`text-sm truncate transition-colors ${
                            isChecked
                              ? 'line-through text-[var(--text-muted)]'
                              : 'text-[var(--text-primary)]'
                          }`}
                        >
                          {ing.name}
                        </span>
                      </span>
                      <span className="text-xs font-semibold tabular-nums text-[var(--text-secondary)] shrink-0">
                        {formatScaledAmount(ing, scaleFactor, unitSystem)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div
          className="flex items-center justify-between gap-3 sm:gap-5 px-4 sm:px-5 py-2.5 rounded-full border border-[var(--border-hairline)] backdrop-blur-md"
          style={{
            backgroundColor: 'var(--glass-bar)',
            boxShadow: 'var(--shadow-float)',
          }}
        >
          {/* Left: Step Context & Quick Ingredients */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => setDrawerOpen((prev) => !prev)}
              className={`h-10 px-3.5 rounded-full flex items-center gap-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[var(--accent-primary)] ${
                drawerOpen
                  ? 'bg-[var(--accent-secondary)] text-white'
                  : 'bg-[var(--surface-inset)] text-[var(--text-primary)] hover:opacity-90'
              }`}
              aria-expanded={drawerOpen}
            >
              <ListChecks className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Ingredients</span>
            </button>

            <div className="min-w-0 hidden md:block">
              <p className="text-xs font-semibold text-[var(--text-primary)] truncate max-w-[200px]">
                {recipe.title}
              </p>
              <p className="text-[11px] text-[var(--text-secondary)] tabular-nums">
                Step {safeStep} of {totalSteps}
              </p>
            </div>
          </div>

          {/* Center: Persistent Kitchen Timer & Voice Read-Aloud */}
          <div className="flex items-center gap-2 shrink-0">
            {activeTimer ? (
              <div className="flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full bg-[var(--surface-inset)] border border-[var(--border-hairline)]">
                <span className="text-xs text-[var(--text-secondary)] hidden sm:inline max-w-[110px] truncate">
                  {activeTimer.completed ? 'Timer Done' : activeTimer.label}
                </span>
                <span
                  className={`text-sm font-bold tabular-nums px-1 ${
                    activeTimer.completed
                      ? 'text-[var(--accent-primary)]'
                      : 'text-[var(--text-primary)]'
                  }`}
                >
                  {formatTimerClock(activeTimer.remainingSeconds)}
                </span>
                <button
                  type="button"
                  onClick={onToggleTimerPlay}
                  className="w-7 h-7 rounded-full flex items-center justify-center bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--accent-primary)] hover:text-white transition-colors"
                  aria-label={activeTimer.running ? 'Pause timer' : 'Resume timer'}
                >
                  {activeTimer.running ? (
                    <Pause className="w-3.5 h-3.5" />
                  ) : (
                    <Play className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={onResetTimer}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  aria-label="Reset timer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={onDismissTimer}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  aria-label="Dismiss timer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <span className="text-xs font-medium text-[var(--text-secondary)] tabular-nums sm:px-2 whitespace-nowrap">
                Step {safeStep} / {totalSteps}
              </span>
            )}

            <button
              type="button"
              onClick={onToggleVoice}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-[var(--accent-primary)] ${
                voiceEnabled
                  ? 'bg-[var(--accent-secondary)] text-white'
                  : 'bg-[var(--surface-inset)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title={
                voiceEnabled
                  ? 'Hands-free voice guide active'
                  : 'Read current step aloud'
              }
              aria-label={
                voiceEnabled
                  ? 'Disable voice step reading'
                  : 'Enable voice step reading'
              }
            >
              {voiceEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Right: Next Step or Open Countertop Cook Mode */}
          <div className="flex items-center gap-2 shrink-0">
            {!isCookModeOpen && (
              <button
                type="button"
                onClick={onOpenCookMode}
                className="hidden sm:inline-flex items-center h-10 px-4 rounded-full text-xs font-semibold bg-[var(--surface-inset)] text-[var(--text-primary)] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
              >
                Cook Mode
              </button>
            )}
            <button
              type="button"
              onClick={onNextStep}
              className="h-10 px-4 sm:px-5 rounded-full text-xs sm:text-sm font-semibold text-white bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] active:scale-[0.98] transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary)]"
            >
              <span>
                {currentStepIndex + 1 < totalSteps ? 'Next Step' : 'Finish Dish'}
              </span>
              <ChevronRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
