import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC, FORM_RESET_SEC } from './config.js';
// https://forkify-api.herokuapp.com/v2


///////////////////////////////////////




const controlRecipe = async function(){
  try{

    const id = window.location.hash.slice(1);


    if(!id) return;

    // Rendering spinner before data arrives
    recipeView.renderSpinner();

    // Update results view to mark selected search result
    resultView.update(model.loadSearchResultsByPage());
    
    // Updating bookmarks view
    bookmarkView.update(model.state.bookmarks);


    // Loading recipe
    await model.loadRecipe(id);

    const {recipe} = model.state;

    const isBookmarked = model.state.bookmarks.some(recipe => recipe.id === id);

    if(isBookmarked) recipe.bookmarked = true;

    // Rendering recipe
    recipeView.render(recipe);

    

   

  }catch(err){
    recipeView.renderError();
  } 

}

const controlSearchResults = async function(){
  try{

    // Get search query
    const query = searchView.getQuery();

    if(!query) return;

    resultView.renderSpinner();

    // Loading search results
    await model.loadSearchResults(query);


    // Render results
    
    const resultsByPage = model.loadSearchResultsByPage(); 

    console.log(resultsByPage);

    resultView.render(resultsByPage);
    
    // Render pagination
    paginationView.render(model.state.search);


  }catch(error){
    throw error;
  }
}

const controlPagination = function(page){
  const resultsByPage = model.loadSearchResultsByPage(page); 

  resultView.render(resultsByPage);
  
  // Render pagination
  paginationView.render(model.state.search);
}   

const controlUpdateServings = function(newServings){

  model.updateServings(newServings);

  // recipeView.render(model.state.recipe);

  recipeView.update(model.state.recipe);
  
}

const controlBookmarking = function(){

  // Add/remove bookmarks
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);

  else model.removeBookmark(model.state.recipe.id);

  // Update recipe view
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarkView.render(model.state.bookmarks);
  
}

const controlLoadBookmarks = function(){
  bookmarkView.render(model.state.bookmarks);
}

const controlUpload = async function(data){
  try{
    // Show loading spinner
    addRecipeView.renderSpinner();


    // convert an array of entries into an object
    const newRecipe = Object.fromEntries(data);
    await model.uploadRecipe(newRecipe);
   
    
    // Render recipes
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // close form window
    setTimeout(function(){
      addRecipeView.toggleWindow()
    }, 1000 * MODAL_CLOSE_SEC)


    // Render bookmark view
    bookmarkView.render(model.state.bookmarks);

    // Change id to the id of new recipe in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(function(){
      addRecipeView.renderForm();
    }, 1000 * FORM_RESET_SEC);
   
    

  }
  catch(err){
    addRecipeView.renderError(err.message);
  }

}

const init = function(){
  bookmarkView.addHandlerLoadBookmark(controlLoadBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlUpdateServings);
  searchView.addSearchHandler(controlSearchResults);
  paginationView.addPaginationHandler(controlPagination);
  recipeView.addHandlerBookmark(controlBookmarking);
  addRecipeView.addHandlerSubmit(controlUpload);
}

init();





