import Search from './models/Search';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import Recipe from './models/Recipe';

/* Global state of the APP
 * - Search Object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */

const state = {};

elements.searchForm.addEventListener('submit', controlSearch);

// Search Controller
async function controlSearch(event) {
	event.preventDefault();
	const query = searchView.getInput();
	if (query) {
		state.search = new Search(query);
		searchView.clearInput();
		searchView.clearRecipeList();
		renderLoader(elements.searchResults);
		try {
			await state.search.getRecipes();
			clearLoader();
			searchView.renderResults(state.search.recipes);
		} catch (error) {
			alert(error);
		}
	}
}

elements.searchResPages.addEventListener('click', event => {
	const btn = event.target.closest('.btn-inline');
	if (btn) {
		const goToPage = parseInt(btn.dataset.goto, 10);
		searchView.clearRecipeList();
		searchView.renderResults(state.search.recipes, goToPage);
	}
});

// Recipe Controller

const controlRecipe = async () => {
	const id = window.location.hash.replace('#', '');
	if (id) {
		try {
			// Prepare UI for changes
			recipeView.clearRecipe();
			renderLoader(elements.recipe);
			// Highlight selected search item
			if (state.search) {
				searchView.highlightSelected(id);
			}
			// Create new recipe object
			state.recipe = new Recipe(id);
			// Get recipe data
			await state.recipe.getRecipe();
			state.recipe.parseIngredients();
			// Render recipe
			clearLoader();
			recipeView.renderRecipe(state.recipe);
		} catch (error) {
			alert(error);
		}
	}
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
	if (e.target.matches(`.btn-increase, .btn-increase *`)) {
		// Decrease button is clicked
		if (state.recipe.servings > 1) {
			state.recipe.updateServings('dec');
			recipeView.updateServingsIngredients(state.recipe);
		}
	} else if (e.target.matches(`.btn-decrease, .btn-decrease *`)) {
		// Increase button is clicked
		state.recipe.updateServings('inc');
		recipeView.updateServingsIngredients(state.recipe);
	}
});
