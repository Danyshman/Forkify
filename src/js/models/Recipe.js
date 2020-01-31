import axios from 'axios';
import { API_KEY } from '../../constants';
import { PROXY } from '../../constants';

export default class Recipe {
	constructor(id) {
		this.id = id;
	}

	async getRecipe() {
		try {
			const res = await axios(
				`${PROXY}https://api.spoonacular.com/recipes/${this.id}/information?apiKey=${API_KEY}&includeNutrition=false`
			);
			console.log(res);
			this.title = res.data.title;
			this.img = res.data.image;
			this.author = res.sourceName;
			this.url = res.data.sourceUrl;
			this.ingredients = res.data.extendedIngredients;
			this.instructions = res.data.analyzedInstructions[0];
			this.prepTime = res.data.preparationMinutes;
			this.servings = res.data.servings;
		} catch (error) {
			alert(error);
		}
	}

	parseIngredients() {
		const newIngredients = this.ingredients.map(el => {
			// Uniform units
			// Remove parantheses
			// Count ingredients into count
			let objIng;
			objIng = {
				id: el.id,
				count: el.amount,
				unit: el.measures.us.unitShort,
				ingredient: el.name,
			};
			return objIng;
		});
		this.ingredients = newIngredients;
	}
}
