export const elements = {
	searchInput: document.querySelector('.search__field'),
	searchForm: document.querySelector('.search'),
	recipesList: document.querySelector('.results__list'),
	searchResults: document.querySelector('.results'),
	loader: document.querySelector('.loader'),
};

export const renderLoader = parent => {
	const loader = `
	<div class="loader">
		<svg>
			<use href="img/icons.svg#icon-cw"></use>
		</svg>
	</div>
	`;
	parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
	const loader = document.querySelector('.loader');
	if (loader) {
		loader.parentElement.removeChild(loader);
	}
};
