// src/content.ts
import { browser } from "webextension-polyfill-ts";
import { renderSearchResultsBtn, renderSaveAllBtn } from './listingSaveAction'
import { renderSalesNavResultsBtn, renderSaveAllSalesNavBtn } from './salesNavSaveAction'
import { renderAddProfileBtn, saveProfileBtnIdentifier } from './profileSaveAction'
import { hasElement } from './button'

/*
    Profile
*/
const isOnProfilePage = () => window.location.pathname.includes('/in/');
const profileCardSelector = '.pv-top-card.artdeco-card';

/*
    Results Listing
*/
const isOnSearchPage = () => window.location.pathname.includes('/search/results/');
const resultItemsSelector = '.search-results__list li.search-result,.reusable-search__result-container';
const resultItemsActionsSelector = '.search-result__actions,.entity-result__actions';
const resultsAllSelector = '.artdeco-pagination';


/*
    Sales Navigator
*/
const isSalesNavigatorPage = () => window.location.pathname.includes('/sales/');
// We need a DOM element with an id attribute
const salesItemsSelector = '.search-results__result-list .search-results__result-container > .ember-view';
const salesItemsActionsSelector = '.result-lockup__common-actions';
const salesAllSelector = '.search-results__pagination';


const analysePage = async () => {
    if (isOnProfilePage() && !hasElement(saveProfileBtnIdentifier, document)) {
        await renderAddProfileBtn(document.querySelector(profileCardSelector));
    }
    if (isOnSearchPage()) {
        await renderSearchResultsBtn(
            document.querySelectorAll(resultItemsSelector),
            resultItemsActionsSelector
        );
        await renderSaveAllBtn(document.querySelector(resultsAllSelector));
    }
    // if (isSalesNavigatorPage()) {
    //     await renderSalesNavResultsBtn(
    //         document.querySelectorAll(salesItemsSelector),
    //         salesItemsActionsSelector
    //     );
    //     await renderSaveAllSalesNavBtn(document.querySelector(salesAllSelector));
    // }
}

browser.runtime.sendMessage({
    action: "checkIfConfigured",
    payload: null
}).then(function(isConfigured: boolean) {
    if(isConfigured) {
        const main = async () => {
            await analysePage();
            requestAnimationFrame(main);
        };
        requestAnimationFrame(main);
    }
});
