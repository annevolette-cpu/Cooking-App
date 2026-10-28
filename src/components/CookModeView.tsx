import React, { useEffect } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  Play,
  Volume2,
  CheckCircle2,
} from 'lucide-react';
import {
  ActiveTimer,
  Recipe,
  UnitSystem,
} from '../types';
import {
  formatScaledAmount,
  formatTimerClock,
  speakInstructionText,
} from '../utils/formatters';

interface CookModeViewProps {
  recipe: Recipe;
  servings: number;
  unitSystem: UnitSystem;
  currentStepIndex: number;
  onChangeStep: (nextIndex: number) => void;
  onStartStepTimer: (
    recipe: Recipe,
    stepNumber: number,
    label: string,
    seconds: number
  ) => void;
  activeTimer: ActiveTimer | null;
  voiceEnabled: boolean;
  onExitCookMode: () => void;
}

export const CookModeView: React.FC<CookModeViewProps> = ({
  recipe,
  servings,
  unitSystem,
  currentStepIndex,
  onChangeStep,
  onStartStepTimer,
  activeTimer,
  voiceEnabled,
  onExitCookMode,
}) => {
  const totalSteps = recipe.steps.length;
  const safeIndex = Math.min(Math.max(0, currentStepIndex), totalSteps - 1);
  const currentStep = recipe.steps[safeIndex];
  const scaleFactor = servings / recipe.baseServings;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        if (safeIndex + 1 < totalSteps) onChangeStep(safeIndex + 1);
      } else if (e.key === 'ArrowLeft') {
        if (safeIndex > 0) onChangeStep(safeIndex - 1);
      } else if (e.key === 'Escape') {
        onExitCookMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [safeIndex, totalSteps, onChangeStep, onExitCookMode]);

  useEffect(() => {
    if (voiceEnabled && currentStep) {
      speakInstructionText(
        `Step ${currentStep.stepNumber}. ${currentStep.title}. ${currentStep.instruction}`
      );
    }
  }, [safeIndex, voiceEnabled, currentStep]);

  const progressPercent = ((safeIndex + 1) / totalSteps) * 100;
  const isStepTimerActive =
    activeTimer?.recipeId === recipe.id &&
    activeTimer?.stepNumber === currentStep.stepNumber;

  return (
    <section className="max-w-4xl mx-auto px-5 sm:px-8 pt-6 pb-32">
      {/* Top Countertop Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[var(--border-hairline)]">
        <button
          type="button"
          onClick={onExitCookMode}
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors whitespace-nowrap shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Countertop Mode</span>
        </button>

        <div className="text-right">
          <p className="text-xs font-medium text-[var(--text-secondary)]">
            {recipe.title}
          </p>
          <p className="text-xs font-semibold tabular-nums text-[var(--text-primary)]">
            Step {safeIndex + 1} of {totalSteps} · Use ← / → keys
          </p>
        </div>
      </div>

      {/* Linear Step Progress Bar */}
      <div
        className="w-full h-1.5 rounded-full bg-[var(--surface-inset)] overflow-hidden mb-8"
        role="progressbar"
        aria-valuenow={safeIndex + 1}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
      >
        <div
          className="h-full bg-[var(--accent-primary)] transition-transform duration-200 origin-left"
          style={{ transform: `scaleX(${progressPercent / 100})` }}
        />
      </div>

      {/* Focused Step Card */}
      <div
        className="p-7 sm:p-11 rounded-[var(--radius-card)] bg-[var(--surface)] border border-[var(--border-hairline)] mb-8"
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        <div className="flex items-center justify-between gap-4 mb-5">
          <span className="font-display-theme text-3xl sm:text-4xl font-semibold tabular-nums text-[var(--accent-secondary)]">
            0{currentStep.stepNumber}
          </span>

          <button
            type="button"
            onClick={() =>
              speakInstructionText(
                `Step ${currentStep.stepNumber}. ${currentStep.title}. ${currentStep.instruction}`
              )
            }
            className="h-9 px-3.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 bg-[var(--surface-inset)] text-[var(--text-primary)] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Read Step Aloud</span>
          </button>
        </div>

        <h1 className="font-display-theme text-2xl sm:text-4xl font-semibold text-[var(--text-primary)] mb-5">
          {currentStep.title}
        </h1>

        <p className="text-lg sm:text-[21px] sm:leading-[1.7] text-[var(--text-primary)] mb-8 max-w-[62ch]">
          {currentStep.instruction}
        </p>

        <div className="pt-6 border-t border-[var(--border-hairline)] flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-[var(--text-secondary)]">
            <span className="font-semibold text-[var(--text-primary)]">
              What to look for:{' '}
            </span>
            {currentStep.sensoryCue}
          </p>

          {currentStep.timerSeconds && (
            <button
              type="button"
              onClick={() =>
                onStartStepTimer(
                  recipe,
                  currentStep.stepNumber,
                  currentStep.timerLabel || `Step ${currentStep.stepNumber}`,
                  currentStep.timerSeconds!
                )
              }
              className={`h-11 px-5 rounded-full text-sm font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
                isStepTimerActive
                  ? 'bg-[var(--accent-primary)] text-white'
                  : 'bg-[var(--surface-inset)] text-[var(--text-primary)] border border-[var(--border-hairline)] hover:border-[var(--accent-primary)]'
              }`}
            >
              {isStepTimerActive ? (
                <>
                  <Clock className="w-4 h-4" />
                  <span className="tabular-nums">
                    Running · {formatTimerClock(activeTimer.remainingSeconds)}
                  </span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span className="tabular-nums">
                    Start {Math.round(currentStep.timerSeconds / 60)} min Timer (
                    {currentStep.timerLabel})
                  </span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Step Navigation & Reference Pantry Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <button
          type="button"
          disabled={safeIndex === 0}
          onClick={() => onChangeStep(Math.max(0, safeIndex - 1))}
          className="h-12 px-6 rounded-full text-sm font-semibold inline-flex items-center gap-2 bg-[var(--surface)] border border-[var(--border-hairline)] text-[var(--text-primary)] disabled:opacity-40 hover:bg-[var(--surface-inset)] transition-colors whitespace-nowrap shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Step</span>
        </button>

        <div className="flex items-center gap-1.5">
          {recipe.steps.map((s, idx) => (
            <button
              key={s.stepNumber}
              type="button"
              onClick={() => onChangeStep(idx)}
              className={`h-2.5 rounded-full transition-all ${
                idx === safeIndex
                  ? 'w-8 bg-[var(--accent-primary)]'
                  : idx < safeIndex
                  ? 'w-2.5 bg-[var(--accent-secondary)]'
                  : 'w-2.5 bg-[var(--border-hairline)]'
              }`}
              aria-label={`Jump to step ${s.stepNumber}`}
            />
          ))}
        </div>

        {safeIndex + 1 < totalSteps ? (
          <button
            type="button"
            onClick={() => onChangeStep(safeIndex + 1)}
            className="h-12 px-7 rounded-full text-sm font-semibold inline-flex items-center gap-2 text-white bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] transition-colors whitespace-nowrap shrink-0"
          >
            <span>Next Step</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onExitCookMode}
            className="h-12 px-7 rounded-full text-sm font-semibold inline-flex items-center gap-2 text-white bg-[var(--accent-secondary)] hover:opacity-95 transition-opacity whitespace-nowrap shrink-0"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Complete &amp; Serve</span>
          </button>
        )}
      </div>

      {/* Quiet Scaled Ingredients Reference */}
      <div className="pt-8 border-t border-[var(--border-hairline)]">
        <h2 className="font-display-theme text-lg font-semibold text-[var(--text-primary)] mb-4">
          Countertop Mise en Place ({servings} servings)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 text-sm">
          {recipe.ingredients.map((ing) => (
            <div
              key={ing.id}
              className="flex items-baseline justify-between gap-4 py-1.5 border-b border-[var(--border-hairline)]"
            >
              <span className="text-[var(--text-secondary)]">{ing.name}</span>
              <span className="font-semibold tabular-nums text-[var(--text-primary)] shrink-0">
                {formatScaledAmount(ing, scaleFactor, unitSystem)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
