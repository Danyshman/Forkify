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

const showRecipes = recipes => {
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

const createButton = (page, type) => {
	const htmlCode = `
  <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
  <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
    <svg class="search__icon">
      <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
    </svg>
  </button>`;
	return htmlCode;
};

const renderButtons = (page, numRecipes, resPerPage) => {
	const pages = Math.ceil(numRecipes / resPerPage);
	let button;
	if (page === 1 && pages > 1) {
		button = createButton(page, 'next');
	} else if (page === pages && pages > 1) {
		button = createButton(page, 'prev');
	} else if (page > 1 && page < pages) {
		button = `
    ${createButton(page, 'prev')}
    ${createButton(page, 'next')}
    `;
	} else if (page === 1 && pages == 1) {
		button = '';
	}
	elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
	const start = (page - 1) * resPerPage;
	const end = page * resPerPage;
	showRecipes(recipes.slice(start, end));
	renderButtons(page, recipes.length, resPerPage);
};

export const clearRecipeList = () => {
	elements.recipesList.innerHTML = '';
	elements.searchResPages.innerHTML = '';
};

export const clearInput = () => {
	elements.searchInput.value = '';
};

export const highlightSelected = id => {
	const resultsArr = Array.from(document.querySelectorAll('.results_link'));
	resultsArr.forEach(el => {
		el.classList.remove('results__link--active');
	});
	document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
};
