import Search from './models/Search';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';

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
			recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
		} catch (error) {
			alert(error);
		}
	}
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// List Controller

const controlList = () => {
	// Create a new list if there none yet
	if (!state.list) state.list = new List();

	// Add each ingredient to the shopping list and UI
	state.recipe.parseIngredients.forEach(el => {
		const item = state.list.addItem(el.count, el.unit, el.ingredient);
		listView.renderItem(item);
	});
};

// Handle delete and update list item events

elements.shopping.addEventListener('click', event => {
	const id = event.target.closest('.shopping__item').dataset.itemid;
	// Handle the delete button
	if (event.target.matches('.shopping__delete, .shopping_delete *')) {
		// Delete from state
		state.list.deleteItem(id);
		// Delete from UI
		listView.deleteItem(id);

		// Handle update button
	} else if (event.target.matches('shopping__count-value')) {
		const val = parseFloat(event.target.value, 10);
		state.list.updateCount(id, val);
	}
});

// LIKE Controller

const controlLike = () => {
	if (!state.likes) state.likes = new Likes();
	const currentID = state.recipe.id;
	// User has not yet liked current recipe
	if (!state.likes.isLiked(currentID)) {
		// Add like to the state
		const newLike = state.likes.addLike(currentID, state.recipe.title, state.recipe.author, state.recipe.img);

		// Toggle the like button
		likesView.toggleLikeBtn(true);
		// Add like to UI list
		likesView.renderLike(newLike);
		// User has liked current recipe
	} else {
		// Remove like from the state
		state.likes.deleteLike(currentID);
		// Toggle the like button
		likesView.toggleLikeBtn(false);
		// Remove like from UI list
		likesView.deleteLike(currentID);
	}
	likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipes on page load
window.addEventListener('load', () => {
	state.likes = new Likes();
	// Restore likes
	state.likes.readStorage();
	// Toggle like menu button
	likesView.toggleLikeMenu(state.likes.getNumLikes());
	// Render the existing likes
	state.likes.likes.forEach(like => {
		likesView.renderLike(like);
	});
});

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
	} else if (e.target.matches('.recipe__btn--add', '.recipe__btn--add *')) {
		// Add ingredients to shopping list
		controlList();
	} else if (e.target.matches('.recipe__love ,recipe__love *')) {
		// Like controller
		controlLike();
	}
});
