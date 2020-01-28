// https://api.spoonacular.com/recipes/search
import axios from 'axios';

async function getResults(query) {
	const proxy = 'https://cors-anywhere.herokuapp.com/';
	const key = 'c772090e9466428483b9c61a988c8a03';
	console.log('start');
	const result = await axios(`${proxy}https://api.spoonacular.com/recipes/search?apiKey=${key}&query=${query}`);
	console.log(result);
	console.log('end');
}

getResults('pizza');
