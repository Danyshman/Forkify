import Search from './models/Search';
import elements from './views/base';
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
		searchView.clearRecipeList();
		await state.search.getRecipes();
		searchView.showRecipes(state.search.recipes);
	}
}
