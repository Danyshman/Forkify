import Search from './models/Search';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';

/* Global state of the APP
 * - Search Object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */

const state = {};

elements.searchForm.addEventListener('submit', controlSearch);

async function controlSearch(event) {
	event.preventDefault();
	const query = searchView.getInput();
	if (query) {
		state.search = new Search(query);
		searchView.clearInpurt();
		renderLoader(elements.searchResults);
		await state.search.getRecipes();
		clearLoader();
		searchView.renderResults(state.search.recipes);
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
