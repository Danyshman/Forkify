import elements from './base';
import { IMG_URL } from '../../constants';

export const getInput = () => elements.searchInput.value;

export const showRecipes = recipes => {
	for (const recipe of recipes) {
		const htmlCode = `<li><a class="results__link results__link" href="#${recipe.id}">
      <figure class="results__fig">
          <img src="${IMG_URL + '/' + recipe.id + '-90x90.jpg'}" alt="Test">
      </figure>
      <div class="results__data">
        <h4 class="results__name">${recipe.title}</h4>
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
