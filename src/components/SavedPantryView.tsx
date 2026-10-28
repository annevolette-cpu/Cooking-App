import React, { useState } from 'react';
import { Bookmark, Check, Plus, Trash2 } from 'lucide-react';
import { PantryItem, Recipe, ThemeMode } from '../types';
import { RecipeImage } from './RecipeImage';

interface SavedPantryViewProps {
  savedRecipes: Recipe[];
  pantryItems: PantryItem[];
  themeMode: ThemeMode;
  onOpenRecipe: (recipeId: string) => void;
  onRemoveSaved: (recipeId: string) => void;
  onTogglePantryItem: (itemId: string) => void;
  onAddCustomPantryItem: (name: string, quantityText: string) => void;
  onClearCheckedPantry: () => void;
  onBrowseRecipes: () => void;
}

export const SavedPantryView: React.FC<SavedPantryViewProps> = ({
  savedRecipes,
  pantryItems,
  themeMode,
  onOpenRecipe,
  onRemoveSaved,
  onTogglePantryItem,
  onAddCustomPantryItem,
  onClearCheckedPantry,
  onBrowseRecipes,
}) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('');
  const isCalm = themeMode === ThemeMode.Calm;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    onAddCustomPantryItem(
      newItemName.trim(),
      newItemQty.trim() || '1 item'
    );
    setNewItemName('');
    setNewItemQty('');
  };

  const checkedCount = pantryItems.filter((i) => i.checked).length;

  return (
    <div className="max-w-[1160px] mx-auto px-5 sm:px-8 pt-8 pb-28 space-y-14">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Saved Recipes Collection */}
        <section className="lg:col-span-7" aria-labelledby="saved-box-heading">
          <div className="flex items-baseline justify-between pb-4 mb-6 border-b border-[var(--border-hairline)]">
            <div>
              <h1
                id="saved-box-heading"
                className="font-display-theme text-2xl sm:text-3xl font-semibold text-[var(--text-primary)]"
              >
                Saved Recipe Box
              </h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Bookmarked dishes kept ready for slow weekends and weeknight suppers.
              </p>
            </div>
            <span className="text-xs font-semibold tabular-nums text-[var(--text-secondary)]">
              {savedRecipes.length} saved
            </span>
          </div>

          {savedRecipes.length === 0 ? (
            <div className="p-10 rounded-[var(--radius-card)] bg-[var(--surface)] border border-[var(--border-hairline)] text-center">
              <p className="font-display-theme text-lg font-medium text-[var(--text-primary)] mb-2">
                Your recipe box is resting quietly
              </p>
              <p className="text-sm text-[var(--text-secondary)] mb-5 max-w-md mx-auto">
                Save seasonal bakes, broths, and morning porridges from the journal to gather them here.
              </p>
              <button
                type="button"
                onClick={onBrowseRecipes}
                className="h-10 px-5 rounded-full text-xs font-semibold text-white bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] transition-colors"
              >
                Explore Community Recipes
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {savedRecipes.map((recipe) => (
                <article
                  key={recipe.id}
                  onClick={() => onOpenRecipe(recipe.id)}
                  className="group cursor-pointer rounded-[var(--radius-card)] bg-[var(--surface)] border border-[var(--border-hairline)] overflow-hidden flex flex-col transition-transform duration-150 hover:-translate-y-0.5"
                  style={{ boxShadow: 'var(--shadow-card)' }}
                >
                  <div className="aspect-[16/10] overflow-hidden bg-[var(--surface-inset)]">
                    <RecipeImage
                      src={recipe.imageUrl}
                      alt={recipe.imageAlt}
                      title={recipe.title}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] tabular-nums mb-2">
                        <span>{recipe.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{recipe.prepMinutes + recipe.cookMinutes} min</span>
                        <span aria-hidden="true">·</span>
                        <span>{recipe.difficulty}</span>
                      </div>
                      <h2 className="font-display-theme text-lg font-semibold text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-primary)] transition-colors">
                        {recipe.title}
                      </h2>
                    </div>
                    <div className="pt-3 mt-3 border-t border-[var(--border-hairline)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
                      <span>{recipe.authorName}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveSaved(recipe.id);
                        }}
                        className="inline-flex items-center gap-1 font-semibold text-[var(--accent-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                        aria-label={`Remove ${recipe.title} from saved box`}
                      >
                        <Bookmark className="w-3.5 h-3.5 fill-current" />
                        <span>Saved</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Consolidated Market & Pantry Checklist */}
        <section
          className="lg:col-span-5 bg-[var(--surface)] border border-[var(--border-hairline)] rounded-[var(--radius-card)] p-6 sm:p-7"
          style={{ boxShadow: 'var(--shadow-card)' }}
          aria-labelledby="pantry-list-heading"
        >
          <div className="flex items-center justify-between gap-2 pb-4 mb-5 border-b border-[var(--border-hairline)]">
            <div>
              <h2
                id="pantry-list-heading"
                className="font-display-theme text-xl font-semibold text-[var(--text-primary)]"
              >
                Market &amp; Pantry Checklist
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5 tabular-nums">
                {pantryItems.length - checkedCount} remaining · {checkedCount} gathered
              </p>
            </div>

            {checkedCount > 0 && (
              <button
                type="button"
                onClick={onClearCheckedPantry}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors whitespace-nowrap shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Gathered</span>
              </button>
            )}
          </div>

          {/* Add Custom Pantry Staple */}
          <form onSubmit={handleAddItem} className="flex items-center gap-2 mb-5">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Add market item (e.g., Flaky sea salt)"
              aria-label="Market item name"
              className="flex-1 min-w-0 h-10 px-3 rounded-[var(--radius-control)] bg-[var(--surface-inset)] border border-[var(--border-hairline)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
            <input
              type="text"
              value={newItemQty}
              onChange={(e) => setNewItemQty(e.target.value)}
              placeholder="250 g"
              aria-label="Quantity"
              className="w-20 h-10 px-2.5 rounded-[var(--radius-control)] bg-[var(--surface-inset)] border border-[var(--border-hairline)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
            <button
              type="submit"
              className="w-10 h-10 rounded-[var(--radius-control)] flex items-center justify-center text-white bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] transition-colors shrink-0"
              aria-label="Add item to pantry list"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>

          {pantryItems.length === 0 ? (
            <p className="text-sm text-[var(--text-secondary)] py-6 text-center">
              Your market basket is empty. Send ingredients from any recipe or jot down staples above.
            </p>
          ) : (
            <ul className="divide-y divide-[var(--border-hairline)]">
              {pantryItems.map((item) => (
                <li key={item.id} className="py-3">
                  <button
                    type="button"
                    onClick={() => onTogglePantryItem(item.id)}
                    className="w-full flex items-start justify-between gap-3 text-left"
                  >
                    <span className="flex items-start gap-3 min-w-0">
                      <span
                        className={`mt-0.5 w-5 h-5 shrink-0 flex items-center justify-center border-[1.5px] transition-colors ${
                          isCalm ? 'rounded-[6px]' : 'rounded-full'
                        } ${
                          item.checked
                            ? isCalm
                              ? 'bg-[#8AA39B] border-[#8AA39B] text-white'
                              : 'bg-[#657257] border-[#657257] text-white'
                            : 'border-[var(--border-hairline)] bg-[var(--surface)]'
                        }`}
                      >
                        {item.checked && <Check className="w-3 h-3 stroke-[2.5]" />}
                      </span>
                      <span className="min-w-0">
                        <span
                          className={`block text-sm transition-colors ${
                            item.checked
                              ? 'line-through text-[var(--text-muted)]'
                              : 'text-[var(--text-primary)]'
                          }`}
                        >
                          {item.name}
                        </span>
                        <span className="block text-xs text-[var(--text-muted)] truncate">
                          {item.recipeTitle}
                        </span>
                      </span>
                    </span>
                    <span className="text-xs font-semibold tabular-nums text-[var(--text-secondary)] shrink-0">
                      {item.quantityText}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};
