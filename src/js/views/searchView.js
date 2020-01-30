import { elements } from './base';
import { IMG_URL } from '../../constants';

export const getInput = () => elements.searchInput.value;

const limitRecipeTitle = (title, limit = 17) => {
	const newTitle = [];
	if (title.length > limit) {
		title.split(' ').reduce((acc, cur) => {
			if (acc + cur.length <= limit) {
				newTitle.push(cur);
			}
			return acc + cur.length;
		}, 0);
		return `${newTitle.join(' ')}...`;
	}
	return title;
};

export const showRecipes = recipes => {
	for (const recipe of recipes) {
		const htmlCode = `<li><a class="results__link results__link" href="#${recipe.id}">
      <figure class="results__fig">
          <img src="${IMG_URL + '/' + recipe.id + '-90x90.jpg'}" alt="Test">
      </figure>
      <div class="results__data">
        <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
          <p class="results__author">Ready in ${recipe.readyInMinutes}</p>
      </div>
        </a>
    </li>`;
		elements.recipesList.insertAdjacentHTML('beforeend', htmlCode);
	}
};

export const clearRecipeList = () => {
	elements.recipesList.innerHTML = '';
};

export const clearInpurt = () => {
	elements.searchInput.value = '';
};
