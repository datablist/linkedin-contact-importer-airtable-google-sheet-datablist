// src/content.ts
import { browser } from "webextension-polyfill-ts";
import { renderSearchResultsBtn, renderSaveAllBtn } from './listingSaveAction'
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
const resultItemsSelector = '.search-results__list li.search-result';
const resultsAllSelector = '.artdeco-pagination';


const analysePage = async () => {
    if (isOnProfilePage() && !hasElement(saveProfileBtnIdentifier, document)) {
        await renderAddProfileBtn(document.querySelector(profileCardSelector));
    }
    if (isOnSearchPage()) {
        await renderSearchResultsBtn(document.querySelectorAll(resultItemsSelector));
        await renderSaveAllBtn(document.querySelector(resultsAllSelector));
    }
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
