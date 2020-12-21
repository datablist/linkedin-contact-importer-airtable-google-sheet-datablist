import { browser } from "webextension-polyfill-ts";
import { LinkedInProfile } from '../Profile'
import { createBtn, disableButton } from './button'

function getProfileNameFromTitle(): string | null{
    if (document.title && document.title.length) {
        return document.title.replace(/\([0-9]+\)/, '').replace(/\|?[ ]*linkedin/i, "").trim()
    } else {
        return null
    }
}

function getProfileLink(): string{
    return window.location.href;
}

function findProfileTitle(node: Element): string | null {
    const titleNode = node.querySelector('h2');
    if(!titleNode || !titleNode.textContent)
        return null;

    return titleNode.textContent.trim();
}

function findProfileImage(node: Element): string | null {
    const imageNode = node.querySelector('.pv-top-card--photo img') as HTMLImageElement;

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

    // browser.runtime.sendMessage({ saveProfile: "COCUOCUUC" });

    const profile:LinkedInProfile = {
        name: getProfileNameFromTitle(),
        link: getProfileLink(),
        title: findProfileTitle(topCardElement),
        imageSrc: findProfileImage(topCardElement)
    }

    browser.runtime.sendMessage({
        action: "saveProfiles",
        payload: [profile]
    });

    // Remplace btn text
    const successText = "Imported!"
    if(target.nodeName.toLowerCase() !== "button"){ // Mean click on inner elem in button
        const btnNode = target.closest("button");
        if(btnNode){
            disableButton(btnNode, successText)
        }
    }else{
        disableButton(target, successText)
    }

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

    const listActionNode = rootNode.querySelector('ul.pv-top-card--list:not(.pv-top-card--list-bullet)');

    if(listActionNode){
        const listingElem = document.createElement('li');
        listingElem.appendChild(btn)
        listActionNode.appendChild(listingElem);
    }

    // const titleNode = rootNode.querySelector('h1');
    // if (titleNode)
    //     titleNode.after(btn);
    // else
    //     rootNode.appendChild(btn);
};
