import { browser } from "webextension-polyfill-ts";
import { LinkedInProfile } from '../Profile'
import { generateBtnId, createBtn, hasElement, disableButton } from './button'


const listingProfileElement = '.search-results__result-list .search-results__result-container > .ember-view';
const listingProfileInfoElement = '.result-lockup__profile-info';

/*
    Search page
*/
function findProfileImage(node: Element): string | null {
    const imageNode = node.querySelector('img');

    if(!imageNode || !imageNode.src || imageNode.src.indexOf('data:image') !== -1)
        return null;

    return imageNode.src;
}

function findProfileLink(node: Element): string | null {
    const linkNode = node.querySelector('a');

    if(!linkNode || !linkNode.textContent)
        return null;

    return linkNode.href;
}

function findProfileName(node: Element): string | null{
    const nameNode = node.querySelector('.result-lockup__name a');
    if(!nameNode || !nameNode.textContent)
        return null;

    return nameNode.textContent.trim();
}

function findProfileTitle(node: Element): string | null{
    const titleNode = node.querySelector('.result-lockup__highlight-keyword span:first-child');
    if(!titleNode || !titleNode.textContent)
        return null;

    return titleNode.textContent.trim();
}

async function onClickListingResult(e: MouseEvent): Promise<void> {
    const target = e.target as HTMLButtonElement;
    if(!target) return;

    // Find listing item ancestor
    const resultListingElement = target.closest(".search-results__result-container");
    if(!resultListingElement) return

    const infoNode = resultListingElement.querySelector(listingProfileInfoElement);
    if(!infoNode) return

    const profile:LinkedInProfile = {
        name: findProfileName(infoNode),
        link: findProfileLink(infoNode),
        title: findProfileTitle(infoNode),
        imageSrc: findProfileImage(resultListingElement)
    }

    var btnNode: HTMLButtonElement | null = null;

    if(target.nodeName.toLowerCase() !== "button"){ // Mean click on inner elem in button
        const button = target.closest("button");
        if(button){
            btnNode = button;
        }
    }else{
        btnNode = target;
    }

    browser.runtime.sendMessage({
        action: "saveProfiles",
        payload: [profile]
    }).catch((err) => {
        console.log(err)
        const errorText = "Error while importing!"
        if(btnNode) disableButton(btnNode, errorText)
    });

    // Remplace btn text
    const successText = "Imported!"
    if(btnNode) {
        btnNode = disableButton(btnNode, successText)
    }

    e.preventDefault();
}


export const renderSalesNavResultsBtn = async (
    resultListingElements: NodeListOf<HTMLLIElement>,
    actionsSelection: string
) => {
    for (const resultListingElement of Array.from(resultListingElements)) {
        const btnId = generateBtnId(resultListingElement)

        if(!hasElement(btnId, resultListingElement)){
            const btn = await createBtn({
                btnIdentifier: btnId
            });
            btn.addEventListener('click', onClickListingResult, false);
            const actionsNode = resultListingElement.querySelector(actionsSelection);
            if(actionsNode){
                actionsNode.appendChild(btn);
            }
        }
    }
};




function onClickSaveAll(e: MouseEvent): void {
    const target = e.target as HTMLButtonElement;
    if(!target) return;

    // Find listing items
    const resultListingElements = document.querySelectorAll(listingProfileElement) as NodeListOf<HTMLLIElement>;

    const profiles = [];
    const buttons:HTMLButtonElement[] = []

    for (const resultListingElement of Array.from(resultListingElements)) {
        const infoNode = resultListingElement.querySelector(listingProfileInfoElement);

        if(infoNode){
            const profile:LinkedInProfile = {
                name: findProfileName(infoNode),
                link: findProfileLink(infoNode),
                title: findProfileTitle(infoNode),
                imageSrc: findProfileImage(resultListingElement)
            }

            // Remplace btn text
            const btnId = generateBtnId(resultListingElement)
            const btn = resultListingElement.querySelector('#' + btnId);

            if(btn){
                buttons.push(
                    disableButton(btn as HTMLButtonElement, 'Imported!')
                )
            }

            profiles.push(profile)
        }
    }

    var btnNode: HTMLButtonElement | null = null;

    browser.runtime.sendMessage({
        action: "saveProfiles",
        payload: profiles
    }).catch( (err) => {
        console.log(err)
        const errorText = 'Error while importing!';
        buttons.map( (button) => {
            disableButton(button, errorText)
        })
        if(btnNode) disableButton(btnNode, errorText)
    });

    // Remplace btn text
    const successText = `Imported ${profiles.length} profiles!`;
    if(target.nodeName.toLowerCase() !== "button"){ // Mean click on inner elem in button
        const button = target.closest("button");
        if(button){
            btnNode = button
        }
    }else{
        btnNode = target
    }

    if(btnNode) {
        btnNode = disableButton(btnNode, successText)
    }

    e.preventDefault();
}

const saveAllId = "save-all-extension"

export const renderSaveAllSalesNavBtn = async (totalNode: HTMLDivElement | null) => {
    if(!totalNode) return

    const parent = totalNode.parentNode;
    if(!parent) return;

    async function addBtnToDiv(divElem: HTMLDivElement){
        const btn = await createBtn({
            btnIdentifier: saveAllId + '-btn',
            className: 'artdeco-button artdeco-button--tertiary',
            text: 'Save all profiles'
        });
        btn.addEventListener('click', onClickSaveAll, false);

        divElem.appendChild(btn)
    }

    // ?keywords=XXX&origin=GLOBAL_SEARCH_HEADER&page=3
    const resultPageNumber = new URLSearchParams(window.location.search).get('page') || "0";

    if(!hasElement(saveAllId, parent as Element)){
        // Place the button before the pagination, on the right
        const divElem = document.createElement('div');
        divElem.id = saveAllId;
        divElem.style.textAlign = "right";
        divElem.style.paddingRight = "20px";
        divElem.style.paddingBottom = "20px";
        divElem.dataset.page = resultPageNumber;

        addBtnToDiv(divElem)

        totalNode.before(divElem);
    } else {
        // Refresh btn on page change
        const divElem = parent.querySelector('#' + saveAllId) as HTMLDivElement;
        if(!divElem) return;

        if(divElem.dataset.page != resultPageNumber){
            const currentBtn = divElem.querySelector('button');
            if(currentBtn) currentBtn.remove()

            addBtnToDiv(divElem)
            divElem.dataset.page = resultPageNumber;
        }
    }
};
