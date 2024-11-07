class SearchView{
    _parentElement = document.querySelector('.search');
    #queryElement = this._parentElement.querySelector('.search__field');

    getQuery(){
        const query = this.#queryElement.value;    
        this.#clearInputField();
        return query;
    }

    #clearInputField(){
        this.#queryElement.value = '';
    }

    addSearchHandler(handler){
        this._parentElement.addEventListener('submit', function(e){
            e.preventDefault();
            handler();
        });
    }
}

export default new SearchView();