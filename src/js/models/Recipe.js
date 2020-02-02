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
			const summary = await axios(
				`${PROXY}https://api.spoonacular.com/recipes/${this.id}/summary?apiKey=${API_KEY}&includeNutrition=false/`
			);
			this.summary = this.replaceRecipesUrls(summary.data.summary);
			this.title = res.data.title;
			this.img = res.data.image;
			this.author = res.data.sourceName;
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
				count: el.amount.toFixed(1),
				unit: el.measures.us.unitShort,
				ingredient: el.name,
			};
			return objIng;
		});
		this.ingredients = newIngredients;
	}

	replaceRecipesUrls(summary, base_url = 'http://localhost:8080/#') {
		var start;
		var end;
		var i = 0;
		while (i < summary.length - 5) {
			if (summary.slice(i, i + 2) === '<a') {
				start = i;
				var j = i + 1;
				while (summary.slice(j, j + 2) !== '">') {
					j += 1;
				}
				end = j;
				var k = j;
				var id = '';
				while ('1234567890'.includes(summary[k - 1])) {
					id = summary[k] + id;
					k -= 1;
				}
				summary =
					summary.slice(0, start) + '<a href="' + base_url + id + '>' + summary.slice(j + 2, summary.length);
			}
			i += 1;
		}
		return summary;
	}

	updateServings(type) {
		// Update servings
		const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

		// Update ingredients
		this.ingredients.forEach(el => {
			el.count *= newServings / this.servings;
		});

		this.servings = newServings;
	}
}
