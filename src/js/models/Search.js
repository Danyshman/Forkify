import axios from 'axios';
import { API_KEY } from './constants';
import { PROXY } from './constants';

class Search {
	constructor(query) {
		this.query = query;
	}

	async getRecipes() {
		try {
			const result = await axios(
				`${PROXY}https://api.spoonacular.com/recipes/search?apiKey=${API_KEY}&query=${this.query}`
			);
			this.recipes = result.data.results;
			console.log(recipes);
		} catch (error) {
			alert(error);
		}
	}
}

export default Search;
