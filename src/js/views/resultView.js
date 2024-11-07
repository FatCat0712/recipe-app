import View from './View';
import previewView from "./previewView.js";

class ResultView extends View{
    _parentElement = document.querySelector('.results');
    _errorMessage = 'No recipes found for your query. Please try again!';

    _generateMarkup(){
        // Collect all the markups of the elements in the data
        // Need to call render() because we need the this keyword to set to the element in data
        const markup = this._data.map(preview => previewView.render(preview, false)).join('');
        return markup;
    }


}

export default new ResultView();