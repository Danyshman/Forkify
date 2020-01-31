import Search from './models/Search';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
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
		searchView.clearInpurt();
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
			// Create new recipe object
			state.recipe = new Recipe(id);
			// Get recipe data
			await state.recipe.getRecipe();
			state.recipe.parseIngredients();
			// Render recipe
			console.log(state.recipe);
		} catch (error) {
			alert(error);
		}
	}
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));
