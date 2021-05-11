import { browser } from "webextension-polyfill-ts";
import { LinkedInProfile } from '../Profile'
import { createBtn, disableButton } from './button'

function getProfileNameFromTitle(): string | null{
    if (document.title && document.title.length) {
        // (23) => '' and (99+) => ''
        return document.title.replace(/\([0-9\+]+\)/, '').replace(/\|?[ ]*linkedin/i, "").trim()
    } else {
        return null
    }
}

function getCompanyNameFromExperience(node: Element): string | null{
    function method1(){
        const companyNameNode = node.querySelector('.pv-top-card--experience-list li')?.firstElementChild?.querySelector('span')

        if (!companyNameNode || !companyNameNode.textContent) {
            return null;
        }

        return companyNameNode.textContent.trim();
    }

    function method2(){
        const rightPanel = node.querySelector('.pv-text-details__right-panel li')?.firstElementChild?.querySelector('h2 div')
        if (!rightPanel || !rightPanel.textContent) {
            return null;
        }

        return rightPanel.textContent.trim();
    }

    return method1() || method2();
}

function getProfileLink(): string{
    return window.location.href;
}

function findProfileTitle(node: Element): string | null {
    const titleNode = node.querySelector('h2,.text-body-medium');
    if(!titleNode || !titleNode.textContent)
        return null;

    return titleNode.textContent.trim();
}

function findProfileImage(node: Element): string | null {
    const imageNode = node.querySelector('.pv-top-card--photo img,.pv-top-card__photo-wrapper img') as HTMLImageElement;

    if(!imageNode || !imageNode.src)
        return null;

    return imageNode.src;
}


function onClick(e: MouseEvent){
    const target = e.target as HTMLButtonElement;
    if(!target) return;

    // Find top card
    const topCardElement = target.closest("section.pv-top-card");
    if(!topCardElement) return

    const profile:LinkedInProfile = {
        name: getProfileNameFromTitle(),
        link: getProfileLink(),
        title: findProfileTitle(topCardElement),
        company: getCompanyNameFromExperience(topCardElement),
        imageSrc: findProfileImage(topCardElement)
    }

    var btnNode: HTMLButtonElement | null = null;

    browser.runtime.sendMessage({
        action: "saveProfiles",
        payload: [profile]
    }).catch( (err) => {
        console.log(err)
        const errorText = 'Error while importing!';
        if(btnNode) disableButton(btnNode, errorText)
    });

    // Remplace btn text
    const successText = "Imported!"
    if(target.nodeName.toLowerCase() !== "button"){ // Mean click on inner elem in button
        const button = target.closest("button");
        if(button){
            btnNode = button;
        }
    }else{
        btnNode = target;
    }

    if(btnNode) btnNode = disableButton(btnNode, successText)

    e.preventDefault();
}


export const saveProfileBtnIdentifier = 'save-profile-extension';


export const renderAddProfileBtn = async (rootNode: HTMLDivElement | null) => {
    if(!rootNode) {
        return
    }

    const btn = await createBtn({
        btnIdentifier: saveProfileBtnIdentifier
    });
    btn.addEventListener('click', onClick, false);

    const listActionNodeOld = rootNode.querySelector('ul.pv-top-card--list:not(.pv-top-card--list-bullet)');
    if(listActionNodeOld){
        const listingElem = document.createElement('li');
        listingElem.appendChild(btn)
        listActionNodeOld.appendChild(listingElem);
    }else{
        const listActionNode = rootNode.querySelector('.pvs-profile-actions');
        if(listActionNode){
            const flexElem = document.createElement('div');
            flexElem.appendChild(btn)
            listActionNode.appendChild(flexElem);
        }
    }
};
