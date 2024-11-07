import previewView from "./previewView.js";
import View from "./View.js"

class BookmarkView extends View{
    _parentElement = document.querySelector('.bookmarks__list');
    _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';


    _generateMarkup(){
        // Collect all the markups of the elements in the data
        // Need to call render() because we need the this keyword to set to the element in data
        const markup = this._data.map(bookmarks => previewView.render(bookmarks, false)).join('');
        return markup;
    }

    addHandlerLoadBookmark(handler){
        window.addEventListener('load', handler);
    }
    
}

export default new BookmarkView();