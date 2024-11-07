import { API_URL, TIMEOUT_SEC, RES_PER_PAGE, API_KEY } from './config.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    page: 1,
    results: [],
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function(data){
  const { recipe } = data.data;

  // Reformat data
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && {key: recipe.key}) // only add key if exists
    
  };

}

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key={${API_KEY}}`);
  
    state.recipe = createRecipeObject(data);
    

    // console.log(state.recipe);
  } catch (error) {
    throw error;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && {key: recipe.key})
      };
    });

    state.search.page = 1;
  } catch (error) {
    throw error;
  }
};

export const loadSearchResultsByPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ingr => {
    ingr.quantity = ingr.quantity * (newServings / state.recipe.servings);
  });

  state.recipe.servings = newServings;
};

export const addBookmark = function (recipe) {
  const isExists = state.bookmarks.some(
    markedRecipe => markedRecipe === recipe
  );

  if (!isExists) {
    state.recipe.bookmarked = true;
    state.bookmarks.push(recipe);

    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
  }
};

export const removeBookmark = function (id) {
  const index = state.bookmarks.findIndex(recipe => recipe.id === id);

  state.bookmarks.splice(index, 1);

  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));

  state.recipe.bookmarked = false;
};

const loadBookmarks = function () {
  const storage = JSON.parse(localStorage.getItem('bookmarks'));

  if (storage) {
    state.bookmarks = storage;
  }
};

loadBookmarks();

// const clearBookmark = function(){
//   localStorage.clear('bookmarks');
// }

// clearBookmark();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(entry => {
        const ingArr = entry[1].split(',').map(ing => ing.trim());
        if (ingArr.length !== 3) {
          throw new Error(
            'Wrong ingredient format ! Please use the correct format'
          );
        }
        return ingArr;
      })
      .map(entry => {
        const [quantity, unit, description] = entry;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients
    }

    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);

    console.log(data);

    state.recipe = createRecipeObject(data);

    // save new recipe bookmark
    addBookmark(state.recipe);
    
  } catch (err) {
    throw err;
  }
};
