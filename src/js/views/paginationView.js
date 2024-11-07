import icons from 'url:../../img/icons.svg';
import View from './View.js'

class PaginationView extends View{
    _parentElement = document.querySelector('.pagination');

    _generateMarkup(){
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
        const currentPage = this._data.page; 

        // On the first page
        if(currentPage === 1 && numPages > 1){
            return this._generateMarkupButton('next', currentPage + 1);
        }

        // On the other pages and < numPages
        if(currentPage > 1 && currentPage < numPages){
            return this._generateMarkupButton('prev', currentPage - 1) + this._generateMarkupButton('next', currentPage + 1);
        }

        // On the last page
        if(currentPage === numPages && numPages > 1){
            return this._generateMarkupButton('prev', currentPage - 1);
        }

        // Only one page
        if(numPages === 1){
            return '';
        }
    }

    _generateMarkupButton(direction, page){
        const isPrev = direction === 'prev';
        const direct =  isPrev ? 'prev' : 'next';
        const arrow = isPrev ? 'left' : 'right';
        return ` 
            <button class="btn--inline pagination__btn--${direct}" data-goto="${page}">
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-${arrow}"></use>
                </svg>
                <span>Page ${page}</span>
            </button>
        `;
    }

    addPaginationHandler(handler){
        this._parentElement.addEventListener('click', function(e){
            const btn = e.target.closest('.btn--inline');

            if(!btn) return;

            const goToPage = +btn.dataset.goto;
            handler(goToPage);
        })
    }

}

export default new PaginationView();