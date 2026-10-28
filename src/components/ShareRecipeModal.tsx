import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Recipe } from '../types';
import ryeSourdoughTartine from '../assets/images/rye_sourdough_tartine_1793163190597.jpg';

interface ShareRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublishRecipe: (newRecipe: Recipe) => void;
}

export const ShareRecipeModal: React.FC<ShareRecipeModalProps> = ({
  isOpen,
  onClose,
  onPublishRecipe,
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('Supper');
  const [dietaryLabel, setDietaryLabel] = useState('Vegetarian');
  const [prepMinutes, setPrepMinutes] = useState(15);
  const [cookMinutes, setCookMinutes] = useState(25);
  const [authorName, setAuthorName] = useState('');
  const [ingredientsText, setIngredientsText] = useState(
    '250 g heirloom carrots, scrubbed\n2 tbsp cold-pressed olive oil\n1 tsp flaky sea salt'
  );
  const [stepsText, setStepsText] = useState(
    'Roast carrots whole on a hot stone tray until blistered and sweet.\nSpoon over chilled labneh and finish with dill fronds.'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedIngredients = ingredientsText
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line, index) => {
        const match = line.match(/^([\d.]+)\s*([a-zA-Z]+)\s+(.+)$/);
        if (match) {
          const val = parseFloat(match[1]) || 1;
          return {
            id: `custom-ing-${Date.now()}-${index}`,
            name: match[3],
            metricAmount: val,
            metricUnit: match[2],
            imperialAmount: val,
            imperialUnit: match[2],
            aisle: 'Pantry & Produce',
          };
        }
        return {
          id: `custom-ing-${Date.now()}-${index}`,
          name: line,
          metricAmount: 1,
          metricUnit: 'portion',
          imperialAmount: 1,
          imperialUnit: 'portion',
          aisle: 'Pantry & Produce',
        };
      });

    const parsedSteps = stepsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((line, index) => ({
        stepNumber: index + 1,
        title: `Step ${index + 1}`,
        instruction: line,
        sensoryCue: 'Cook gently until fragrant and tender.',
        timerSeconds: index === 0 ? cookMinutes * 60 : undefined,
        timerLabel: index === 0 ? 'Main cook' : undefined,
      }));

    const created: Recipe = {
      id: `community-recipe-${Date.now()}`,
      title: title.trim(),
      subtitle:
        subtitle.trim() ||
        'A seasonal home recipe contributed to the community table.',
      category,
      season: 'All Seasons',
      prepMinutes: Number(prepMinutes) || 15,
      cookMinutes: Number(cookMinutes) || 20,
      difficulty: 'Gentle',
      dietaryLabel,
      baseServings: 4,
      rating: 5.0,
      notesCount: 1,
      authorName: authorName.trim() || 'Community Member',
      authorLocation: 'Home Kitchen',
      imageUrl: ryeSourdoughTartine,
      imageAlt: title.trim(),
      nutrition: {
        calories: 320,
        proteinGrams: 11,
        fiberGrams: 7,
        carbsGrams: 34,
      },
      ingredients:
        parsedIngredients.length > 0
          ? parsedIngredients
          : [
              {
                id: 'default-ing-1',
                name: 'Seasonal market produce',
                metricAmount: 400,
                metricUnit: 'g',
                imperialAmount: 14,
                imperialUnit: 'oz',
                aisle: 'Produce',
              },
            ],
      steps:
        parsedSteps.length > 0
          ? parsedSteps
          : [
              {
                stepNumber: 1,
                title: 'Prepare & season mindfully',
                instruction:
                  'Combine prepared ingredients and cook gently until fragrant.',
                sensoryCue: 'Warm aroma and balanced seasoning.',
              },
            ],
      communityNotes: [
        {
          id: `cn-init-${Date.now()}`,
          authorName: authorName.trim() || 'Community Member',
          authorRole: 'Recipe Author',
          location: 'Home Kitchen',
          dateLabel: 'Just now',
          comment: 'Shared fresh from our kitchen notebook.',
        },
      ],
    };

    onPublishRecipe(created);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-recipe-title"
    >
      <div
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[var(--radius-card)] bg-[var(--surface)] border border-[var(--border-hairline)] p-6 sm:p-8"
        style={{ boxShadow: 'var(--shadow-float)' }}
      >
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[var(--border-hairline)]">
          <h2
            id="share-recipe-title"
            className="font-display-theme text-2xl font-semibold text-[var(--text-primary)]"
          >
            Share a Kitchen Recipe
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-inset)] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="recipe-title"
              className="block text-xs font-semibold text-[var(--text-secondary)] mb-1"
            >
              Recipe Title
            </label>
            <input
              id="recipe-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Browned Butter Roasted Fennel & Dill"
              className="w-full h-11 px-3.5 rounded-[var(--radius-control)] bg-[var(--surface-inset)] border border-[var(--border-hairline)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>

          <div>
            <label
              htmlFor="recipe-subtitle"
              className="block text-xs font-semibold text-[var(--text-secondary)] mb-1"
            >
              Short Editorial Introduction
            </label>
            <input
              id="recipe-subtitle"
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Describe the textures, season, or occasion..."
              className="w-full h-11 px-3.5 rounded-[var(--radius-control)] bg-[var(--surface-inset)] border border-[var(--border-hairline)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label
                htmlFor="recipe-cat"
                className="block text-xs font-semibold text-[var(--text-secondary)] mb-1"
              >
                Course
              </label>
              <select
                id="recipe-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-11 px-3 rounded-[var(--radius-control)] bg-[var(--surface-inset)] border border-[var(--border-hairline)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              >
                <option value="Morning">Morning</option>
                <option value="Midday">Midday</option>
                <option value="Supper">Supper</option>
                <option value="Baking">Baking</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="recipe-diet"
                className="block text-xs font-semibold text-[var(--text-secondary)] mb-1"
              >
                Dietary
              </label>
              <select
                id="recipe-diet"
                value={dietaryLabel}
                onChange={(e) => setDietaryLabel(e.target.value)}
                className="w-full h-11 px-3 rounded-[var(--radius-control)] bg-[var(--surface-inset)] border border-[var(--border-hairline)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              >
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan Option">Vegan Option</option>
                <option value="Gluten-Free">Gluten-Free</option>
                <option value="Seasonal">Seasonal</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="recipe-prep"
                className="block text-xs font-semibold text-[var(--text-secondary)] mb-1"
              >
                Prep (min)
              </label>
              <input
                id="recipe-prep"
                type="number"
                min={1}
                value={prepMinutes}
                onChange={(e) => setPrepMinutes(Number(e.target.value))}
                className="w-full h-11 px-3 rounded-[var(--radius-control)] bg-[var(--surface-inset)] border border-[var(--border-hairline)] text-sm tabular-nums text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            <div>
              <label
                htmlFor="recipe-cook"
                className="block text-xs font-semibold text-[var(--text-secondary)] mb-1"
              >
                Cook (min)
              </label>
              <input
                id="recipe-cook"
                type="number"
                min={0}
                value={cookMinutes}
                onChange={(e) => setCookMinutes(Number(e.target.value))}
                className="w-full h-11 px-3 rounded-[var(--radius-control)] bg-[var(--surface-inset)] border border-[var(--border-hairline)] text-sm tabular-nums text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="recipe-author"
              className="block text-xs font-semibold text-[var(--text-secondary)] mb-1"
            >
              Your Name
            </label>
            <input
              id="recipe-author"
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="e.g., Signe Lindholm"
              className="w-full h-11 px-3.5 rounded-[var(--radius-control)] bg-[var(--surface-inset)] border border-[var(--border-hairline)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>

          <div>
            <label
              htmlFor="recipe-ings"
              className="block text-xs font-semibold text-[var(--text-secondary)] mb-1"
            >
              Ingredients (one per line, e.g. 250 g carrots)
            </label>
            <textarea
              id="recipe-ings"
              rows={3}
              value={ingredientsText}
              onChange={(e) => setIngredientsText(e.target.value)}
              className="w-full p-3 rounded-[var(--radius-control)] bg-[var(--surface-inset)] border border-[var(--border-hairline)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>

          <div>
            <label
              htmlFor="recipe-steps"
              className="block text-xs font-semibold text-[var(--text-secondary)] mb-1"
            >
              Preparation Steps (one step per line)
            </label>
            <textarea
              id="recipe-steps"
              rows={3}
              value={stepsText}
              onChange={(e) => setStepsText(e.target.value)}
              className="w-full p-3 rounded-[var(--radius-control)] bg-[var(--surface-inset)] border border-[var(--border-hairline)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-5 rounded-full text-xs font-semibold bg-[var(--surface-inset)] text-[var(--text-primary)] hover:opacity-90 transition-opacity"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 px-6 rounded-full text-xs font-semibold text-white bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] transition-colors"
            >
              Publish to Community
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
